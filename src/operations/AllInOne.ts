import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

export class AllInOne extends Content {
    protected choosePayment = ChoosePayment.ALL

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.ALL
    }

    /**
     * 設定忽略的付款方式
     * @param payment 付款方式
     */
    public setIgnorePayment(payment: string): this {
        this.content.IgnorePayment = payment
        return this
    }

    validate(): void {
        this.validateBaseParam()
    }
}
