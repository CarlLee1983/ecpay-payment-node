import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'
import { PaymentError } from '../errors/PaymentError'

export class QueryOrder extends Content {
    protected requestPath = '/Cashier/QueryTradeInfo/V5'
    protected choosePayment = ChoosePayment.ALL

    protected initContent(): void {
        const timestamp = Math.floor(Date.now() / 1000)

        this.content = {
            MerchantID: this.merchantID,
            MerchantTradeNo: '',
            TimeStamp: timestamp,
        }
    }

    public setMerchantTradeNo(tradeNo: string): this {
        this.content.MerchantTradeNo = tradeNo
        return this
    }

    public setPlatformID(platformId: string): this {
        this.content.PlatformID = platformId
        return this
    }

    // Override incompatible methods
    public setTotalAmount(_amount: number): this {
        return this
    }

    public setTradeDesc(_desc: string): this {
        return this
    }

    public setItemName(_name: string): this {
        return this
    }

    public setReturnURL(_url: string): this {
        return this
    }
    public getChoosePayment(): string { return '' }

    validate(): void {
        if (!this.merchantID) throw PaymentError.required('MerchantID')
        if (!this.content.MerchantTradeNo) throw PaymentError.required('MerchantTradeNo')
    }
}
