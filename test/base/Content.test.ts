import { describe, expect, it } from 'bun:test'
import { Content } from '../../src/base/Content'
import { PaymentError } from '../../src/errors/PaymentError'
import { CheckMacEncoder } from '../../src/security/CheckMacEncoder'
import { EncryptType } from '../../src/enums/EncryptType'

class TestContent extends Content {
    validate(): void {
        this.validateBaseParam()
    }
}

describe('Content Base Class', () => {
    it('should set and get basic properties', () => {
        const content = new TestContent('123', 'Key', 'IV')

        expect(content.getMerchantID()).toBe('123')

        content.setMerchantID('456')
        expect(content.getMerchantID()).toBe('456')

        content.setHashKey('Key2').setHashIV('IV2')
        // Indirect check via encoder
        const encoder = content.getEncoder()
        // No direct getter for key/iv in encoder, but we can verify it works
    })

    it('should set optional parameters', () => {
        const content = new TestContent('123', 'Key', 'IV')
        // Set Required
        content.setMerchantTradeNo('T' + Date.now())
            .setTotalAmount(100)
            .setTradeDesc('Desc')
            .setItemName('Item')
            .setReturnURL('https://r.com')

        content.setMerchantTradeDate(new Date('2023-01-01T12:00:00'))
        content.setMerchantTradeDate('2023/01/01 12:00:00') // String overload

        content.setClientBackURL('https://back.com')
        content.setOrderResultURL('https://result.com')
        content.setNeedExtraPaidInfo('Y')
        content.setCustomField(1, 'C1')
        content.setChooseSubPayment('Credit')

        const payload = content.getPayload()
        expect(payload.ClientBackURL).toBe('https://back.com')
        expect(payload.OrderResultURL).toBe('https://result.com')
        expect(payload.NeedExtraPaidInfo).toBe('Y')
        expect(payload.CustomField1).toBe('C1')
        expect(payload.ChooseSubPayment).toBe('Credit')
    })

    it('should set encoder manually', () => {
        const content = new TestContent('123', 'Key', 'IV')
        const encoder = new CheckMacEncoder('K', 'I', EncryptType.MD5)
        content.setEncoder(encoder)
        expect(content.getEncoder()).toBe(encoder)
    })

    it('should throw on validation errors', () => {
        const content = new TestContent('', '', '')
        expect(() => content.getPayload()).toThrow('MerchantID')

        content.setMerchantID('123')
        expect(() => content.getPayload()).toThrow('MerchantTradeNo')

        content.setMerchantTradeNo('T1')
        expect(() => content.getPayload()).toThrow('TotalAmount')

        content.setTotalAmount(100)
        expect(() => content.getPayload()).toThrow('TradeDesc')

        content.setTradeDesc('D')
        expect(() => content.getPayload()).toThrow('ItemName')

        content.setItemName('I')
        expect(() => content.getPayload()).toThrow('ReturnURL')
    })

    it('should validation length limits', () => {
        const content = new TestContent('123', 'K', 'I')
        expect(() => content.setMerchantTradeNo('A'.repeat(21))).toThrow('MerchantTradeNo')
        expect(() => content.setTradeDesc('A'.repeat(201))).toThrow('TradeDesc')
        expect(() => content.setItemName('A'.repeat(401))).toThrow('ItemName')
        expect(() => content.setTotalAmount(-1)).toThrow('TotalAmount')
    })
})
