import { describe, expect, it } from 'bun:test'
import { BarcodePayment, BARCODE_EXPIRE_DATE_MIN, BARCODE_EXPIRE_DATE_MAX } from '../../src/operations/BarcodePayment'
import { WebAtmPayment } from '../../src/operations/WebAtmPayment'
import { CreditInstallment, ALLOWED_INSTALLMENT_PERIODS } from '../../src/operations/CreditInstallment'
import { ApplePayPayment } from '../../src/operations/ApplePayPayment'
import { TwqrPayment } from '../../src/operations/TwqrPayment'
import { EcPayPayPayment } from '../../src/operations/EcPayPayPayment'
import { WechatPayment } from '../../src/operations/WechatPayment'
import { AtmPayment, ATM_EXPIRE_DATE_MIN, ATM_EXPIRE_DATE_MAX } from '../../src/operations/AtmPayment'
import { ChoosePayment } from '../../src/enums/ChoosePayment'
import { PaymentError } from '../../src/errors/PaymentError'

const merchantID = '2000132'
const hashKey = '5294y06JbISpM5x9'
const hashIV = 'v77hoKGq4kWxNNIS'

describe('Additional Payment Operations', () => {
    describe('BarcodePayment', () => {
        it('should create barcode payment with valid params', () => {
            const payment = new BarcodePayment(merchantID, hashKey, hashIV)
            payment.setMerchantTradeNo('Barcode' + Date.now())
                .setTotalAmount(100)
                .setTradeDesc('Barcode Test')
                .setItemName('Test Item')
                .setReturnURL('https://example.com/callback')
                .setStoreExpireDate(3)
                .setDesc1('Description 1')
                .setDesc2('Description 2')
                .setDesc3('Description 3')
                .setDesc4('Description 4')
                .setPaymentInfoURL('https://example.com/info')
                .setClientRedirectURL('https://example.com/redirect')

            const payload = payment.getContent()
            expect(payload.ChoosePayment).toBe(ChoosePayment.Barcode)
            expect(payload.StoreExpireDate).toBe(3)
            expect(payload.Desc_1).toBe('Description 1')
            expect(payload.Desc_2).toBe('Description 2')
            expect(payload.Desc_3).toBe('Description 3')
            expect(payload.Desc_4).toBe('Description 4')
        })

        it('should throw error for invalid StoreExpireDate', () => {
            const payment = new BarcodePayment(merchantID, hashKey, hashIV)
            
            expect(() => payment.setStoreExpireDate(0)).toThrow(PaymentError)
            expect(() => payment.setStoreExpireDate(8)).toThrow(PaymentError)
            expect(() => payment.setStoreExpireDate(-1)).toThrow(PaymentError)
        })

        it('should export expire date constants', () => {
            expect(BARCODE_EXPIRE_DATE_MIN).toBe(1)
            expect(BARCODE_EXPIRE_DATE_MAX).toBe(7)
        })
    })

    describe('AtmPayment validation', () => {
        it('should throw error for invalid ExpireDate', () => {
            const payment = new AtmPayment(merchantID, hashKey, hashIV)
            
            expect(() => payment.setExpireDate(0)).toThrow(PaymentError)
            expect(() => payment.setExpireDate(61)).toThrow(PaymentError)
            expect(() => payment.setExpireDate(-1)).toThrow(PaymentError)
        })

        it('should accept valid ExpireDate', () => {
            const payment = new AtmPayment(merchantID, hashKey, hashIV)
            
            expect(() => payment.setExpireDate(1)).not.toThrow()
            expect(() => payment.setExpireDate(30)).not.toThrow()
            expect(() => payment.setExpireDate(60)).not.toThrow()
        })

        it('should export expire date constants', () => {
            expect(ATM_EXPIRE_DATE_MIN).toBe(1)
            expect(ATM_EXPIRE_DATE_MAX).toBe(60)
        })
    })

    describe('WebAtmPayment', () => {
        it('should create WebATM payment', () => {
            const payment = new WebAtmPayment(merchantID, hashKey, hashIV)
            payment.setMerchantTradeNo('WebAtm' + Date.now())
                .setTotalAmount(500)
                .setTradeDesc('WebATM Test')
                .setItemName('Test Item')
                .setReturnURL('https://example.com/callback')

            const payload = payment.getContent()
            expect(payload.ChoosePayment).toBe(ChoosePayment.WebATM)
        })
    })

    describe('CreditInstallment', () => {
        it('should create installment payment with valid periods', () => {
            const payment = new CreditInstallment(merchantID, hashKey, hashIV)
            payment.setMerchantTradeNo('Install' + Date.now())
                .setTotalAmount(3000)
                .setTradeDesc('Installment Test')
                .setItemName('Test Item')
                .setReturnURL('https://example.com/callback')
                .setCreditInstallment('6')

            const payload = payment.getContent()
            expect(payload.ChoosePayment).toBe(ChoosePayment.Credit)
            expect(payload.CreditInstallment).toBe('6')
        })

        it('should throw error for invalid installment periods', () => {
            const payment = new CreditInstallment(merchantID, hashKey, hashIV)
            
            expect(() => payment.setCreditInstallment('5')).toThrow(PaymentError)
            expect(() => payment.setCreditInstallment('0')).toThrow(PaymentError)
            expect(() => payment.setCreditInstallment('36')).toThrow(PaymentError)
        })

        it('should accept all valid installment periods', () => {
            for (const period of ALLOWED_INSTALLMENT_PERIODS) {
                const payment = new CreditInstallment(merchantID, hashKey, hashIV)
                expect(() => payment.setCreditInstallment(period)).not.toThrow()
            }
        })

        it('should throw error when CreditInstallment is not set during validation', () => {
            const payment = new CreditInstallment(merchantID, hashKey, hashIV)
            payment.setMerchantTradeNo('Install' + Date.now())
                .setTotalAmount(3000)
                .setTradeDesc('Test')
                .setItemName('Item')
                .setReturnURL('https://example.com')

            expect(() => payment.validate()).toThrow('CreditInstallment')
        })

        it('should export allowed periods', () => {
            expect(ALLOWED_INSTALLMENT_PERIODS).toContain('3')
            expect(ALLOWED_INSTALLMENT_PERIODS).toContain('6')
            expect(ALLOWED_INSTALLMENT_PERIODS).toContain('12')
            expect(ALLOWED_INSTALLMENT_PERIODS).toContain('18')
            expect(ALLOWED_INSTALLMENT_PERIODS).toContain('24')
        })
    })

    describe('ApplePayPayment', () => {
        it('should create Apple Pay payment', () => {
            const payment = new ApplePayPayment(merchantID, hashKey, hashIV)
            payment.setMerchantTradeNo('Apple' + Date.now())
                .setTotalAmount(100)
                .setTradeDesc('Apple Pay Test')
                .setItemName('Test Item')
                .setReturnURL('https://example.com/callback')

            const payload = payment.getContent()
            expect(payload.ChoosePayment).toBe(ChoosePayment.ApplePay)
        })
    })

    describe('TwqrPayment', () => {
        it('should create TWQR payment', () => {
            const payment = new TwqrPayment(merchantID, hashKey, hashIV)
            payment.setMerchantTradeNo('Twqr' + Date.now())
                .setTotalAmount(100)
                .setTradeDesc('TWQR Test')
                .setItemName('Test Item')
                .setReturnURL('https://example.com/callback')

            const payload = payment.getContent()
            expect(payload.ChoosePayment).toBe(ChoosePayment.TWQR)
        })
    })

    describe('EcPayPayPayment', () => {
        it('should create EcPayPay payment', () => {
            const payment = new EcPayPayPayment(merchantID, hashKey, hashIV)
            payment.setMerchantTradeNo('EcPay' + Date.now())
                .setTotalAmount(100)
                .setTradeDesc('EcPayPay Test')
                .setItemName('Test Item')
                .setReturnURL('https://example.com/callback')

            const payload = payment.getContent()
            expect(payload.ChoosePayment).toBe(ChoosePayment.EcpayPay)
        })
    })

    describe('WechatPayment', () => {
        it('should create WeChat payment', () => {
            const payment = new WechatPayment(merchantID, hashKey, hashIV)
            payment.setMerchantTradeNo('Wechat' + Date.now())
                .setTotalAmount(100)
                .setTradeDesc('WeChat Test')
                .setItemName('Test Item')
                .setReturnURL('https://example.com/callback')

            const payload = payment.getContent()
            expect(payload.ChoosePayment).toBe(ChoosePayment.WechatPay)
        })
    })
})

