import { Content } from './base/Content'
import { CheckMacEncoder } from './security/CheckMacEncoder'
import { EncryptType } from './enums/EncryptType'
import { PaymentError } from './errors/PaymentError'

/**
 * ECPay API 用戶端設定選項
 */
export interface EcPayClientOptions {
    /**
     * ECPay 提供的 HashKey
     */
    hashKey: string

    /**
     * ECPay 提供的 HashIV
     */
    hashIV: string

    /**
     * ECPay API 伺服器網址（預設為測試環境）
     */
    serverUrl?: string

    /**
     * CheckMacValue 加密類型（預設為 SHA256）
     */
    encryptType?: EncryptType

    /**
     * 請求逾時時間（毫秒，預設 30000）
     */
    timeout?: number
}

/**
 * EcPayClient
 *
 * The main client for interacting with ECPay's API.
 * Handles making HTTP requests, signing payloads (CheckMacValue),
 * and processing responses.
 *
 * @example
 * ```typescript
 * const client = new EcPayClient({
 *   hashKey: 'your-hash-key',
 *   hashIV: 'your-hash-iv',
 *   serverUrl: 'https://payment.ecpay.com.tw', // 正式環境
 *   timeout: 30000,
 * })
 *
 * const result = await client.query(payment)
 * ```
 */
export class EcPayClient {
    private readonly serverUrl: string
    private readonly hashKey: string
    private readonly hashIV: string
    private readonly encryptType: EncryptType
    private readonly timeout: number

    /**
     * 使用設定選項建立新的 EcPayClient 實例
     *
     * @param options - 用戶端設定選項
     */
    constructor(options: EcPayClientOptions)

    /**
     * 使用個別參數建立新的 EcPayClient 實例（保留舊有 API 相容性）
     *
     * @param hashKey - ECPay 提供的 HashKey
     * @param hashIV - ECPay 提供的 HashIV
     * @param serverUrl - ECPay API 伺服器網址（預設為測試環境）
     * @param encryptType - CheckMacValue 加密類型（預設為 SHA256）
     * @param timeout - 請求逾時時間（毫秒，預設 30000）
     * @deprecated 請使用 options 物件的建構函式
     */
    constructor(
        hashKey: string,
        hashIV: string,
        serverUrl?: string,
        encryptType?: EncryptType,
        timeout?: number
    )

    constructor(
        optionsOrHashKey: EcPayClientOptions | string,
        hashIV?: string,
        serverUrl: string = 'https://payment-stage.ecpay.com.tw',
        encryptType: EncryptType = EncryptType.SHA256,
        timeout: number = 30000
    ) {
        if (typeof optionsOrHashKey === 'object') {
            // 新的 options 物件方式
            const options = optionsOrHashKey
            this.hashKey = options.hashKey
            this.hashIV = options.hashIV
            this.serverUrl = (options.serverUrl ?? 'https://payment-stage.ecpay.com.tw').replace(/\/$/, '')
            this.encryptType = options.encryptType ?? EncryptType.SHA256
            this.timeout = options.timeout ?? 30000
        } else {
            // 舊的參數方式（向後相容）
            this.hashKey = optionsOrHashKey
            this.hashIV = hashIV!
            this.serverUrl = serverUrl.replace(/\/$/, '')
            this.encryptType = encryptType
            this.timeout = timeout
        }
    }

    /**
     * Parse the raw query string response from ECPay
     *
     * @param text - The raw response text (e.g., "RtnCode=1&RtnMsg=OK...")
     * @returns A parsed object containing key-value pairs
     */
    private parseResponse(text: string): Record<string, unknown> {
        const responseData: Record<string, unknown> = {}
        const pairs = text.split('&')
        for (const pair of pairs) {
            const [key, value] = pair.split('=')
            if (key) {
                responseData[key] = decodeURIComponent(value || '')
            }
        }
        return responseData
    }

    /**
     * Execute a query or action against ECPay API
     *
     * 1. Prepares the payload from the command object.
     * 2. Sets up the CheckMacEncoder with the client's HashKey/IV.
     * 3. Sends a POST request to the ECPay server.
     * 4. Parses the response and verifies the CheckMacValue if present.
     *
     * @param command - The command object (Operation or Query) containing parameters
     * @returns A Promise resolving to the parsed response object from ECPay
     * @throws {PaymentError} If the HTTP request fails, times out, or validation errors occur
     */
    public async query(command: Content): Promise<Record<string, unknown>> {
        // 1. Prepare payload
        command.setHashKey(this.hashKey)
        command.setHashIV(this.hashIV)

        // Ensure encoder is consistent
        const encoder = new CheckMacEncoder(this.hashKey, this.hashIV, this.encryptType)
        command.setEncoder(encoder)

        const payload = command.getContent()
        const url = `${this.serverUrl}${command.getRequestPath()}`

        // 2. Send Request with timeout
        const params = new URLSearchParams()
        for (const [key, value] of Object.entries(payload)) {
            params.append(key, String(value))
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        let response: Response
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params,
                signal: controller.signal,
            })
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw PaymentError.timeout(this.timeout, url)
            }
            throw PaymentError.networkError(
                error instanceof Error ? error.message : 'Unknown network error'
            )
        } finally {
            clearTimeout(timeoutId)
        }

        if (!response.ok) {
            throw PaymentError.httpError(response.status, response.statusText)
        }

        const text = await response.text()

        // 3. Parse Response
        const responseData = this.parseResponse(text)

        // 4. Verify CheckMacValue (if exists)
        if (responseData.CheckMacValue) {
            encoder.verifyOrFail(responseData as Record<string, unknown>)
        }

        return responseData
    }
}
