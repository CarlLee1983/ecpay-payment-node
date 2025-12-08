# ECPay Payment SDK for Node.js

[English](README.md) | [繁體中文](README_TW.md)

綠界金流 SDK Node.js 版本 (非官方)，基於 Bun 開發，支援 ESM 與 CJS。

## 特色

- 🚀 完整支援 TypeScript
- 📦 同時支援 ESM 與 CommonJS
- 🔒 內建 CheckMacValue 計算與驗證
- 🛠 提供 FormBuilder 快速產生付款表單

## 安裝

```bash
npm install ecpay-payment-node
# or
yarn add ecpay-payment-node
# or
pnpm add ecpay-payment-node
# or
bun add ecpay-payment-node
```

## 使用範例

### 1. 信用卡付款 (一般/一次付清)

```typescript
import { CreditPayment, FormBuilder } from 'ecpay-payment-node'

// 1. 初始化
const payment = new CreditPayment('2000132', '5294y06JbISpM5x9', 'v77hoKGq4kWxNNIS')

// 2. 設定參數
payment
  .setMerchantTradeNo('Credit' + Date.now())
  .setMerchantTradeDate(new Date())
  .setTotalAmount(1000)
  .setTradeDesc('信用卡測試交易')
  .setItemName('測試商品 A x 1')
  .setReturnURL('https://example.com/return')
  // 選擇性參數
  .setClientBackURL('https://example.com/client-back')
  .setNeedExtraPaidInfo('Y')

// 3. 產生表單 (HTML)
const builder = new FormBuilder()
const html = builder.build(payment)
```

### 2. 信用卡分期付款

```typescript
import { CreditInstallment, FormBuilder } from 'ecpay-payment-node'

const payment = new CreditInstallment('2000132', '5294y06JbISpM5x9', 'v77hoKGq4kWxNNIS')
payment.setMerchantTradeNo('Inst' + Date.now())
       .setTotalAmount(3000)
       .setTradeDesc('分期付款測試')
       .setItemName('昂貴商品 x 1')
       .setReturnURL('https://example.com/return')
       // 設定分期期數 (3, 6, 12, 18, 24)
       .setCreditInstallment('3')

const html = new FormBuilder().build(payment)
```

### 3. 信用卡定期定額 (Credit Recurring)

> 💡 **適用場景**：訂閱制服務、定期捐款、會費扣繳。

```typescript
import { CreditRecurring, FormBuilder, PeriodType } from 'ecpay-payment-node'

const payment = new CreditRecurring('2000132', '5294y06JbISpM5x9', 'v77hoKGq4kWxNNIS')
payment.setMerchantTradeNo('Rec' + Date.now())
       .setTotalAmount(99) // 第一次授權金額 (通常等於每期金額)
       .setTradeDesc('訂閱服務')
       .setItemName('月費會員')
       .setReturnURL('https://example.com/return') // 首次授權結果回傳網址
       // 定期定額專用參數 (必須設定)
       .setPeriodAmount(99)        // 每次扣款金額
       .setPeriodType(PeriodType.Month) // 週期類別 (Year, Month, Day)
       .setFrequency(1)            // 執行頻率 (每 1 個月)
       .setExecTimes(12)           // 執行次數 (共 12 次)
       .setPeriodReturnURL('https://example.com/period-return') // 每次定期扣款結果的回傳網址

const html = new FormBuilder().build(payment)
```

**參數詳細說明：**

| 參數方法 | 說明 | 範例 |
| :--- | :--- | :--- |
| `setPeriodAmount` | **每期扣款金額**<br>每次定期執行時實際扣款的金額。 | `99` |
| `setPeriodType` | **週期類別**<br>定義週期的單位。<br>- `PeriodType.Day` (天)<br>- `PeriodType.Month` (月)<br>- `PeriodType.Year` (年) | `PeriodType.Month` |
| `setFrequency` | **執行頻率**<br>搭配週期類別使用。<br>例如類別為月，頻率為 1，代表「每 1 個月」扣款一次。<br>若頻率為 2，代表「每 2 個月」扣款一次。 | `1` |
| `setExecTimes` | **執行總次數**<br>總共要執行扣款的次數。<br>例如 `12` 代表總共扣款 12 次 (含首次)。 | `12` |
| `setPeriodReturnURL`| **定期扣款回傳網址**<br>每次定期扣款成功後，綠界 Server 會呼叫此網址通知結果。 | `https://...` |

### 4. ATM 虛擬帳號

```typescript
import { AtmPayment, FormBuilder } from 'ecpay-payment-node'

const payment = new AtmPayment('2000132', '5294y06JbISpM5x9', 'v77hoKGq4kWxNNIS')
payment.setMerchantTradeNo('ATM' + Date.now())
       .setTotalAmount(500)
       .setTradeDesc('ATM 轉帳測試')
       .setItemName('轉帳商品')
       .setReturnURL('https://example.com/return')
       // ATM 專用參數
       .setExpireDate(3) // 3天後過期
       .setPaymentInfoURL('https://example.com/payment-info') // Server 端接收轉帳資訊

const html = new FormBuilder().build(payment)
```

### 5. 超商代碼 (CVS)

```typescript
import { CvsPayment, FormBuilder } from 'ecpay-payment-node'

const payment = new CvsPayment('2000132', '5294y06JbISpM5x9', 'v77hoKGq4kWxNNIS')
payment.setMerchantTradeNo('CVS' + Date.now())
       .setTotalAmount(200)
       .setTradeDesc('超商繳費測試')
       .setItemName('超商商品')
       .setReturnURL('https://example.com/return')
       // CVS 專用參數
       .setStoreExpireDate(10080) // 分鐘 (7天)
       .setPaymentInfoURL('https://example.com/payment-info')

const html = new FormBuilder().build(payment)
```

### 6. Apple Pay

```typescript
import { ApplePayPayment, FormBuilder } from 'ecpay-payment-node'

const payment = new ApplePayPayment(merchantID, hashKey, hashIV)
payment.setMerchantTradeNo('Apple' + Date.now())
       .setTotalAmount(1000)
       .setTradeDesc('Apple Pay Test')
       .setItemName('IPhone Case')
       .setReturnURL('https://example.com/return')

const builder = new FormBuilder()
const html = builder.build(payment)
```

### 驗證通知

```typescript
import { PaymentNotify } from 'ecpay-payment-node'

const notify = new PaymentNotify(hashKey, hashIV)
const data = { /* 綠界回傳的參數 */ }

if (notify.verify(data)) {
  console.log('驗證成功')
  // 處理訂單...
}
```

### 訂單查詢

```typescript
import { QueryOrder, EcPayClient } from 'ecpay-payment-node'

const client = new EcPayClient(merchantID, hashKey, hashIV)
const query = new QueryOrder(merchantID, hashKey, hashIV)
query.setMerchantTradeNo('Test123456')

const result = await client.query(query)
console.log(result)
```

## 開發

```bash
# 安裝依賴
bun install

# 執行測試
bun test

# 建置
bun run build
```

## License

[MIT](LICENSE) © 2024 Carl Lee
