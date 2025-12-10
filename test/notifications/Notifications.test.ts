import { describe, expect, it } from 'bun:test'
import { PaymentNotify } from '../../src/notifications/PaymentNotify'
import { AtmNotify } from '../../src/notifications/AtmNotify'
import { CheckMacEncoder } from '../../src/security/CheckMacEncoder'
import { EncryptType } from '../../src/enums/EncryptType'
import { PaymentError } from '../../src/errors/PaymentError'

const hashKey = '5294y06JbISpM5x9'
const hashIV = 'v77hoKGq4kWxNNIS'

describe('Notifications', () => {
    const encoder = new CheckMacEncoder(hashKey, hashIV, EncryptType.SHA256)

    describe('PaymentNotify', () => {
        it('should verify success response', () => {
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

        it('should return TradeNo', () => {
            const notify = new PaymentNotify(hashKey, hashIV)
            const data = {
                MerchantID: '2000132',
                TradeNo: '2024012312345678',
                RtnCode: '1',
            }
            const checkMac = encoder.generateCheckMacValue(data)
            notify.verify({ ...data, CheckMacValue: checkMac })

            expect(notify.getTradeNo()).toBe('2024012312345678')
        })

        it('should detect simulated payment', () => {
            const notify = new PaymentNotify(hashKey, hashIV)
            const data = {
                MerchantID: '2000132',
                RtnCode: '1',
                SimulatePaid: '1',
            }
            const checkMac = encoder.generateCheckMacValue(data)
            notify.verify({ ...data, CheckMacValue: checkMac })

            expect(notify.isSimulatePaid()).toBe(true)
        })

        it('should return payment date and type', () => {
            const notify = new PaymentNotify(hashKey, hashIV)
            const data = {
                MerchantID: '2000132',
                RtnCode: '1',
                PaymentDate: '2024/01/15 14:30:00',
                PaymentType: 'Credit_CreditCard',
            }
            const checkMac = encoder.generateCheckMacValue(data)
            notify.verify({ ...data, CheckMacValue: checkMac })

            expect(notify.getPaymentDate()).toBe('2024/01/15 14:30:00')
            expect(notify.getPaymentType()).toBe('Credit_CreditCard')
        })

        it('should return custom fields', () => {
            const notify = new PaymentNotify(hashKey, hashIV)
            const data = {
                MerchantID: '2000132',
                RtnCode: '1',
                CustomField1: 'Value1',
                CustomField2: 'Value2',
                CustomField3: 'Value3',
                CustomField4: 'Value4',
            }
            const checkMac = encoder.generateCheckMacValue(data)
            notify.verify({ ...data, CheckMacValue: checkMac })

            expect(notify.getCustomField(1)).toBe('Value1')
            expect(notify.getCustomField(2)).toBe('Value2')
            expect(notify.getCustomField(3)).toBe('Value3')
            expect(notify.getCustomField(4)).toBe('Value4')
        })

        it('should track verification status', () => {
            const notify = new PaymentNotify(hashKey, hashIV)
            expect(notify.isVerified()).toBe(false)

            const data = { MerchantID: '2000132', RtnCode: '1' }
            const checkMac = encoder.generateCheckMacValue(data)
            notify.verify({ ...data, CheckMacValue: checkMac })

            expect(notify.isVerified()).toBe(true)
        })

        it('should fail verification for invalid checksum', () => {
            const notify = new PaymentNotify(hashKey, hashIV)
            const data = {
                MerchantID: '2000132',
                RtnCode: '1',
                CheckMacValue: 'INVALID_CHECKSUM',
            }

            expect(notify.verify(data)).toBe(false)
            expect(notify.isVerified()).toBe(false)
        })

        it('should throw error on verifyOrFail with invalid checksum', () => {
            const notify = new PaymentNotify(hashKey, hashIV)
            const data = {
                MerchantID: '2000132',
                RtnCode: '1',
                CheckMacValue: 'INVALID_CHECKSUM',
            }

            expect(() => notify.verifyOrFail(data)).toThrow(PaymentError)
        })

        it('should return success response string', () => {
            const notify = new PaymentNotify(hashKey, hashIV)
            expect(notify.getSuccessResponse()).toBe('1|OK')
        })

        it('should detect non-success response', () => {
            const notify = new PaymentNotify(hashKey, hashIV)
            const data = {
                MerchantID: '2000132',
                RtnCode: '0',
                RtnMsg: 'Failed',
            }
            const checkMac = encoder.generateCheckMacValue(data)
            notify.verify({ ...data, CheckMacValue: checkMac })

            expect(notify.isSuccess()).toBe(false)
            expect(notify.getRtnCode()).toBe('0')
            expect(notify.getRtnMsg()).toBe('Failed')
        })

        it('should return raw data', () => {
            const notify = new PaymentNotify(hashKey, hashIV)
            const data = {
                MerchantID: '2000132',
                RtnCode: '1',
                CustomData: 'Test',
            }
            const checkMac = encoder.generateCheckMacValue(data)
            const payload = { ...data, CheckMacValue: checkMac }
            notify.verify(payload)

            const rawData = notify.getData()
            expect(rawData.MerchantID).toBe('2000132')
            expect(rawData.CustomData).toBe('Test')
        })
    })

    describe('AtmNotify', () => {
        it('should parse ATM info', () => {
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
            expect(notify.getExpireDate()).toBe('2023/12/31')
        })

        it('should use new getVAccount method', () => {
            const notify = new AtmNotify(hashKey, hashIV)
            const data = {
                MerchantID: '2000132',
                RtnCode: '2',
                vAccount: '9876543210',
            }
            const checkMac = encoder.generateCheckMacValue(data)
            notify.verify({ ...data, CheckMacValue: checkMac })

            // 新方法
            expect(notify.getVAccount()).toBe('9876543210')
            // 舊方法（已棄用但仍相容）
            expect(notify.getvAccount()).toBe('9876543210')
        })

        it('should return empty string for missing fields', () => {
            const notify = new AtmNotify(hashKey, hashIV)
            const data = {
                MerchantID: '2000132',
                RtnCode: '1',
            }
            const checkMac = encoder.generateCheckMacValue(data)
            notify.verify({ ...data, CheckMacValue: checkMac })

            expect(notify.getBankCode()).toBe('')
            expect(notify.getVAccount()).toBe('')
            expect(notify.getExpireDate()).toBe('')
        })
    })
})
