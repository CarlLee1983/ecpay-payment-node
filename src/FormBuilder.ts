import { Content } from './base/Content'

export class FormBuilder {
    private serverUrl: string

    constructor(serverUrl: string = 'https://payment-stage.ecpay.com.tw') {
        this.serverUrl = serverUrl.replace(/\/$/, '')
    }

    public build(payment: Content, formId: string = 'ecpay-form', submitText: string = '前往付款'): string {
        const actionUrl = this.getActionUrl(payment)
        const fields = payment.getContent()

        let html = `<form id="${formId}" method="post" action="${actionUrl}">\n`
        for (const [name, value] of Object.entries(fields)) {
            html += `    <input type="hidden" name="${name}" value="${value}">\n`
        }
        html += `    <button type="submit">${submitText}</button>\n`
        html += `</form>`

        return html
    }

    public autoSubmit(payment: Content, formId: string = 'ecpay-form', loadingText: string = '正在導向綠界付款頁面，請稍候...'): string {
        const actionUrl = this.getActionUrl(payment)
        const fields = payment.getContent()

        let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>付款處理中</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .loading { text-align: center; margin-top: 100px; }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="loading">
        <div class="spinner"></div>
        <p>${loadingText}</p>
    </div>
    <form id="${formId}" method="post" action="${actionUrl}" style="display:none;">\n`

        for (const [name, value] of Object.entries(fields)) {
            html += `        <input type="hidden" name="${name}" value="${value}">\n`
        }

        html += `    </form>
    <script>
        document.getElementById("${formId}").submit();
    </script>
</body>
</html>`

        return html
    }

    public getActionUrl(payment: Content): string {
        return `${this.serverUrl}${payment.getRequestPath()}`
    }

    public toJson(payment: Content): string {
        return JSON.stringify({
            action: this.getActionUrl(payment),
            fields: payment.getContent(),
        }, null, 2)
    }
}
