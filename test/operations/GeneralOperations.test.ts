import { describe, expect, it } from 'bun:test'
import { AtmPayment } from '../../src/operations/AtmPayment'
import { CvsPayment } from '../../src/operations/CvsPayment'
import { BnplPayment } from '../../src/operations/BnplPayment'
import { AllInOne } from '../../src/operations/AllInOne'
import { ChoosePayment } from '../../src/enums/ChoosePayment'

const merchantID = '2000132'
const hashKey = '5294y06JbISpM5x9'
const hashIV = 'v77hoKGq4kWxNNIS'

describe('Payment Operations', () => {
    it('AtmPayment should set specific params', () => {
        const payment = new AtmPayment(merchantID, hashKey, hashIV)
        payment.setMerchantTradeNo('Atm' + Date.now())
            .setTotalAmount(100)
            .setTradeDesc('Desc')
            .setItemName('Item')
            .setReturnURL('https://a.com')
            .setExpireDate(3)
            .setPaymentInfoURL('https://info.com')
            .setClientRedirectURL('https://client.com')

        const payload = payment.getContent()
        expect(payload.ChoosePayment).toBe(ChoosePayment.ATM)
        expect(payload.ExpireDate).toBe(3)
        expect(payload.PaymentInfoURL).toBe('https://info.com')
        expect(payload.ClientRedirectURL).toBe('https://client.com')
    })

    it('CvsPayment should set specific params', () => {
        const payment = new CvsPayment(merchantID, hashKey, hashIV)
        payment.setMerchantTradeNo('Cvs' + Date.now())
            .setTotalAmount(100)
            .setTradeDesc('Desc')
            .setItemName('Item')
            .setReturnURL('https://a.com')
            .setStoreExpireDate(60)
            .setDesc1('D1')

        const payload = payment.getContent()
        expect(payload.ChoosePayment).toBe(ChoosePayment.CVS)
        expect(payload.StoreExpireDate).toBe(60)
        expect(payload.Desc_1).toBe('D1')

        payment.setDesc2('D2').setDesc3('D3').setDesc4('D4')
            .setClientRedirectURL('https://c.com')
            .setPaymentInfoURL('https://p.com')

        const payload2 = payment.getContent()
        expect(payload2.Desc_2).toBe('D2')
        expect(payload2.Desc_3).toBe('D3')
        expect(payload2.Desc_4).toBe('D4')
        expect(payload2.ClientRedirectURL).toBe('https://c.com')
        expect(payload2.PaymentInfoURL).toBe('https://p.com')
    })

    it('BnplPayment should set basic params', () => {
        const payment = new BnplPayment(merchantID, hashKey, hashIV)
        payment.setMerchantTradeNo('Bnpl' + Date.now())
            .setTotalAmount(1000)
            .setTradeDesc('Desc')
            .setItemName('Item')
            .setReturnURL('https://a.com')

        const payload = payment.getContent()
        expect(payload.ChoosePayment).toBe(ChoosePayment.Bnpl)
    })

    it('AllInOne should allow ignoring payment', () => {
        const payment = new AllInOne(merchantID, hashKey, hashIV)
        payment.setMerchantTradeNo('All' + Date.now())
            .setTotalAmount(100)
            .setTradeDesc('Desc')
            .setItemName('Item')
            .setReturnURL('https://a.com')
            .setIgnorePayment('Credit')

        const payload = payment.getContent()
        expect(payload.ChoosePayment).toBe(ChoosePayment.ALL)
        expect(payload.IgnorePayment).toBe('Credit')
    })
})
