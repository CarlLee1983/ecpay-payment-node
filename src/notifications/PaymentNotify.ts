import { EncryptType } from '../enums/EncryptType'
import { PaymentError } from '../errors/PaymentError'
import { INotifyHandler } from '../interfaces/INotifyHandler'
import { CheckMacEncoder } from '../security/CheckMacEncoder'

/**
 * Payment Notify Handler
 *
 * Verifies ECPay notification callbacks and extracts data.
 */
export class PaymentNotify implements INotifyHandler {
    private encoder: CheckMacEncoder
    private data: Record<string, any> = {}
    private verified: boolean = false

    constructor(hashKey: string, hashIV: string, encryptType: EncryptType = EncryptType.SHA256) {
        this.encoder = new CheckMacEncoder(hashKey, hashIV, encryptType)
    }

    /**
     * Verify the received parameters.
     *
     * @param data - The request body (POST params)
     * @returns True if CheckMacValue is valid
     */
    public verify(data: Record<string, any>): boolean {
        this.data = data
        this.verified = this.encoder.verifyResponse(data)
        return this.verified
    }

    /**
     * Verify and throw if failed.
     *
     * @throws {PaymentError} If invalid
     */
    public verifyOrFail(data: Record<string, any>): this {
        if (!this.verify(data)) {
            throw PaymentError.checkMacValueFailed()
        }
        return this
    }

    /**
     * Get raw data.
     */
    public getData(): Record<string, any> {
        return this.data
    }

    /**
     * Check if payment was successful (RtnCode === '1').
     */
    public isSuccess(): boolean {
        return this.getRtnCode() === '1'
    }

    public getRtnCode(): string {
        return this.data.RtnCode ? String(this.data.RtnCode) : ''
    }

    public getRtnMsg(): string {
        return this.data.RtnMsg ? String(this.data.RtnMsg) : ''
    }

    public getMerchantTradeNo(): string {
        return this.data.MerchantTradeNo ? String(this.data.MerchantTradeNo) : ''
    }

    public getTradeNo(): string {
        return this.data.TradeNo ? String(this.data.TradeNo) : ''
    }

    public getTradeAmt(): number {
        return this.data.TradeAmt ? Number(this.data.TradeAmt) : 0
    }

    public getPaymentType(): string {
        return this.data.PaymentType ? String(this.data.PaymentType) : ''
    }

    public getPaymentDate(): string {
        return this.data.PaymentDate ? String(this.data.PaymentDate) : ''
    }

    public getMerchantID(): string {
        return this.data.MerchantID ? String(this.data.MerchantID) : ''
    }

    public isSimulatePaid(): boolean {
        return String(this.data.SimulatePaid ?? '0') === '1'
    }

    public getCustomField(index: 1 | 2 | 3 | 4): string {
        return this.data[`CustomField${index}`] ? String(this.data[`CustomField${index}`]) : ''
    }

    public isVerified(): boolean {
        return this.verified
    }

    /**
     * Get success response string to reply to ECPay.
     * @returns '1|OK'
     */
    public getSuccessResponse(): string {
        return '1|OK'
    }
}
