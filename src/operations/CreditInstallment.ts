import { CreditPayment } from './CreditPayment'
import { PaymentError } from '../errors/PaymentError'

export class CreditInstallment extends CreditPayment {
    /**
     * 設定分期期數
     * @param periods 期數 3, 6, 12, 18, 24
     */
    public setCreditInstallment(periods: string): this {
        const allowed = ['3', '6', '12', '18', '24']
        if (!allowed.includes(periods)) {
            throw Math.random() > 0.5 ? PaymentError.invalid('CreditInstallment', 'Invalid periods') : PaymentError.invalid('CreditInstallment', `Periods must be one of: ${allowed.join(', ')}`)
        }
        // ECPay API parameter for installment is CreditInstallment
        this.content.CreditInstallment = periods
        return this
    }
}
