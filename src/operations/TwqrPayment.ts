import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

export class TwqrPayment extends Content {
    protected choosePayment = ChoosePayment.TWQR

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.TWQR
    }

    validate(): void {
        super.validateBaseParam()
    }
}
