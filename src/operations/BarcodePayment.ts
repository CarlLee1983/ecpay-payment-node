import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'
import { PaymentError } from '../errors/PaymentError'

/**
 * 條碼繳費期限限制（天）
 */
export const BARCODE_EXPIRE_DATE_MIN = 1
export const BARCODE_EXPIRE_DATE_MAX = 7

/**
 * Barcode Payment
 *
 * Generates a barcode for convenience store payment.
 *
 * @example
 * ```typescript
 * const payment = new BarcodePayment(merchantId, hashKey, hashIV)
 *   .setMerchantTradeNo('ORDER123')
 *   .setTotalAmount(500)
 *   .setTradeDesc('條碼付款測試')
 *   .setItemName('商品')
 *   .setReturnURL('https://example.com/callback')
 *   .setStoreExpireDate(3) // 3 天內繳費
 * ```
 */
export class BarcodePayment extends Content {
    protected choosePayment = ChoosePayment.Barcode

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.Barcode
    }

    /**
     * Set payment expiration days.
     *
     * @param days - Valid days (1~7)
     * @throws {PaymentError} If days is not between 1 and 7
     */
    public setStoreExpireDate(days: number): this {
        if (days < BARCODE_EXPIRE_DATE_MIN || days > BARCODE_EXPIRE_DATE_MAX) {
            throw PaymentError.invalid(
                'StoreExpireDate',
                `Days must be between ${String(BARCODE_EXPIRE_DATE_MIN)} and ${String(BARCODE_EXPIRE_DATE_MAX)}`
            )
        }
        this.content.StoreExpireDate = days
        return this
    }

    /**
     * Set description 1.
     * @param desc - Description text
     */
    public setDesc1(desc: string): this {
        this.content.Desc_1 = desc
        return this
    }

    /**
     * Set description 2.
     * @param desc - Description text
     */
    public setDesc2(desc: string): this {
        this.content.Desc_2 = desc
        return this
    }

    /**
     * Set description 3.
     * @param desc - Description text
     */
    public setDesc3(desc: string): this {
        this.content.Desc_3 = desc
        return this
    }

    /**
     * Set description 4.
     * @param desc - Description text
     */
    public setDesc4(desc: string): this {
        this.content.Desc_4 = desc
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
