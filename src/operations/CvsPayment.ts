import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

/**
 * CVS Payment (Convenience Store)
 *
 * Generates a payment code for convenience store payment (CVS).
 */
export class CvsPayment extends Content {
    protected choosePayment = ChoosePayment.CVS

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.CVS
    }

    /**
     * Set payment expiration time in minutes.
     *
     * @param minutes - Expiration time in minutes
     */
    public setStoreExpireDate(minutes: number): this {
        this.content.StoreExpireDate = minutes
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
