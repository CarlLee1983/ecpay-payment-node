import { describe, expect, it } from 'bun:test'
import { PaymentNotify } from '../../src/notifications/PaymentNotify'
import { AtmNotify } from '../../src/notifications/AtmNotify'
import { CheckMacEncoder } from '../../src/security/CheckMacEncoder'
import { EncryptType } from '../../src/enums/EncryptType'

const hashKey = '5294y06JbISpM5x9'
const hashIV = 'v77hoKGq4kWxNNIS'

describe('Notifications', () => {
    const encoder = new CheckMacEncoder(hashKey, hashIV, EncryptType.SHA256)

    it('PaymentNotify should verify success response', () => {
        const notify = new PaymentNotify(hashKey, hashIV)

        const data = {
            MerchantID: '2000132',
            MerchantTradeNo: 'Test123',
            RtnCode: '1',
            RtnMsg: 'Succeeded',
            TradeAmt: '100',
        }
        // Generate valid CheckMac
        const checkMac = encoder.generateCheckMacValue(data)
        const payload = { ...data, CheckMacValue: checkMac }

        expect(notify.verify(payload)).toBe(true)
        expect(notify.isSuccess()).toBe(true)
        expect(notify.getTradeAmt()).toBe(100)
        expect(notify.getMerchantID()).toBe('2000132')
        expect(notify.getMerchantTradeNo()).toBe('Test123')
        expect(notify.getPaymentDate()).toBe('')
        expect(notify.getPaymentType()).toBe('')
        expect(notify.isSimulatePaid()).toBe(false)
        expect(notify.getCustomField(1)).toBe('')
        expect(() => notify.verifyOrFail(payload)).not.toThrow()
    })

    it('AtmNotify should parse atm info', () => {
        const notify = new AtmNotify(hashKey, hashIV)
        const data = {
            MerchantID: '2000132',
            RtnCode: '2', // Get Code Success
            BankCode: '822',
            vAccount: '123456789',
            ExpireDate: '2023/12/31',
        }
        const checkMac = encoder.generateCheckMacValue(data)
        const payload = { ...data, CheckMacValue: checkMac }

        expect(notify.verify(payload)).toBe(true)
        expect(notify.getBankCode()).toBe('822')
        expect(notify.getvAccount()).toBe('123456789')
    })
})
