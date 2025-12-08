import { describe, expect, it } from 'bun:test'
import { QueryOrder } from '../../src/queries/QueryOrder'

describe('QueryOrder', () => {
    const merchantID = '2000132'
    const hashKey = '5294y06JbISpM5x9'
    const hashIV = 'v77hoKGq4kWxNNIS'

    it('should create valid query', () => {
        const query = new QueryOrder(merchantID, hashKey, hashIV)
        query.setMerchantTradeNo('TestOrder')

        const content = query.getContent()
        expect(content.MerchantID).toBe(merchantID)
        expect(content.MerchantTradeNo).toBe('TestOrder')
    })

    it('should throw if missing trade no', () => {
        const query = new QueryOrder(merchantID, hashKey, hashIV)
        expect(() => query.validate()).toThrow('Field "MerchantTradeNo" is required')
    })
})
