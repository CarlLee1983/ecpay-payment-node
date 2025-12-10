import { describe, expect, it, mock } from 'bun:test'
import { EcPayClient } from '../src/EcPayClient'
import { QueryOrder } from '../src/queries/QueryOrder'
import { CheckMacEncoder } from '../src/security/CheckMacEncoder'
import { EncryptType } from '../src/enums/EncryptType'

const merchantID = '2000132'
const hashKey = '5294y06JbISpM5x9'
const hashIV = 'v77hoKGq4kWxNNIS'

describe('EcPayClient', () => {

    it('should query API and process response', async () => {
        // 使用新的 options 物件 API
        const client = new EcPayClient({
            hashKey,
            hashIV,
        })
        const query = new QueryOrder(merchantID, hashKey, hashIV)
        query.setMerchantTradeNo('TestTrade')

        // Mock response body (Form urlencoded)
        const encoder = new CheckMacEncoder(hashKey, hashIV, EncryptType.SHA256)
        const respData = {
            RtnCode: '1',
            RtnMsg: 'Succeeded',
            TradeStatus: '1',
            MerchantID: merchantID,
        }
        const checkMac = encoder.generateCheckMacValue(respData)
        const responseText = `RtnCode=1&RtnMsg=Succeeded&TradeStatus=1&MerchantID=${merchantID}&CheckMacValue=${checkMac}`

        // Mock Fetch
        global.fetch = mock(() => Promise.resolve(new Response(responseText))) as any

        const result = await client.query(query)

        expect(result.RtnCode).toBe('1')
        expect(result.TradeStatus).toBe('1')
        expect(result.CheckMacValue).toBe(checkMac)

        // Verify that fetch was called correctly
        // Accessing mock history is possible in bun test
        // expect(global.fetch).toHaveBeenCalled() 
    })

    it('should throw error on http failure', async () => {
        // 使用新的 options 物件 API
        const client = new EcPayClient({
            hashKey,
            hashIV,
        })
        const query = new QueryOrder(merchantID, hashKey, hashIV)
        query.setMerchantTradeNo('FailTrade')

        global.fetch = mock(() => Promise.resolve(new Response('Error', { status: 500 }))) as any

        await expect(client.query(query)).rejects.toThrow('HTTP Error: 500')
    })

    it('should support legacy constructor API', async () => {
        // 測試向後相容的舊 API
        const client = new EcPayClient(hashKey, hashIV)
        const query = new QueryOrder(merchantID, hashKey, hashIV)
        query.setMerchantTradeNo('LegacyTest')

        const encoder = new CheckMacEncoder(hashKey, hashIV, EncryptType.SHA256)
        const respData = {
            RtnCode: '1',
            RtnMsg: 'OK',
            MerchantID: merchantID,
        }
        const checkMac = encoder.generateCheckMacValue(respData)
        const responseText = `RtnCode=1&RtnMsg=OK&MerchantID=${merchantID}&CheckMacValue=${checkMac}`

        global.fetch = mock(() => Promise.resolve(new Response(responseText))) as any

        const result = await client.query(query)
        expect(result.RtnCode).toBe('1')
    })

    it('should handle abort signal for timeout', async () => {
        const client = new EcPayClient({
            hashKey,
            hashIV,
            timeout: 100, // 100ms 逾時
        })
        const query = new QueryOrder(merchantID, hashKey, hashIV)
        query.setMerchantTradeNo('TimeoutTest')

        // Mock fetch 來模擬 AbortError
        global.fetch = mock(() => {
            const error = new Error('The operation was aborted')
            error.name = 'AbortError'
            return Promise.reject(error)
        }) as any

        await expect(client.query(query)).rejects.toThrow('Request timeout')
    })
})
