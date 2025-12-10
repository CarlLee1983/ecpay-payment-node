/**
 * 日期格式化工具
 *
 * 提供 ECPay API 所需的日期格式化功能
 */

/**
 * 將 Date 物件格式化為 ECPay 所需的日期時間格式
 *
 * @param date - 要格式化的日期（預設為當前時間）
 * @returns 格式化後的日期字串 (yyyy/MM/dd HH:mm:ss)
 *
 * @example
 * ```typescript
 * formatEcPayDate() // '2024/01/15 14:30:00'
 * formatEcPayDate(new Date('2024-06-01T10:00:00')) // '2024/06/01 10:00:00'
 * ```
 */
export function formatEcPayDate(date: Date = new Date()): string {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const ii = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    return `${String(yyyy)}/${mm}/${dd} ${hh}:${ii}:${ss}`
}

/**
 * 取得當前 Unix 時間戳（秒）
 *
 * @returns Unix 時間戳
 *
 * @example
 * ```typescript
 * getTimestamp() // 1705312200
 * ```
 */
export function getTimestamp(): number {
    return Math.floor(Date.now() / 1000)
}

