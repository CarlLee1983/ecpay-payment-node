import { describe, expect, it } from 'bun:test'
import { PaymentError } from '../../src/errors/PaymentError'

describe('PaymentError', () => {
    describe('constructor', () => {
        it('should create error with message only', () => {
            const error = new PaymentError('Test error')
            expect(error.message).toBe('Test error')
            expect(error.name).toBe('PaymentError')
            expect(error.code).toBe('PAYMENT_ERROR')
            expect(error.field).toBeUndefined()
        })

        it('should create error with code and field', () => {
            const error = new PaymentError('Test error', 'TEST_CODE', 'testField')
            expect(error.message).toBe('Test error')
            expect(error.code).toBe('TEST_CODE')
            expect(error.field).toBe('testField')
        })

        it('should be instanceof Error', () => {
            const error = new PaymentError('Test')
            expect(error instanceof Error).toBe(true)
            expect(error instanceof PaymentError).toBe(true)
        })
    })

    describe('static factory methods', () => {
        it('required() should create required field error', () => {
            const error = PaymentError.required('MerchantID')
            expect(error.message).toBe('Field "MerchantID" is required.')
            expect(error.code).toBe('REQUIRED')
            expect(error.field).toBe('MerchantID')
        })

        it('tooLong() should create length error', () => {
            const error = PaymentError.tooLong('TradeDesc', 200)
            expect(error.message).toBe('Field "TradeDesc" must be less than 200 characters.')
            expect(error.code).toBe('TOO_LONG')
            expect(error.field).toBe('TradeDesc')
        })

        it('invalid() should create invalid field error', () => {
            const error = PaymentError.invalid('Amount', 'must be positive')
            expect(error.message).toBe('Field "Amount" is invalid: must be positive')
            expect(error.code).toBe('INVALID')
            expect(error.field).toBe('Amount')
        })

        it('checkMacValueFailed() should create checksum error', () => {
            const error = PaymentError.checkMacValueFailed()
            expect(error.message).toBe('CheckMacValue verification failed.')
            expect(error.code).toBe('CHECK_MAC_FAILED')
            expect(error.field).toBeUndefined()
        })

        it('httpError() should create HTTP error', () => {
            const error = PaymentError.httpError(500, 'Internal Server Error')
            expect(error.message).toBe('HTTP Error: 500 Internal Server Error')
            expect(error.code).toBe('HTTP_ERROR')
            expect(error.field).toBeUndefined()
        })

        it('timeout() should create timeout error without URL', () => {
            const error = PaymentError.timeout(30000)
            expect(error.message).toBe('Request timeout after 30000ms')
            expect(error.code).toBe('TIMEOUT')
        })

        it('timeout() should create timeout error with URL', () => {
            const error = PaymentError.timeout(5000, 'https://api.ecpay.com.tw')
            expect(error.message).toBe('Request timeout after 5000ms for https://api.ecpay.com.tw')
            expect(error.code).toBe('TIMEOUT')
        })

        it('networkError() should create network error', () => {
            const error = PaymentError.networkError('Connection refused')
            expect(error.message).toBe('Network error: Connection refused')
            expect(error.code).toBe('NETWORK_ERROR')
        })
    })

    describe('toJSON()', () => {
        it('should serialize error to JSON object', () => {
            const error = new PaymentError('Test error', 'TEST_CODE', 'testField')
            const json = error.toJSON()

            expect(json).toEqual({
                name: 'PaymentError',
                message: 'Test error',
                code: 'TEST_CODE',
                field: 'testField',
            })
        })

        it('should serialize error without field', () => {
            const error = PaymentError.checkMacValueFailed()
            const json = error.toJSON()

            expect(json.name).toBe('PaymentError')
            expect(json.code).toBe('CHECK_MAC_FAILED')
            expect(json.field).toBeUndefined()
        })

        it('should work with JSON.stringify', () => {
            const error = PaymentError.required('Amount')
            const jsonString = JSON.stringify(error)
            const parsed = JSON.parse(jsonString)

            expect(parsed.code).toBe('REQUIRED')
            expect(parsed.field).toBe('Amount')
        })
    })
})

