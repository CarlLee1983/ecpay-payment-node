import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'


export class CreditPayment extends Content {
    protected choosePayment = ChoosePayment.Credit

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.Credit
    }

    /**
     * 設定是否啟用紅利折抵
     * @param enable 是否啟用
     */
    public setRedeem(enable: boolean): this {
        this.content.Redeem = enable ? 'Y' : 'N'
        return this
    }

    /**
     * 設定是否使用銀聯卡
     * @param unionPay 0=不使用, 1=使用, 2=優先使用
     */
    public setUnionPay(unionPay: 0 | 1 | 2): this {
        this.content.UnionPay = unionPay
        return this
    }

    /**
     * 設定信用卡記憶卡號識別碼
     * @param memberId 會員識別碼
     */
    public setMerchantMemberID(memberId: string): this {
        this.content.MerchantMemberID = memberId
        return this
    }

    /**
     * 設定是否使用記憶卡號
     * @param bindingCard 0=不使用, 1=使用
     */
    public setBindingCard(bindingCard: 0 | 1): this {
        this.content.BindingCard = bindingCard
        return this
    }

    /**
     * 設定語系
     * @param language ENG 或空字串（預設中文）
     */
    public setLanguage(language: 'ENG' | ''): this {
        this.content.Language = language
        return this
    }

    validate(): void {
        this.validateBaseParam()
    }
}
