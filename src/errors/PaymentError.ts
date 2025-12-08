export class PaymentError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'PaymentError'
    }

    static required(field: string): PaymentError {
        return new PaymentError(`Field "${field}" is required.`)
    }

    static tooLong(field: string, maxLength: number): PaymentError {
        return new PaymentError(`Field "${field}" must be less than ${maxLength} characters.`)
    }

    static invalid(field: string, reason: string): PaymentError {
        return new PaymentError(`Field "${field}" is invalid: ${reason}`)
    }

    static checkMacValueFailed(): PaymentError {
        return new PaymentError('CheckMacValue verification failed.')
    }
}
