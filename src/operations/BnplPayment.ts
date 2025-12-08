import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

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
