# ECPay Payment SDK for Node.js

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

### 信用卡付款

```typescript
import { CreditPayment, FormBuilder, ChoosePayment } from 'ecpay-payment-node'

const merchantID = '2000132'
const hashKey = '5294y06JbISpM5x9'
const hashIV = 'v77hoKGq4kWxNNIS'

const payment = new CreditPayment(merchantID, hashKey, hashIV)
payment
  .setMerchantTradeNo('Test' + Date.now())
  .setMerchantTradeDate(new Date())
  .setTotalAmount(1000)
  .setTradeDesc('測試交易')
  .setItemName('測試商品')
  .setReturnURL('https://example.com/return')

// 產生 HTML 表單
const builder = new FormBuilder()
const html = builder.build(payment)
console.log(html)
```


### Apple Pay 付款

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
