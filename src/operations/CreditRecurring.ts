import { CreditPayment } from './CreditPayment'
import { PeriodType } from '../enums/PeriodType'
import { PaymentError } from '../errors/PaymentError'

/**
 * Credit Card Recurring Payment (Periodic)
 *
 * Handles periodic credit card payments (subscription model).
 */
export class CreditRecurring extends CreditPayment {
    protected initContent(): void {
        super.initContent()
    }

    /**
     * Set the amount for each period.
     * @param amount - Amount per period
     */
    public setPeriodAmount(amount: number): this {
        this.content.PeriodAmount = amount
        return this
    }

    /**
     * Set period type.
     * @param type - D: Day, M: Month, Y: Year
     */
    public setPeriodType(type: PeriodType): this {
        this.content.PeriodType = type
        return this
    }

    /**
     * Set frequency of the recurring payment.
     *
     * @param frequency - Every N days/months/years
     */
    public setFrequency(frequency: number): this {
        this.content.Frequency = frequency
        return this
    }

    /**
     * Set total execution times.
     *
     * @param times - Number of times to execute payment
     */
    public setExecTimes(times: number): this {
        this.content.ExecTimes = times
        return this
    }

    /**
     * Set the URL to receive recurring payment results.
     *
     * @param url - Server callback URL
     */
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
