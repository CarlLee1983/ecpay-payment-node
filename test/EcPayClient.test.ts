import { describe, expect, it, mock, beforeAll } from 'bun:test'
import { EcPayClient } from '../src/EcPayClient'
import { QueryOrder } from '../src/queries/QueryOrder'
import { CheckMacEncoder } from '../src/security/CheckMacEncoder'
import { EncryptType } from '../src/enums/EncryptType'

const merchantID = '2000132'
const hashKey = '5294y06JbISpM5x9'
const hashIV = 'v77hoKGq4kWxNNIS'

describe('EcPayClient', () => {

    it('should query API and process response', async () => {
        const client = new EcPayClient(merchantID, hashKey, hashIV)
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
        const client = new EcPayClient(merchantID, hashKey, hashIV)
        const query = new QueryOrder(merchantID, hashKey, hashIV)
        query.setMerchantTradeNo('FailTrade')

        global.fetch = mock(() => Promise.resolve(new Response('Error', { status: 500 }))) as any

        await expect(client.query(query)).rejects.toThrow('HTTP Error: 500')
    })
})
