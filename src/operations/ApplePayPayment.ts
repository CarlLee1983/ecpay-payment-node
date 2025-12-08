import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

/**
 * Apple Pay Payment
 *
 * Handles Apple Pay transactions.
 */
export class ApplePayPayment extends Content {
    protected choosePayment = ChoosePayment.ApplePay

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.ApplePay
    }

    validate(): void {
        super.validateBaseParam()
    }
}
