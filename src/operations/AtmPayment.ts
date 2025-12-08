import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

export class AtmPayment extends Content {
    protected choosePayment = ChoosePayment.ATM

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.ATM
    }

    /**
     * 設定允許繳費有效天數
     * @param days 1~60
     */
    public setExpireDate(days: number): this {
        this.content.ExpireDate = days
        return this
    }

    /**
     * 設定伺服器端回傳付款相關資訊
     * @param url 網址
     */
    public setPaymentInfoURL(url: string): this {
        this.content.PaymentInfoURL = url
        return this
    }

    /**
     * 設定 Client 端回傳付款相關資訊
     * @param url 網址
     */
    public setClientRedirectURL(url: string): this {
        this.content.ClientRedirectURL = url
        return this
    }

    validate(): void {
        this.validateBaseParam()
    }
}
