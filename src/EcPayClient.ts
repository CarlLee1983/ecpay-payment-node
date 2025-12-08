import { Content } from './base/Content'
import { CheckMacEncoder } from './security/CheckMacEncoder'
import { EncryptType } from './enums/EncryptType'

/**
 * EcPayClient
 *
 * The main client for interacting with ECPay's API.
 * Handles making HTTP requests, signing payloads (CheckMacValue),
 * and processing responses.
 */
export class EcPayClient {
    private serverUrl: string
    private hashKey: string
    private hashIV: string
    private encryptType: EncryptType

    /**
     * Create a new EcPayClient instance
     *
     * @param merchantID - The MerchantID provided by ECPay
     * @param hashKey - The HashKey provided by ECPay
     * @param hashIV - The HashIV provided by ECPay
     * @param serverUrl - The ECPay server URL (default: Stage environment)
     * @param encryptType - The encryption method for CheckMacValue (default: SHA256)
     */
    constructor(
        merchantID: string, // Unused but kept for consistency? Or maybe useful.
        hashKey: string,
        hashIV: string,
        serverUrl: string = 'https://payment-stage.ecpay.com.tw',
        encryptType: EncryptType = EncryptType.SHA256
    ) {
        this.hashKey = hashKey
        this.hashIV = hashIV
        this.serverUrl = serverUrl.replace(/\/$/, '')
        this.encryptType = encryptType
    }

    /**
     * Parse the raw query string response from ECPay
     *
     * @param text - The raw response text (e.g., "RtnCode=1&RtnMsg=OK...")
     * @returns A parsed object containing key-value pairs
     */
    private parseResponse(text: string): Record<string, any> {
        const responseData: Record<string, any> = {}
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
     * @throws {Error} If the HTTP request fails or validation errors occur
     */
    public async query(command: Content): Promise<Record<string, any>> {
        // 1. Prepare payload
        command.setHashKey(this.hashKey)
        command.setHashIV(this.hashIV)

        // Ensure encoder is consistent
        const encoder = new CheckMacEncoder(this.hashKey, this.hashIV, this.encryptType)
        command.setEncoder(encoder)

        const payload = command.getContent()
        const url = `${this.serverUrl}${command.getRequestPath()}`

        // 2. Send Request
        const params = new URLSearchParams()
        for (const [key, value] of Object.entries(payload)) {
            params.append(key, String(value))
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        })

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
        }

        const text = await response.text()

        // 3. Parse Response
        const responseData = this.parseResponse(text)

        // 4. Verify CheckMacValue (if exists)
        if (responseData.CheckMacValue) {
            encoder.verifyOrFail(responseData)
        }

        return responseData
    }
}
