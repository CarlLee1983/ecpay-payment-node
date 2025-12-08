import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'

export class BarcodePayment extends Content {
    protected choosePayment = ChoosePayment.Barcode

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.Barcode
    }

    /**
     * 設定超商繳費代碼截止時間
     * @param days 1~7
     */
    public setStoreExpireDate(days: number): this {
        this.content.StoreExpireDate = days
        return this
    }

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
