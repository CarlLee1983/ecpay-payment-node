import { ChoosePayment } from '../enums/ChoosePayment'
import { EncryptType } from '../enums/EncryptType'
import { PaymentError } from '../errors/PaymentError'
import { IPaymentCommand } from '../interfaces/IPaymentCommand'
import { CheckMacEncoder } from '../security/CheckMacEncoder'

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

    protected content: Record<string, any> = {}
    protected encoder: CheckMacEncoder | null = null

    constructor(merchantID: string = '', hashKey: string = '', hashIV: string = '') {
        this.merchantID = merchantID
        this.hashKey = hashKey
        this.hashIV = hashIV

        this.initContent()
    }

    protected initContent(): void {
        const date = new Date()
        const yyyy = date.getFullYear()
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const dd = String(date.getDate()).padStart(2, '0')
        const hh = String(date.getHours()).padStart(2, '0')
        const ii = String(date.getMinutes()).padStart(2, '0')
        const ss = String(date.getSeconds()).padStart(2, '0')

        this.content = {
            MerchantID: this.merchantID,
            MerchantTradeNo: '',
            MerchantTradeDate: `${yyyy}/${mm}/${dd} ${hh}:${ii}:${ss}`,
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

    public setMerchantTradeNo(tradeNo: string): this {
        if (tradeNo.length > Content.MERCHANT_TRADE_NO_MAX_LENGTH) {
            throw PaymentError.tooLong('MerchantTradeNo', Content.MERCHANT_TRADE_NO_MAX_LENGTH)
        }
        this.content.MerchantTradeNo = tradeNo
        return this
    }

    public setMerchantTradeDate(date: Date | string): this {
        if (date instanceof Date) {
            const yyyy = date.getFullYear()
            const mm = String(date.getMonth() + 1).padStart(2, '0')
            const dd = String(date.getDate()).padStart(2, '0')
            const hh = String(date.getHours()).padStart(2, '0')
            const ii = String(date.getMinutes()).padStart(2, '0')
            const ss = String(date.getSeconds()).padStart(2, '0')
            this.content.MerchantTradeDate = `${yyyy}/${mm}/${dd} ${hh}:${ii}:${ss}`
        } else {
            this.content.MerchantTradeDate = date
        }
        return this
    }

    public setTotalAmount(amount: number): this {
        if (amount <= 0) {
            throw PaymentError.invalid('TotalAmount', 'Amount must be greater than 0')
        }
        this.content.TotalAmount = amount
        return this
    }

    public setTradeDesc(desc: string): this {
        if (desc.length > Content.TRADE_DESC_MAX_LENGTH) {
            throw PaymentError.tooLong('TradeDesc', Content.TRADE_DESC_MAX_LENGTH)
        }
        this.content.TradeDesc = desc
        return this
    }

    public setItemName(name: string): this {
        if (name.length > Content.ITEM_NAME_MAX_LENGTH) {
            throw PaymentError.tooLong('ItemName', Content.ITEM_NAME_MAX_LENGTH)
        }
        this.content.ItemName = name
        return this
    }

    public setReturnURL(url: string): this {
        this.content.ReturnURL = url
        return this
    }

    public setClientBackURL(url: string): this {
        this.content.ClientBackURL = url
        return this
    }

    public setOrderResultURL(url: string): this {
        this.content.OrderResultURL = url
        return this
    }

    public setNeedExtraPaidInfo(needInfo: 'Y' | 'N'): this {
        this.content.NeedExtraPaidInfo = needInfo
        return this
    }

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

    abstract validate(): void

    public getPayload(): Record<string, any> {
        this.validate()

        // Sync MerchantID
        this.content.MerchantID = this.merchantID

        return this.content
    }

    public getContent(): Record<string, any> {
        const payload = this.getPayload()
        const encoder = this.getEncoder()
        return encoder.encodePayload(payload)
    }

    protected validateBaseParam(): void {
        if (!this.merchantID) throw PaymentError.required('MerchantID')
        if (!this.content.MerchantTradeNo) throw PaymentError.required('MerchantTradeNo')
        if (!this.content.TotalAmount || this.content.TotalAmount <= 0) throw PaymentError.required('TotalAmount')
        if (!this.content.TradeDesc) throw PaymentError.required('TradeDesc')
        if (!this.content.ItemName) throw PaymentError.required('ItemName')
        if (!this.content.ReturnURL) throw PaymentError.required('ReturnURL')
    }
}
