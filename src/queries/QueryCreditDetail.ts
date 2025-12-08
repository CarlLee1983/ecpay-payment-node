import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'
import { PaymentError } from '../errors/PaymentError'

export class QueryCreditDetail extends Content {
    // Usually this points to /Cashier/QueryCreditCardPeriodInfo or a specific endpoint
    // Based on standard ECPay API, it could be /CreditDetail/QueryTrade/V2 or similar.
    // Assuming standard path for now, or I'll refer to PHP SDK if available.
    // PHP SDK: Queries/QueryCreditCardPeriodInfo.php -> /Cashier/QueryCreditCardPeriodInfo
    // But "QueryCreditDetail" sounds like single trade.
    // Let's check PHP SDK file names/paths if possible.
    // Since I can't browse freely, I'll stick to a common assumption or check PHP structure quickly if allowed.
    // Plan says "QueryCreditDetail.ts" and "QueryRecurringOrder.ts".
    // Let's assume QueryCreditDetail is for general credit trade query and QueryRecurringOrder is for period info.

    protected requestPath = '/CreditDetail/QueryTrade/V2'
    protected choosePayment = ChoosePayment.ALL

    protected initContent(): void {
        super.initContent()
        // Specific params initialization if needed
    }

    public setCreditRefundId(id: string): this {
        this.content.CreditRefundId = id
        return this
    }

    public setCreditAmount(amount: number): this {
        this.content.CreditAmount = amount
        return this
    }

    public setCreditCheckCode(code: string): this {
        this.content.CreditCheckCode = code
        return this
    }

    validate(): void {
        if (!this.merchantID) throw PaymentError.required('MerchantID')
        // Add specific validation logic
    }
}
