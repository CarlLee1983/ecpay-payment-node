import { PaymentNotify } from './PaymentNotify'

/**
 * ATM Notify Handler
 *
 * Handles ATM-specific notification fields.
 */
export class AtmNotify extends PaymentNotify {
    /**
     * Get Bank Code
     */
    public getBankCode(): string {
        return this.getData().BankCode ? String(this.getData().BankCode) : ''
    }

    /**
     * Get Virtual Account Number
     */
    public getvAccount(): string {
        return this.getData().vAccount ? String(this.getData().vAccount) : ''
    }

    /**
     * Get Expiration Date
     */
    public getExpireDate(): string {
        return this.getData().ExpireDate ? String(this.getData().ExpireDate) : ''
    }
}
