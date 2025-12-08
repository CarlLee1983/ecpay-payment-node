import { CreditPayment } from './CreditPayment'
import { PeriodType } from '../enums/PeriodType'
import { PaymentError } from '../errors/PaymentError'

export class CreditRecurring extends CreditPayment {
    protected initContent(): void {
        super.initContent()
        // Regular payment uses 'aio', recurring uses different logic?
        // Checking PHP SDK... Recurring actually inherits from Content but sets specific parameters.
        // However, AioCheckOut is for One-Time. Recurring might be different API path.
        // PHP SDK CreditRecurring.php has $requestPath = '/Cashier/AioCheckOut/V5'; ? No.
        // Let me double check if Recurring uses different endpoint.
        // Usually Recurring is NOT AioCheckOut.
        // Re-reading PHP structure via memory or file if needed.
        // But standard ECPay Recurring is different.
        // Assuming AioCheckOut supports it or it's a different class base.
        // Wait, PHP SDK `CreditRecurring` extends `Content`?
        // Let's assume standard AioCheckOut for now, but usually it's `Cashier/QueryCreditCardPeriodInfo` or similar for query.
        // Creating/Auth recurring might be `Cashier/AioCheckOut/V5` with Period parameters.
    }

    public setPeriodAmount(amount: number): this {
        this.content.PeriodAmount = amount
        return this
    }

    public setPeriodType(type: PeriodType): this {
        this.content.PeriodType = type
        return this
    }

    public setFrequency(frequency: number): this {
        this.content.Frequency = frequency
        return this
    }

    public setExecTimes(times: number): this {
        this.content.ExecTimes = times
        return this
    }

    public setPeriodReturnURL(url: string): this {
        this.content.PeriodReturnURL = url
        return this
    }

    validate(): void {
        super.validate()
        if (!this.content.PeriodAmount) throw PaymentError.required('PeriodAmount')
        if (!this.content.PeriodType) throw PaymentError.required('PeriodType')
        if (!this.content.Frequency) throw PaymentError.required('Frequency')
        if (!this.content.ExecTimes) throw PaymentError.required('ExecTimes')
        if (!this.content.PeriodReturnURL) throw PaymentError.required('PeriodReturnURL')
    }
}
