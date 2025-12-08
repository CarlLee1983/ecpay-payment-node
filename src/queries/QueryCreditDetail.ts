import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'
import { PaymentError } from '../errors/PaymentError'

/**
 * Query Credit Card Detail
 *
 * Query details of a specific credit card transaction.
 */
export class QueryCreditDetail extends Content {
    protected requestPath = '/CreditDetail/QueryTrade/V2'
    protected choosePayment = ChoosePayment.ALL

    protected initContent(): void {
        super.initContent()
        // Specific params initialization if needed
    }

    /**
     * Set Credit Card Refund ID (gwsr).
     */
    public setCreditRefundId(id: string): this {
        this.content.CreditRefundId = id
        return this
    }

    /**
     * Set credit amount.
     */
    public setCreditAmount(amount: number): this {
        this.content.CreditAmount = amount
        return this
    }

    /**
     * Set Credit Check Code.
     */
    public setCreditCheckCode(code: string): this {
        this.content.CreditCheckCode = code
        return this
    }

    validate(): void {
        if (!this.merchantID) throw PaymentError.required('MerchantID')
        // Add specific validation logic
    }
}
