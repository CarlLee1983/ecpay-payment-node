import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

/**
 * ATM Payment
 *
 * Generates a virtual account number for ATM transfer.
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
     */
    public setExpireDate(days: number): this {
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
