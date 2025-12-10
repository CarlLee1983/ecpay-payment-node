import { PaymentNotify } from './PaymentNotify'

/**
 * ATM Notify Handler
 *
 * Handles ATM-specific notification fields.
 *
 * @example
 * ```typescript
 * const notify = new AtmNotify(hashKey, hashIV)
 * notify.verifyOrFail(requestBody)
 *
 * if (notify.isSuccess()) {
 *   const bankCode = notify.getBankCode()
 *   const vAccount = notify.getVAccount()
 *   console.log(`Payment received via ${bankCode} - ${vAccount}`)
 * }
 * ```
 */
export class AtmNotify extends PaymentNotify {
    /**
     * 取得銀行代碼
     *
     * @returns 銀行代碼
     */
    public getBankCode(): string {
        return this.getData().BankCode ? String(this.getData().BankCode) : ''
    }

    /**
     * 取得虛擬帳號
     *
     * @returns 虛擬帳號
     */
    public getVAccount(): string {
        return this.getData().vAccount ? String(this.getData().vAccount) : ''
    }

    /**
     * 取得虛擬帳號（舊方法名稱，已棄用）
     *
     * @deprecated 請使用 getVAccount() 取代
     * @returns 虛擬帳號
     */
    public getvAccount(): string {
        return this.getVAccount()
    }

    /**
     * 取得繳費期限
     *
     * @returns 繳費期限日期字串
     */
    public getExpireDate(): string {
        return this.getData().ExpireDate ? String(this.getData().ExpireDate) : ''
    }
}
