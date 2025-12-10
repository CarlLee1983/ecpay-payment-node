import { describe, expect, it, mock } from 'bun:test'
import { EcPayClient, type EcPayClientOptions } from '../src/EcPayClient'
import { QueryOrder } from '../src/queries/QueryOrder'
import { CheckMacEncoder } from '../src/security/CheckMacEncoder'
import { EncryptType } from '../src/enums/EncryptType'
import { PaymentError } from '../src/errors/PaymentError'

const merchantID = '2000132'
const hashKey = '5294y06JbISpM5x9'
const hashIV = 'v77hoKGq4kWxNNIS'

describe('EcPayClient', () => {
    describe('constructor', () => {
        it('should create client with options object', () => {
            const options: EcPayClientOptions = {
                hashKey,
                hashIV,
                serverUrl: 'https://payment.ecpay.com.tw',
                encryptType: EncryptType.SHA256,
                timeout: 60000,
            }
            const client = new EcPayClient(options)
            expect(client).toBeInstanceOf(EcPayClient)
        })

        it('should use default values when options are not provided', () => {
            const client = new EcPayClient({
                hashKey,
                hashIV,
            })
            expect(client).toBeInstanceOf(EcPayClient)
        })

        it('should support legacy constructor API', () => {
            const client = new EcPayClient(hashKey, hashIV)
            expect(client).toBeInstanceOf(EcPayClient)
        })

        it('should strip trailing slash from serverUrl', async () => {
            const client = new EcPayClient({
                hashKey,
                hashIV,
                serverUrl: 'https://payment.ecpay.com.tw/',
            })
            
            // 透過 mock fetch 來驗證 URL
            let capturedUrl = ''
            global.fetch = mock((url: string) => {
                capturedUrl = url
                return Promise.resolve(new Response('RtnCode=1'))
            }) as any

            const query = new QueryOrder(merchantID, hashKey, hashIV)
            query.setMerchantTradeNo('Test')
            await client.query(query)

            // 確保沒有雙斜線 (排除 https://)
            const urlWithoutProtocol = capturedUrl.replace('https://', '')
            expect(urlWithoutProtocol).not.toContain('//')
            expect(capturedUrl.startsWith('https://payment.ecpay.com.tw/Cashier')).toBe(true)
        })
    })

    describe('query', () => {
        it('should query API and process response', async () => {
            const client = new EcPayClient({
                hashKey,
                hashIV,
            })
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            query.setMerchantTradeNo('TestTrade')

            const encoder = new CheckMacEncoder(hashKey, hashIV, EncryptType.SHA256)
            const respData = {
                RtnCode: '1',
                RtnMsg: 'Succeeded',
                TradeStatus: '1',
                MerchantID: merchantID,
            }
            const checkMac = encoder.generateCheckMacValue(respData)
            const responseText = `RtnCode=1&RtnMsg=Succeeded&TradeStatus=1&MerchantID=${merchantID}&CheckMacValue=${checkMac}`

            global.fetch = mock(() => Promise.resolve(new Response(responseText))) as any

            const result = await client.query(query)

            expect(result.RtnCode).toBe('1')
            expect(result.TradeStatus).toBe('1')
            expect(result.CheckMacValue).toBe(checkMac)
        })

        it('should handle response without CheckMacValue', async () => {
            const client = new EcPayClient({
                hashKey,
                hashIV,
            })
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            query.setMerchantTradeNo('NoCheckMac')

            // 某些 API 回應不包含 CheckMacValue
            const responseText = 'RtnCode=1&RtnMsg=OK'
            global.fetch = mock(() => Promise.resolve(new Response(responseText))) as any

            const result = await client.query(query)
            expect(result.RtnCode).toBe('1')
        })

        it('should throw PaymentError on HTTP failure', async () => {
            const client = new EcPayClient({
                hashKey,
                hashIV,
            })
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            query.setMerchantTradeNo('FailTrade')

            global.fetch = mock(() => Promise.resolve(new Response('Error', { status: 500, statusText: 'Internal Server Error' }))) as any

            try {
                await client.query(query)
                expect(true).toBe(false) // 不應該到達這裡
            } catch (error) {
                expect(error).toBeInstanceOf(PaymentError)
                expect((error as PaymentError).code).toBe('HTTP_ERROR')
            }
        })

        it('should throw PaymentError on timeout (AbortError)', async () => {
            const client = new EcPayClient({
                hashKey,
                hashIV,
                timeout: 100,
            })
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            query.setMerchantTradeNo('TimeoutTest')

            global.fetch = mock(() => {
                const error = new Error('The operation was aborted')
                error.name = 'AbortError'
                return Promise.reject(error)
            }) as any

            try {
                await client.query(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error).toBeInstanceOf(PaymentError)
                expect((error as PaymentError).code).toBe('TIMEOUT')
            }
        })

        it('should throw PaymentError on network error', async () => {
            const client = new EcPayClient({
                hashKey,
                hashIV,
            })
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            query.setMerchantTradeNo('NetworkError')

            global.fetch = mock(() => Promise.reject(new Error('Network unreachable'))) as any

            try {
                await client.query(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error).toBeInstanceOf(PaymentError)
                expect((error as PaymentError).code).toBe('NETWORK_ERROR')
                expect((error as PaymentError).message).toContain('Network unreachable')
            }
        })

        it('should handle unknown error type', async () => {
            const client = new EcPayClient({
                hashKey,
                hashIV,
            })
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            query.setMerchantTradeNo('UnknownError')

            global.fetch = mock(() => Promise.reject('string error')) as any

            try {
                await client.query(query)
                expect(true).toBe(false)
            } catch (error) {
                expect(error).toBeInstanceOf(PaymentError)
                expect((error as PaymentError).code).toBe('NETWORK_ERROR')
            }
        })
    })

    describe('backward compatibility', () => {
        it('should work with legacy constructor and query', async () => {
            const client = new EcPayClient(hashKey, hashIV)
            const query = new QueryOrder(merchantID, hashKey, hashIV)
            query.setMerchantTradeNo('LegacyTest')

            const encoder = new CheckMacEncoder(hashKey, hashIV, EncryptType.SHA256)
            const respData = {
                RtnCode: '1',
                RtnMsg: 'OK',
                MerchantID: merchantID,
            }
            const checkMac = encoder.generateCheckMacValue(respData)
            const responseText = `RtnCode=1&RtnMsg=OK&MerchantID=${merchantID}&CheckMacValue=${checkMac}`

            global.fetch = mock(() => Promise.resolve(new Response(responseText))) as any

            const result = await client.query(query)
            expect(result.RtnCode).toBe('1')
        })
    })
})
