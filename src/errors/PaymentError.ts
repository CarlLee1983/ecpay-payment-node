/**
 * ECPay 支付錯誤基礎類別
 *
 * 所有 ECPay SDK 相關錯誤的基礎類別，提供統一的錯誤處理機制。
 *
 * @example
 * ```typescript
 * try {
 *   await client.query(payment)
 * } catch (error) {
 *   if (error instanceof PaymentError) {
 *     console.log(error.code)    // 'REQUIRED', 'INVALID', etc.
 *     console.log(error.field)   // 'MerchantID', etc.
 *   }
 * }
 * ```
 */
export class PaymentError extends Error {
    /**
     * 錯誤代碼
     */
    public readonly code: string

    /**
     * 相關欄位名稱（如果有的話）
     */
    public readonly field?: string

    constructor(message: string, code: string = 'PAYMENT_ERROR', field?: string) {
        super(message)
        this.name = 'PaymentError'
        this.code = code
        this.field = field

        // 維護正確的原型鏈（ES5 相容）
        Object.setPrototypeOf(this, PaymentError.prototype)
    }

    /**
     * 建立必填欄位錯誤
     *
     * @param field - 欄位名稱
     * @returns PaymentError 實例
     */
    static required(field: string): PaymentError {
        return new PaymentError(`Field "${field}" is required.`, 'REQUIRED', field)
    }

    /**
     * 建立欄位長度過長錯誤
     *
     * @param field - 欄位名稱
     * @param maxLength - 最大長度限制
     * @returns PaymentError 實例
     */
    static tooLong(field: string, maxLength: number): PaymentError {
        return new PaymentError(
            `Field "${field}" must be less than ${String(maxLength)} characters.`,
            'TOO_LONG',
            field
        )
    }

    /**
     * 建立欄位值無效錯誤
     *
     * @param field - 欄位名稱
     * @param reason - 無效原因說明
     * @returns PaymentError 實例
     */
    static invalid(field: string, reason: string): PaymentError {
        return new PaymentError(`Field "${field}" is invalid: ${reason}`, 'INVALID', field)
    }

    /**
     * 建立 CheckMacValue 驗證失敗錯誤
     *
     * @returns PaymentError 實例
     */
    static checkMacValueFailed(): PaymentError {
        return new PaymentError('CheckMacValue verification failed.', 'CHECK_MAC_FAILED')
    }

    /**
     * 建立 HTTP 請求錯誤
     *
     * @param status - HTTP 狀態碼
     * @param statusText - HTTP 狀態文字
     * @returns PaymentError 實例
     */
    static httpError(status: number, statusText: string): PaymentError {
        return new PaymentError(
            `HTTP Error: ${String(status)} ${statusText}`,
            'HTTP_ERROR'
        )
    }

    /**
     * 建立請求逾時錯誤
     *
     * @param timeout - 逾時時間（毫秒）
     * @param url - 請求的 URL（選填）
     * @returns PaymentError 實例
     */
    static timeout(timeout: number, url?: string): PaymentError {
        const urlInfo = url ? ` for ${url}` : ''
        return new PaymentError(
            `Request timeout after ${String(timeout)}ms${urlInfo}`,
            'TIMEOUT'
        )
    }

    /**
     * 建立網路錯誤
     *
     * @param reason - 錯誤原因
     * @returns PaymentError 實例
     */
    static networkError(reason: string): PaymentError {
        return new PaymentError(`Network error: ${reason}`, 'NETWORK_ERROR')
    }

    /**
     * 將錯誤轉換為 JSON 可序列化物件
     *
     * @returns 包含所有錯誤屬性的物件
     */
    toJSON(): Record<string, unknown> {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            field: this.field,
        }
    }
}
