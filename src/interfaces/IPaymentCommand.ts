export interface IPaymentCommand {
    /**
     * 取得 API 請求路徑
     */
    getRequestPath(): string

    /**
     * 取得 Payload (含 CheckMacValue)
     */
    getPayload(): Record<string, any>

    /**
     * 驗證參數
     */
    validate(): void
}
