import SibApiV3Sdk from "sib-api-v3-sdk"
import { fileURLToPath } from "url"
import fs from "fs"
import path from "path"
import handlebars from "handlebars"
import config from "../config/index.js"

const defaultClient = SibApiV3Sdk.ApiClient.instance
const apiKey = defaultClient.authentications["api-key"]
apiKey.apiKey = config.emails.apiKey
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

export const sendEmail = async ({ email, subject, payload, templateName }) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const source = fs.readFileSync(
    path.join(__dirname, "../emails", `${templateName}.handlebars`),
    "utf8",
  )

  const compiledTemplate = handlebars.compile(source)

  sendSmtpEmail = {
    sender: { name: config.emails.fromName, email: config.emails.fromEmail },
    to: [{ email }],
    subject,
    htmlContent: compiledTemplate(payload),
  }
  await apiInstance.sendTransacEmail(sendSmtpEmail)
  logger.info(`Email sent to ${email} successfully`)
}
