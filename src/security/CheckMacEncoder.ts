import { createHash } from 'node:crypto'
import { EncryptType } from '../enums/EncryptType'
import { PaymentError } from '../errors/PaymentError'

/**
 * CheckMacEncoder
 *
 * Responsible for generating and verifying the CheckMacValue (checksum)
 * for ECPay Security.
 */
export class CheckMacEncoder {
    private readonly hashKey: string
    private readonly hashIV: string
    private readonly encryptType: EncryptType

    constructor(hashKey: string, hashIV: string, encryptType: EncryptType = EncryptType.SHA256) {
        this.hashKey = hashKey
        this.hashIV = hashIV
        this.encryptType = encryptType
    }

    /**
     * Create an encoder instance.
     *
     * @param hashKey - Merchant HashKey
     * @param hashIV - Merchant HashIV
     * @param encryptType - Encryption type (1: SHA256, 0: MD5)
     */
    static create(hashKey: string, hashIV: string, encryptType: number = 1): CheckMacEncoder {
        return new CheckMacEncoder(hashKey, hashIV, encryptType)
    }

    /**
     * Encode the payload by adding CheckMacValue.
     *
     * @param payload - The data to encode
     * @returns New object with CheckMacValue appended
     */
    encodePayload(payload: Record<string, any>): Record<string, any> {
        const data = { ...payload }
        delete data.CheckMacValue

        data.CheckMacValue = this.generateCheckMacValue(data)
        return data
    }

    /**
     * Verify the response data's CheckMacValue.
     *
     * @param responseData - The data received from ECPay
     * @returns true if valid, false otherwise
     */
    verifyResponse(responseData: Record<string, any>): boolean {
        if (!responseData.CheckMacValue) {
            return false
        }

        const receivedCheckMac = responseData.CheckMacValue as string
        const data = { ...responseData }
        delete data.CheckMacValue

        const calculatedCheckMac = this.generateCheckMacValue(data)

        return receivedCheckMac.toUpperCase() === calculatedCheckMac.toUpperCase()
    }

    /**
     * Verify and throw error if invalid.
     *
     * @param responseData - The data received from ECPay
     * @returns The original data if valid
     * @throws {PaymentError} If CheckMacValue verification fails
     */
    verifyOrFail(responseData: Record<string, any>): Record<string, any> {
        if (!this.verifyResponse(responseData)) {
            throw PaymentError.checkMacValueFailed()
        }
        return responseData
    }

    /**
     * Generate CheckMacValue from data.
     *
     * Algorithm:
     * 1. Sort keys alphabetically (A-Z)
     * 2. Join as query string (key=value&...)
     * 3. Prepend HashKey, Append HashIV
     * 4. URL Encode
     * 5. Convert to lowercase
     * 6. Replace specific characters to match .NET encoding
     * 7. Hash (SHA256 or MD5) -> Upper case
     */
    generateCheckMacValue(data: Record<string, any>): string {
        // 1. 依照參數名稱字母排序 (A-Z)
        const sortedKeys = Object.keys(data).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

        // 2. 組成查詢字串
        const pairs = sortedKeys.map(key => `${key}=${data[key]}`)
        const queryString = pairs.join('&')

        // 3. 加上 HashKey 和 HashIV
        const raw = `HashKey=${this.hashKey}&${queryString}&HashIV=${this.hashIV}`

        // 4. URL encode 並轉小寫
        let encoded = encodeURIComponent(raw).toLowerCase()

        // 5. 處理 .NET 相容的 URL encode 差異 & PHP urlencode compatibility
        // Node.js encodeURIComponent is stricter than PHP urlencode in some cases (e.g. ~),
        // but the key point here is to match ECPay's specific replacement rules.
        // PHP's urlencode encodes spaces as +, encodeURIComponent encodes them as %20.
        // ECPay expects:
        // - %2d -> -
        // - %5f -> _
        // - %2e -> .
        // - %21 -> !
        // - %2a -> *
        // - %28 -> (
        // - %29 -> )
        // - %20 -> +
        encoded = this.dotNetUrlEncode(encoded)

        // 6. 計算雜湊值
        return this.hash(encoded)
    }

    private hash(data: string): string {
        const algorithm = this.encryptType === EncryptType.MD5 ? 'md5' : 'sha256'
        return createHash(algorithm).update(data).digest('hex').toUpperCase()
    }

    private dotNetUrlEncode(str: string): string {
        return str
            .replace(/%2d/g, '-')
            .replace(/%5f/g, '_')
            .replace(/%2e/g, '.')
            .replace(/%21/g, '!')
            .replace(/%2a/g, '*')
            .replace(/%28/g, '(')
            .replace(/%29/g, ')')
            .replace(/%20/g, '+')
    }
}
