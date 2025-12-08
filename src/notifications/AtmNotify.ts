import { PaymentNotify } from './PaymentNotify'

export class AtmNotify extends PaymentNotify {
    public getBankCode(): string {
        return this.getData().BankCode ? String(this.getData().BankCode) : ''
    }

    public getvAccount(): string {
        return this.getData().vAccount ? String(this.getData().vAccount) : ''
    }

    public getExpireDate(): string {
        return this.getData().ExpireDate ? String(this.getData().ExpireDate) : ''
    }
}
