import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

/**
 * BNPL Payment (Buy Now Pay Later)
 *
 * Handles BNPL transactions.
 */
export class BnplPayment extends Content {
    protected choosePayment = ChoosePayment.Bnpl

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.Bnpl
    }

    validate(): void {
        super.validateBaseParam()
    }
}
