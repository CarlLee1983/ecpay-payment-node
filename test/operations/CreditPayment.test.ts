import { describe, expect, it } from 'bun:test'
import { CreditPayment } from '../../src/operations/CreditPayment'
import { CheckMacEncoder } from '../../src/security/CheckMacEncoder'

describe('CreditPayment', () => {
    const merchantID = '2000132'
    const hashKey = '5294y06JbISpM5x9'
    const hashIV = 'v77hoKGq4kWxNNIS'

    it('should create a valid credit payment payload', () => {
        const payment = new CreditPayment(merchantID, hashKey, hashIV)

        payment
            .setMerchantTradeNo('Test' + Date.now())
            .setMerchantTradeDate(new Date())
            .setTotalAmount(1000)
            .setTradeDesc('Test Desc')
            .setItemName('Test Item')
            .setReturnURL('https://example.com/return')
            .setRedeem(true)
            .setUnionPay(1)
            .setBindingCard(1)
            .setMerchantMemberID('Mem123')
            .setLanguage('ENG')

        const payload = payment.getContent()

        expect(payload.MerchantID).toBe(merchantID)
        expect(payload.ChoosePayment).toBe('Credit')
        expect(payload.Redeem).toBe('Y')
        expect(payload.UnionPay).toBe(1)
        expect(payload.BindingCard).toBe(1)
        expect(payload.MerchantMemberID).toBe('Mem123')
        expect(payload.Language).toBe('ENG')
        expect(payload.CheckMacValue).toBeDefined()
    })

    it('should throw error when required fields are missing', () => {
        const payment = new CreditPayment(merchantID, hashKey, hashIV)

        // Missing basic params
        expect(() => payment.getPayload()).toThrow('Field "MerchantTradeNo" is required.')
    })

    it('should throw error when amount check fails', () => {
        const payment = new CreditPayment(merchantID, hashKey, hashIV)
        expect(() => payment.setTotalAmount(-1)).toThrow('must be greater than 0')
    })
})
