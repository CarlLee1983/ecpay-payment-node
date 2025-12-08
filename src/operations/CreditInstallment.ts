import { CreditPayment } from './CreditPayment'
import { PaymentError } from '../errors/PaymentError'

/**
 * Credit Card Installment
 *
 * Handles credit card installment payments.
 */
export class CreditInstallment extends CreditPayment {
    /**
     * Set installment periods.
     *
     * @param periods - '3', '6', '12', '18', '24'
     * @throws {PaymentError} If periods are invalid
     */
    public setCreditInstallment(periods: string): this {
        const allowed = ['3', '6', '12', '18', '24']
        if (!allowed.includes(periods)) {
            throw PaymentError.invalid('CreditInstallment', `Periods must be one of: ${allowed.join(', ')}`)
        }
        // ECPay API parameter for installment is CreditInstallment
        this.content.CreditInstallment = periods
        return this
    }
}
