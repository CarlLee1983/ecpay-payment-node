import { describe, expect, it } from 'bun:test'
import { QueryOrder } from '../../src/queries/QueryOrder'
import { DownloadCreditBalance } from '../../src/queries/DownloadCreditBalance'
import { DownloadMerchantBalance } from '../../src/queries/DownloadMerchantBalance'
import { PaymentError } from '../../src/errors/PaymentError'

const merchantID = '2000132'
const hashKey = '5294y06JbISpM5x9'
const hashIV = 'v77hoKGq4kWxNNIS'

describe('Additional Query Tests', () => {
    describe('QueryOrder additional methods', () => {
        it('should set PlatformID', () => {
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            query.setMerchantTradeNo('TestOrder')
            query.setPlatformID('PlatformTest')

            const content = query.getContent()
            expect(content.PlatformID).toBe('PlatformTest')
        })

        it('should ignore setTotalAmount (no-op)', () => {
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            query.setMerchantTradeNo('TestOrder')
            const result = query.setTotalAmount(100)
            expect(result).toBe(query) // 確認返回 this
        })

        it('should ignore setTradeDesc (no-op)', () => {
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            query.setMerchantTradeNo('TestOrder')
            const result = query.setTradeDesc('Description')
            expect(result).toBe(query)
        })

        it('should ignore setItemName (no-op)', () => {
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            query.setMerchantTradeNo('TestOrder')
            const result = query.setItemName('Item')
            expect(result).toBe(query)
        })

        it('should ignore setReturnURL (no-op)', () => {
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            query.setMerchantTradeNo('TestOrder')
            const result = query.setReturnURL('https://example.com')
            expect(result).toBe(query)
        })

        it('should return empty string for getChoosePayment', () => {
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            expect(query.getChoosePayment()).toBe('')
        })

        it('should have correct request path', () => {
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            expect(query.getRequestPath()).toBe('/Cashier/QueryTradeInfo/V5')
        })
    })

    describe('DownloadCreditBalance', () => {
        it('should create valid query with required params', () => {
            const query = new DownloadCreditBalance(merchantID, hashKey, hashIV)
            query.setStartDate('2024-01-01')
            query.setEndDate('2024-01-31')

            const content = query.getContent()
            expect(content.MerchantID).toBe(merchantID)
            expect(content.StartDate).toBe('2024-01-01')
            expect(content.EndDate).toBe('2024-01-31')
            expect(content.PayDateType).toBe('close') // 預設值
        })

        it('should set PayDateType', () => {
            const query = new DownloadCreditBalance(merchantID, hashKey, hashIV)
            query.setStartDate('2024-01-01')
                .setEndDate('2024-01-31')
                .setPayDateType('fund')

            const content = query.getContent()
            expect(content.PayDateType).toBe('fund')
        })

        it('should have correct request path', () => {
            const query = new DownloadCreditBalance(merchantID, hashKey, hashIV)
            expect(query.getRequestPath()).toBe('/CreditDetail/FundingReconDetail')
        })

        it('should throw if StartDate is missing', () => {
            const query = new DownloadCreditBalance(merchantID, hashKey, hashIV)
            query.setEndDate('2024-01-31')
            expect(() => query.validate()).toThrow('StartDate')
        })

        it('should throw if EndDate is missing', () => {
            const query = new DownloadCreditBalance(merchantID, hashKey, hashIV)
            query.setStartDate('2024-01-01')
            expect(() => query.validate()).toThrow('EndDate')
        })
    })

    describe('DownloadMerchantBalance', () => {
        it('should create valid query with required params', () => {
            const query = new DownloadMerchantBalance(merchantID, hashKey, hashIV)
            query.setBeginDate('2024-01-01')
            query.setEndDate('2024-01-31')

            const content = query.getContent()
            expect(content.MerchantID).toBe(merchantID)
            expect(content.BeginDate).toBe('2024-01-01')
            expect(content.EndDate).toBe('2024-01-31')
            expect(content.DateType).toBe('2') // 預設值
            expect(content.MediaFormated).toBe('0') // 預設值
        })

        it('should set DateType', () => {
            const query = new DownloadMerchantBalance(merchantID, hashKey, hashIV)
            query.setBeginDate('2024-01-01')
                .setEndDate('2024-01-31')
                .setDateType('4')

            const content = query.getContent()
            expect(content.DateType).toBe('4')
        })

        it('should set MediaFormated', () => {
            const query = new DownloadMerchantBalance(merchantID, hashKey, hashIV)
            query.setBeginDate('2024-01-01')
                .setEndDate('2024-01-31')
                .setMediaFormated('1')

            const content = query.getContent()
            expect(content.MediaFormated).toBe('1')
        })

        it('should have correct request path', () => {
            const query = new DownloadMerchantBalance(merchantID, hashKey, hashIV)
            expect(query.getRequestPath()).toBe('/Cashier/TradeNoAio')
        })

        it('should throw if BeginDate is missing', () => {
            const query = new DownloadMerchantBalance(merchantID, hashKey, hashIV)
            query.setEndDate('2024-01-31')
            expect(() => query.validate()).toThrow('BeginDate')
        })

        it('should throw if EndDate is missing', () => {
            const query = new DownloadMerchantBalance(merchantID, hashKey, hashIV)
            query.setBeginDate('2024-01-01')
            expect(() => query.validate()).toThrow('EndDate')
        })
    })
})

