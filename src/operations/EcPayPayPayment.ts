import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

export class EcPayPayPayment extends Content {
    protected choosePayment = ChoosePayment.EcpayPay

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.EcpayPay
    }

    validate(): void {
        super.validateBaseParam()
    }
}
