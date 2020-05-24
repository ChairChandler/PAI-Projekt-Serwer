import smtp_config from 'config/smtp.json'
import { createTransport } from 'nodemailer'
export default createTransport(smtp_config.connection)