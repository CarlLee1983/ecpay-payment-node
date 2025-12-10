import { Content } from './base/Content'

/**
 * FormBuilder
 *
 * A helper class to generate HTML forms or JSON data for ECPay Payment.
 * Useful for frontend integrations.
 */
export class FormBuilder {
    private serverUrl: string

    constructor(serverUrl: string = 'https://payment-stage.ecpay.com.tw') {
        this.serverUrl = serverUrl.replace(/\/$/, '')
    }

    /**
     * 將字串進行 HTML 轉義，防止 XSS 攻擊
     *
     * @param str - 要轉義的字串
     * @returns 轉義後的安全字串
     */
    private escapeHtml(str: string): string {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
    }

    /**
     * Generate a standard HTML Form string.
     *
     * @param payment - The payment object containing parameters
     * @param formId - The ID for the form element
     * @param submitText - The text for the submit button
     * @returns An HTML string of the form
     */
    public build(payment: Content, formId: string = 'ecpay-form', submitText: string = '前往付款'): string {
        const actionUrl = this.escapeHtml(this.getActionUrl(payment))
        const fields = payment.getContent()
        const safeFormId = this.escapeHtml(formId)
        const safeSubmitText = this.escapeHtml(submitText)

        let html = `<form id="${safeFormId}" method="post" action="${actionUrl}">\n`
        for (const [name, value] of Object.entries(fields)) {
            const safeName = this.escapeHtml(String(name))
            const safeValue = this.escapeHtml(String(value))
            html += `    <input type="hidden" name="${safeName}" value="${safeValue}">\n`
        }
        html += `    <button type="submit">${safeSubmitText}</button>\n`
        html += `</form>`

        return html
    }

    /**
     * Generate an HTML Form that automatically submits itself.
     * Useful for redirecting the user immediately.
     *
     * @param payment - The payment object
     * @param formId - The ID for the form element
     * @param loadingText - The text displayed while redirecting
     * @returns A full HTML page string with auto-submit script
     */
    public autoSubmit(payment: Content, formId: string = 'ecpay-form', loadingText: string = '正在導向綠界付款頁面，請稍候...'): string {
        const actionUrl = this.escapeHtml(this.getActionUrl(payment))
        const fields = payment.getContent()
        const safeFormId = this.escapeHtml(formId)
        const safeLoadingText = this.escapeHtml(loadingText)

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
        <p>${safeLoadingText}</p>
    </div>
    <form id="${safeFormId}" method="post" action="${actionUrl}" style="display:none;">\n`

        for (const [name, value] of Object.entries(fields)) {
            const safeName = this.escapeHtml(String(name))
            const safeValue = this.escapeHtml(String(value))
            html += `        <input type="hidden" name="${safeName}" value="${safeValue}">\n`
        }

        html += `    </form>
    <script>
        document.getElementById("${safeFormId}").submit();
    </script>
</body>
</html>`

        return html
    }

    /**
     * Get the full action URL for the payment request.
     */
    public getActionUrl(payment: Content): string {
        return `${this.serverUrl}${payment.getRequestPath()}`
    }

    /**
     * Generate a JSON object containing the action URL and fields.
     * Useful for API responses where the frontend builds the form.
     */
    public toJson(payment: Content): string {
        return JSON.stringify({
            action: this.getActionUrl(payment),
            fields: payment.getContent(),
        }, null, 2)
    }
}
