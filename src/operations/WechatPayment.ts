import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

/**
 * WeChat Pay
 *
 * Handles WeChat Pay transactions.
 */
export class WechatPayment extends Content {
    protected choosePayment = ChoosePayment.WechatPay

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.WechatPay
    }

    validate(): void {
        super.validateBaseParam()
    }
}
