import { describe, expect, it } from 'bun:test'
import { CreditRecurring } from '../../src/operations/CreditRecurring'
import { PeriodType } from '../../src/enums/PeriodType'

describe('CreditRecurring', () => {
    const merchantID = '2000132'
    const hashKey = '5294y06JbISpM5x9'
    const hashIV = 'v77hoKGq4kWxNNIS'

    it('should create valid recurring payment', () => {
        const payment = new CreditRecurring(merchantID, hashKey, hashIV)
        payment.setMerchantTradeNo('Rec' + Date.now())
            .setTotalAmount(100) // This might be used as initial amount or ignored depending on API, but base checks it
            .setTradeDesc('Recurring Test')
            .setItemName('Recurring Item')
            .setReturnURL('https://example.com/return')
            .setPeriodAmount(100)
            .setPeriodType(PeriodType.Month)
            .setFrequency(1)
            .setExecTimes(9)
            .setPeriodReturnURL('https://example.com/period-return')

        const payload = payment.getContent()
        expect(payload.PeriodAmount).toBe(100)
        expect(payload.PeriodType).toBe('M')
        expect(payload.Frequency).toBe(1)
        expect(payload.ExecTimes).toBe(9)
    })

    it('should throw if missing recurring fields', () => {
        const payment = new CreditRecurring(merchantID, hashKey, hashIV)
        payment.setMerchantTradeNo('Rec' + Date.now())
            .setTotalAmount(100)
            .setTradeDesc('Test')
            .setItemName('Item')
            .setReturnURL('https://q.com')

        expect(() => payment.validate()).toThrow('Field "PeriodAmount" is required.')
    })
})
