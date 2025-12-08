import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

/**
 * AllInOne Payment
 *
 * Allows the user to select from multiple payment methods on ECPay's page.
 */
export class AllInOne extends Content {
    protected choosePayment = ChoosePayment.ALL

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.ALL
    }

    /**
     * Disable specific payment methods.
     *
     * @param payment - Multiple payments separated by '#' (e.g., 'Credit#ATM')
     */
    public setIgnorePayment(payment: string): this {
        this.content.IgnorePayment = payment
        return this
    }

    validate(): void {
        this.validateBaseParam()
    }
}
