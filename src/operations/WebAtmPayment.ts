import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

/**
 * WebATM Payment
 *
 * Handles WebATM transactions.
 */
export class WebAtmPayment extends Content {
    protected choosePayment = ChoosePayment.WebATM

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.WebATM
    }

    validate(): void {
        this.validateBaseParam()
    }
}
