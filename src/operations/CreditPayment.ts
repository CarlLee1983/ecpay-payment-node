import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'


/**
 * Credit Card Payment
 *
 * Handles standard credit card transactions.
 */
export class CreditPayment extends Content {
    protected choosePayment = ChoosePayment.Credit

    protected initContent(): void {
        super.initContent()
        this.content.ChoosePayment = ChoosePayment.Credit
    }

    /**
     * Enable or disable bonus points redemption.
     *
     * @param enable - True to enable redemption
     */
    public setRedeem(enable: boolean): this {
        this.content.Redeem = enable ? 'Y' : 'N'
        return this
    }

    /**
     * Set UnionPay usage.
     *
     * @param unionPay - 0: No, 1: Yes, 2: Priority
     */
    public setUnionPay(unionPay: 0 | 1 | 2): this {
        this.content.UnionPay = unionPay
        return this
    }

    /**
     * Set merchant member ID (for memory card features).
     *
     * @param memberId - The member identifier
     */
    public setMerchantMemberID(memberId: string): this {
        this.content.MerchantMemberID = memberId
        return this
    }

    /**
     * Set binding card (memory card) usage.
     *
     * @param bindingCard - 0: No, 1: Yes
     */
    public setBindingCard(bindingCard: 0 | 1): this {
        this.content.BindingCard = bindingCard
        return this
    }

    /**
     * Set language for the payment page.
     *
     * @param language - 'ENG' or empty for default (Chinese)
     */
    public setLanguage(language: 'ENG' | ''): this {
        this.content.Language = language
        return this
    }

    validate(): void {
        this.validateBaseParam()
    }
}
