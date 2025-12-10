import { describe, expect, it } from 'bun:test'
import { formatEcPayDate, getTimestamp } from '../../src/utils/dateUtils'

describe('dateUtils', () => {
    describe('formatEcPayDate', () => {
        it('should format date to ECPay format', () => {
            const date = new Date('2024-06-15T14:30:45')
            const result = formatEcPayDate(date)
            expect(result).toBe('2024/06/15 14:30:45')
        })

        it('should pad single digit months and days', () => {
            const date = new Date('2024-01-05T09:05:03')
            const result = formatEcPayDate(date)
            expect(result).toBe('2024/01/05 09:05:03')
        })

        it('should use current date when no argument provided', () => {
            const before = new Date()
            const result = formatEcPayDate()
            const after = new Date()

            // 驗證格式正確
            expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/)

            // 驗證時間在合理範圍內
            const resultDate = new Date(result.replace(/\//g, '-').replace(' ', 'T'))
            expect(resultDate.getTime()).toBeGreaterThanOrEqual(before.getTime() - 1000)
            expect(resultDate.getTime()).toBeLessThanOrEqual(after.getTime() + 1000)
        })

        it('should handle midnight correctly', () => {
            const date = new Date('2024-12-31T00:00:00')
            const result = formatEcPayDate(date)
            expect(result).toBe('2024/12/31 00:00:00')
        })

        it('should handle end of day correctly', () => {
            const date = new Date('2024-12-31T23:59:59')
            const result = formatEcPayDate(date)
            expect(result).toBe('2024/12/31 23:59:59')
        })
    })

    describe('getTimestamp', () => {
        it('should return Unix timestamp in seconds', () => {
            const before = Math.floor(Date.now() / 1000)
            const result = getTimestamp()
            const after = Math.floor(Date.now() / 1000)

            expect(result).toBeGreaterThanOrEqual(before)
            expect(result).toBeLessThanOrEqual(after)
        })

        it('should return integer value', () => {
            const result = getTimestamp()
            expect(Number.isInteger(result)).toBe(true)
        })

        it('should be in reasonable range', () => {
            const result = getTimestamp()
            // 2024 年之後的時間戳
            expect(result).toBeGreaterThan(1704067200) // 2024-01-01 00:00:00 UTC
            // 2100 年之前
            expect(result).toBeLessThan(4102444800) // 2100-01-01 00:00:00 UTC
        })
    })
})

