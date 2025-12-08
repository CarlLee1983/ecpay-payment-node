import { describe, expect, it } from 'bun:test'
import { QueryCreditDetail } from '../../src/queries/QueryCreditDetail'
import { QueryRecurringOrder } from '../../src/queries/QueryRecurringOrder'

const merchantID = '2000132'
const hashKey = '5294y06JbISpM5x9'
const hashIV = 'v77hoKGq4kWxNNIS'

describe('Query Classes', () => {
    it('QueryCreditDetail should set params', () => {
        const query = new QueryCreditDetail(merchantID, hashKey, hashIV)
        query.setCreditRefundId('Ref123')
            .setCreditAmount(500)
            .setCreditCheckCode('CheckCode')

        const payload = query.getContent()
        expect(payload.CreditRefundId).toBe('Ref123')
        expect(payload.CreditAmount).toBe(500)
        expect(payload.CreditCheckCode).toBe('CheckCode')
    })

    it('QueryRecurringOrder should validate params', () => {
        const query = new QueryRecurringOrder(merchantID, hashKey, hashIV)
        expect(() => query.validate()).toThrow('MerchantTradeNo')

        query.setMerchantTradeNo('RecTrade123')
        expect(() => query.validate()).not.toThrow()
    })
})
