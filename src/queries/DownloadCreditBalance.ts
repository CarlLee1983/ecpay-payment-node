import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'
import { PaymentError } from '../errors/PaymentError'

export class DownloadCreditBalance extends Content {
    protected requestPath = '/CreditDetail/FundingReconDetail'
    protected choosePayment = ChoosePayment.ALL

    protected initContent(): void {
        super.initContent()
        this.content = {
            MerchantID: this.merchantID,
            PayDateType: 'close',
            StartDate: '',
            EndDate: '',
        }
    }

    public setPayDateType(type: 'close' | 'fund'): this {
        this.content.PayDateType = type
        return this
    }

    public setStartDate(date: string): this {
        this.content.StartDate = date
        return this
    }

    public setEndDate(date: string): this {
        this.content.EndDate = date
        return this
    }

    validate(): void {
        if (!this.merchantID) throw PaymentError.required('MerchantID')
        if (!this.content.StartDate) throw PaymentError.required('StartDate')
        if (!this.content.EndDate) throw PaymentError.required('EndDate')
    }
}
