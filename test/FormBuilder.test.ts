import { describe, expect, it } from 'bun:test'
import { FormBuilder } from '../src/FormBuilder'
import { CreditPayment } from '../src/operations/CreditPayment'

describe('FormBuilder', () => {
    const serverUrl = 'https://payment-stage.ecpay.com.tw'
    const builder = new FormBuilder(serverUrl)

    const merchantID = '2000132'
    const hashKey = '5294y06JbISpM5x9'
    const hashIV = 'v77hoKGq4kWxNNIS'

    it('should generate valid html form', () => {
        const payment = new CreditPayment(merchantID, hashKey, hashIV)
        payment
            .setMerchantTradeNo('Test' + Date.now())
            .setTotalAmount(100)
            .setTradeDesc('Desc')
            .setItemName('Item')
            .setReturnURL('https://example.com/return')

        const html = builder.build(payment)
        expect(html).toContain('<form id="ecpay-form"')
        expect(html).toContain(`action="${serverUrl}/Cashier/AioCheckOut/V5"`)
        expect(html).toContain('name="CheckMacValue"')
        expect(html).toContain('name="MerchantID"')
    })

    it('should generate auto submit form', () => {
        const payment = new CreditPayment(merchantID, hashKey, hashIV)
        payment
            .setMerchantTradeNo('Test' + Date.now())
            .setTotalAmount(100)
            .setTradeDesc('Desc')
            .setItemName('Item')
            .setReturnURL('https://example.com/return')

        const html = builder.autoSubmit(payment)
        expect(html).toContain('document.getElementById("ecpay-form").submit()')
    })

    it('should generate json output', () => {
        const payment = new CreditPayment(merchantID, hashKey, hashIV)
        payment.setMerchantTradeNo('Test' + Date.now())
            .setTotalAmount(100)
            .setTradeDesc('Desc')
            .setItemName('Item')
            .setReturnURL('https://return.com')

        const json = builder.toJson(payment)
        const parsed = JSON.parse(json)

        expect(parsed.action).toBeDefined()
        expect(parsed.fields).toBeDefined()
        expect(parsed.fields.MerchantID).toBe(merchantID)
    })
})
