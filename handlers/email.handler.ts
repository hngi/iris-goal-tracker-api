import path from 'path'
import nodemailer, { Transporter } from 'nodemailer'
import mailgunTransport from 'nodemailer-mailgun-transport'
import ejs from 'ejs'
import { constants } from '../constants/constants';

class EmailHandler {
  // Configure transport options
  private api_key: any = process.env.MAILGUN_ACTIVE_API_KEY
  private domain: any = process.env.MAILGUN_DOMAIN
  private mailgunOptions: mailgunTransport.Options = {
    auth: {
      api_key: this.api_key,
      domain: this.domain,
    }
  }
  private mailgunTransporter: mailgunTransport.MailgunTransport = mailgunTransport(this.mailgunOptions)
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport(this.mailgunTransporter)
  }

  /**
   * @param to - Email recipient
   * @param subject - Email subject
   * @param data - Data to be sent 
   * @param templateName - (optional) EJS template to be used
   * @param content - (optional) Body of the email
   */
  sendEmail(to: string, subject: string, data: any, templateName?: string, content?: string) {
    return new Promise((resolve, reject) => {

      const mailOptions: any = { from: 'Iris Team no-reply@iris-team.com', to, subject }
      data.currentYear = new Date().getFullYear()

      if (templateName) {
        data.baseUrl = constants.BASE_URL
        const templatePath = path.join(__dirname, '..', 'lib', 'email-templates', `${templateName}.ejs`)
        ejs.renderFile(templatePath, data, (err, template) => {
          if (err) {
            reject(err)
          } else {
            mailOptions.html = template

            this.transporter.sendMail(mailOptions, (err, info) => {
              if (err) reject(err)
              console.log(info)
              resolve(info)
            })
          }
        })

      } else {
        mailOptions.html = content

        this.transporter.sendMail(mailOptions, (err, info) => {
          if (err) reject(err)
          resolve(info)
        })
      }
    })
  }
}

export default new EmailHandler()