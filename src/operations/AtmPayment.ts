import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'
import { PaymentError } from '../errors/PaymentError'

/**
 * ATM 繳費期限限制
 */
export const ATM_EXPIRE_DATE_MIN = 1
export const ATM_EXPIRE_DATE_MAX = 60

/**
 * ATM Payment
 *
 * Generates a virtual account number for ATM transfer.
 *
 * @example
 * ```typescript
 * const payment = new AtmPayment(merchantId, hashKey, hashIV)
 *   .setMerchantTradeNo('ORDER123')
 *   .setTotalAmount(1000)
 *   .setTradeDesc('ATM 付款測試')
 *   .setItemName('商品')
 *   .setReturnURL('https://example.com/callback')
 *   .setPaymentInfoURL('https://example.com/payment-info')
 *   .setExpireDate(3) // 3 天內繳費
 * ```
 */
export class AtmPayment extends Content {
    protected choosePayment = ChoosePayment.ATM

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.ATM
    }

    /**
     * Set payment expiration days.
     *
     * @param days - Valid days (1~60)
     * @throws {PaymentError} If days is not between 1 and 60
     */
    public setExpireDate(days: number): this {
        if (days < ATM_EXPIRE_DATE_MIN || days > ATM_EXPIRE_DATE_MAX) {
            throw PaymentError.invalid(
                'ExpireDate',
                `Days must be between ${String(ATM_EXPIRE_DATE_MIN)} and ${String(ATM_EXPIRE_DATE_MAX)}`
            )
        }
        this.content.ExpireDate = days
        return this
    }

    /**
     * Set the server-side URL to receive payment info.
     *
     * @param url - The callback URL
     */
    public setPaymentInfoURL(url: string): this {
        this.content.PaymentInfoURL = url
        return this
    }

    /**
     * Set the client-side redirect URL after obtaining payment info.
     *
     * @param url - The redirect URL
     */
    public setClientRedirectURL(url: string): this {
        this.content.ClientRedirectURL = url
        return this
    }

    validate(): void {
        this.validateBaseParam()
    }
}
