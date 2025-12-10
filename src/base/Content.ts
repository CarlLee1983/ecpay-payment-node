import { ChoosePayment } from '../enums/ChoosePayment'
import { EncryptType } from '../enums/EncryptType'
import { PaymentError } from '../errors/PaymentError'
import { IPaymentCommand } from '../interfaces/IPaymentCommand'
import { CheckMacEncoder } from '../security/CheckMacEncoder'
import { formatEcPayDate } from '../utils/dateUtils'

/**
 * Content
 *
 * Base abstract class for all Payment Operations and Queries.
 * Handlers common parameter setting, validation, and payload generation.
 */
export abstract class Content implements IPaymentCommand {
    public static readonly MERCHANT_TRADE_NO_MAX_LENGTH = 20
    public static readonly TRADE_DESC_MAX_LENGTH = 200
    public static readonly ITEM_NAME_MAX_LENGTH = 400

    protected requestPath = '/Cashier/AioCheckOut/V5'
    protected merchantID = ''
    protected hashKey = ''
    protected hashIV = ''
    protected choosePayment: ChoosePayment = ChoosePayment.ALL
    protected encryptType: EncryptType = EncryptType.SHA256

    protected content: Record<string, unknown> = {}
    protected encoder: CheckMacEncoder | null = null

    constructor(merchantID: string = '', hashKey: string = '', hashIV: string = '') {
        this.merchantID = merchantID
        this.hashKey = hashKey
        this.hashIV = hashIV

        this.initContent()
    }

    protected initContent(): void {
        this.content = {
            MerchantID: this.merchantID,
            MerchantTradeNo: '',
            MerchantTradeDate: formatEcPayDate(),
            PaymentType: 'aio',
            TotalAmount: 0,
            TradeDesc: '',
            ItemName: '',
            ReturnURL: '',
            ChoosePayment: this.choosePayment,
            EncryptType: this.encryptType,
        }
    }

    // Setters

    /**
     * Set MerchantID
     * @param id - The merchant ID
     */
    public setMerchantID(id: string): this {
        this.merchantID = id
        this.content.MerchantID = id
        return this
    }

    public getMerchantID(): string {
        return this.merchantID
    }

    public setHashKey(key: string): this {
        this.hashKey = key
        return this
    }

    public setHashIV(iv: string): this {
        this.hashIV = iv
        return this
    }

    /**
     * Set the merchant's trade number (must be unique).
     *
     * @param tradeNo - Merchant's unique trade no (max 20 chars)
     * @throws {PaymentError} If length exceeds 20 characters
     */
    public setMerchantTradeNo(tradeNo: string): this {
        if (tradeNo.length > Content.MERCHANT_TRADE_NO_MAX_LENGTH) {
            throw PaymentError.tooLong('MerchantTradeNo', Content.MERCHANT_TRADE_NO_MAX_LENGTH)
        }
        this.content.MerchantTradeNo = tradeNo
        return this
    }

    /**
     * Set the trade date.
     *
     * @param date - Date object or string (yyyy/MM/dd HH:mm:ss)
     */
    public setMerchantTradeDate(date: Date | string): this {
        if (date instanceof Date) {
            this.content.MerchantTradeDate = formatEcPayDate(date)
        } else {
            this.content.MerchantTradeDate = date
        }
        return this
    }

    /**
     * Set command total amount.
     *
     * @param amount - The transaction amount (must be > 0)
     * @throws {PaymentError} If amount is <= 0
     */
    public setTotalAmount(amount: number): this {
        if (amount <= 0) {
            throw PaymentError.invalid('TotalAmount', 'Amount must be greater than 0')
        }
        this.content.TotalAmount = amount
        return this
    }

    /**
     * Set trade description.
     *
     * @param desc - Description of the trade (max 200 chars)
     */
    public setTradeDesc(desc: string): this {
        if (desc.length > Content.TRADE_DESC_MAX_LENGTH) {
            throw PaymentError.tooLong('TradeDesc', Content.TRADE_DESC_MAX_LENGTH)
        }
        this.content.TradeDesc = desc
        return this
    }

    /**
     * Set item name(s).
     *
     * @param name - Item names separated by # if multiple (max 400 chars)
     */
    public setItemName(name: string): this {
        if (name.length > Content.ITEM_NAME_MAX_LENGTH) {
            throw PaymentError.tooLong('ItemName', Content.ITEM_NAME_MAX_LENGTH)
        }
        this.content.ItemName = name
        return this
    }

    /**
     * Set return URL for payment result.
     *
     * @param url - The URL to receive the payment result notification (server-to-server)
     */
    public setReturnURL(url: string): this {
        this.content.ReturnURL = url
        return this
    }

    /**
     * Set client back URL (User is redirected here after payment).
     *
     * @param url - The URL to redirect the user to
     */
    public setClientBackURL(url: string): this {
        this.content.ClientBackURL = url
        return this
    }

    /**
     * Set order result URL (User is redirected here if payment successful, instead of ECPay result page).
     *
     * @param url - The URL to show payment result details
     */
    public setOrderResultURL(url: string): this {
        this.content.OrderResultURL = url
        return this
    }

    /**
     * Set whether extra payment info is needed.
     *
     * @param needInfo - 'Y' or 'N'
     */
    public setNeedExtraPaidInfo(needInfo: 'Y' | 'N'): this {
        this.content.NeedExtraPaidInfo = needInfo
        return this
    }

    /**
     * Set custom fields.
     *
     * @param index - Field index (1-4)
     * @param value - Field value
     */
    public setCustomField(index: 1 | 2 | 3 | 4, value: string): this {
        this.content[`CustomField${index}`] = value
        return this
    }

    protected setChoosePayment(payment: ChoosePayment): this {
        this.choosePayment = payment
        this.content.ChoosePayment = payment
        return this
    }

    public setChooseSubPayment(subPayment: string): this {
        this.content.ChooseSubPayment = subPayment
        return this
    }

    public getRequestPath(): string {
        return this.requestPath
    }

    public getChoosePayment(): string {
        return this.choosePayment
    }

    public getEncoder(): CheckMacEncoder {
        if (!this.encoder) {
            this.encoder = new CheckMacEncoder(this.hashKey, this.hashIV, this.encryptType)
        }
        return this.encoder
    }

    public setEncoder(encoder: CheckMacEncoder): this {
        this.encoder = encoder
        return this
    }

    /**
     * Validate the parameters.
     * Derived classes should override this to add specific validation.
     *
     * @throws {PaymentError} if validation fails
     */
    abstract validate(): void

    /**
     * Get the final payload for the API request.
     * This triggers validation and synchronizes fields.
     */
    public getPayload(): Record<string, unknown> {
        this.validate()

        // Sync MerchantID
        this.content.MerchantID = this.merchantID

        return this.content
    }

    /**
     * Get the payload signed with CheckMacValue.
     */
    public getContent(): Record<string, unknown> {
        const payload = this.getPayload()
        const encoder = this.getEncoder()
        return encoder.encodePayload(payload)
    }

    protected validateBaseParam(): void {
        if (!this.merchantID) throw PaymentError.required('MerchantID')
        if (!this.content.MerchantTradeNo) throw PaymentError.required('MerchantTradeNo')
        const totalAmount = this.content.TotalAmount as number
        if (!totalAmount || totalAmount <= 0) throw PaymentError.required('TotalAmount')
        if (!this.content.TradeDesc) throw PaymentError.required('TradeDesc')
        if (!this.content.ItemName) throw PaymentError.required('ItemName')
        if (!this.content.ReturnURL) throw PaymentError.required('ReturnURL')
    }
}
