import { CreditPayment } from './CreditPayment'
import { PaymentError } from '../errors/PaymentError'

/**
 * 允許的分期期數
 */
export const ALLOWED_INSTALLMENT_PERIODS = ['3', '6', '12', '18', '24'] as const
export type InstallmentPeriod = (typeof ALLOWED_INSTALLMENT_PERIODS)[number]

/**
 * Credit Card Installment
 *
 * Handles credit card installment payments.
 *
 * @example
 * ```typescript
 * const payment = new CreditInstallment(merchantId, hashKey, hashIV)
 *   .setMerchantTradeNo('ORDER123')
 *   .setTotalAmount(3000)
 *   .setTradeDesc('分期付款測試')
 *   .setItemName('商品')
 *   .setReturnURL('https://example.com/callback')
 *   .setCreditInstallment('6') // 6 期分期
 * ```
 */
export class CreditInstallment extends CreditPayment {
    /**
     * Set installment periods.
     *
     * @param periods - '3', '6', '12', '18', '24'
     * @throws {PaymentError} If periods are invalid
     */
    public setCreditInstallment(periods: InstallmentPeriod | string): this {
        if (!ALLOWED_INSTALLMENT_PERIODS.includes(periods as InstallmentPeriod)) {
            throw PaymentError.invalid(
                'CreditInstallment',
                `Periods must be one of: ${ALLOWED_INSTALLMENT_PERIODS.join(', ')}`
            )
        }
        // ECPay API parameter for installment is CreditInstallment
        this.content.CreditInstallment = periods
        return this
    }

    /**
     * 驗證分期付款參數
     *
     * @throws {PaymentError} 如果必要參數未設定
     */
    validate(): void {
        super.validate()
        if (!this.content.CreditInstallment) {
            throw PaymentError.required('CreditInstallment')
        }
    }
}
