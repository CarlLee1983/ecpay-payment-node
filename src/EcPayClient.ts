import { Content } from './base/Content'
import { CheckMacEncoder } from './security/CheckMacEncoder'
import { EncryptType } from './enums/EncryptType'

export class EcPayClient {
    private serverUrl: string
    private hashKey: string
    private hashIV: string
    private encryptType: EncryptType

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
        const responseData: Record<string, any> = {}
        const pairs = text.split('&')
        for (const pair of pairs) {
            const [key, value] = pair.split('=')
            if (key) {
                responseData[key] = decodeURIComponent(value || '')
            }
        }

        // 4. Verify CheckMacValue (if exists)
        if (responseData.CheckMacValue) {
            encoder.verifyOrFail(responseData)
        }

        return responseData
    }
}
