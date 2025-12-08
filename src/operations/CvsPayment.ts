import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

export class CvsPayment extends Content {
    protected choosePayment = ChoosePayment.CVS

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.CVS
    }

    /**
     * 設定超商繳費代碼描述
     * @param desc 描述
     */
    public setStoreExpireDate(minutes: number): this {
        this.content.StoreExpireDate = minutes
        return this
    }

    /**
     * 設定超商代碼截止時間
     * @param desc 描述
     */
    public setDesc1(desc: string): this {
        this.content.Desc_1 = desc
        return this
    }

    public setDesc2(desc: string): this {
        this.content.Desc_2 = desc
        return this
    }

    public setDesc3(desc: string): this {
        this.content.Desc_3 = desc
        return this
    }

    public setDesc4(desc: string): this {
        this.content.Desc_4 = desc
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
