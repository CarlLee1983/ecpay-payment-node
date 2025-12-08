export interface INotifyHandler {
    verify(data: Record<string, any>): boolean
    getData(): Record<string, any>
    isSuccess(): boolean
    getRtnCode(): string
    getRtnMsg(): string
}
