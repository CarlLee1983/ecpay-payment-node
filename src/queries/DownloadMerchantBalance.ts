import { Content } from '../base/Content'
import { ChoosePayment } from '../enums/ChoosePayment'
import { PaymentError } from '../errors/PaymentError'

/**
 * Download Merchant Balance
 *
 * Downloads merchant trade details.
 */
export class DownloadMerchantBalance extends Content {
    protected requestPath = '/Cashier/TradeNoAio'
    protected choosePayment = ChoosePayment.ALL

    protected initContent(): void {
        super.initContent()
        this.content = {
            MerchantID: this.merchantID,
            DateType: '2', // 2=PaymentDate
            BeginDate: '',
            EndDate: '',
            MediaFormated: '0',
        }
    }

    /**
     * Set date type query.
     * @param type - 2: Payment Date, 4: Alloc Date, 5: Reject Date, 6: Capture Date
     */
    public setDateType(type: '2' | '4' | '5' | '6'): this {
        this.content.DateType = type
        return this
    }

    /**
     * Set begin date (yyyy-MM-dd).
     */
    public setBeginDate(date: string): this {
        this.content.BeginDate = date
        return this
    }

    /**
     * Set end date (yyyy-MM-dd).
     */
    public setEndDate(date: string): this {
        this.content.EndDate = date
        return this
    }

    /**
     * Set media format.
     * @param format - 0: Text, 1: XML (Usually 0)
     */
    public setMediaFormated(format: '0' | '1'): this {
        this.content.MediaFormated = format
        return this
    }

    validate(): void {
        if (!this.merchantID) throw PaymentError.required('MerchantID')
        if (!this.content.BeginDate) throw PaymentError.required('BeginDate')
        if (!this.content.EndDate) throw PaymentError.required('EndDate')
    }
}
