import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'
import { PaymentError } from '../errors/PaymentError'

export class QueryRecurringOrder extends Content {
    protected requestPath = '/Cashier/QueryCreditCardPeriodInfo'
    protected choosePayment = ChoosePayment.ALL

    protected initContent(): void {
        const timestamp = Math.floor(Date.now() / 1000)

        this.content = {
            MerchantID: this.merchantID,
            TimeStamp: timestamp,
            MerchantTradeNo: '',
        }
    }

    public setMerchantTradeNo(tradeNo: string): this {
        this.content.MerchantTradeNo = tradeNo
        return this
    }

    validate(): void {
        if (!this.merchantID) throw PaymentError.required('MerchantID')
        if (!this.content.MerchantTradeNo) throw PaymentError.required('MerchantTradeNo')
    }
}
