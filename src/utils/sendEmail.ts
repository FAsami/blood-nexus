import nodemailer from 'nodemailer'

interface EmailOptions {
  from: {
    email: string
    name: string
  }
  to: {
    email: string
    name: string
  }
  subject: string
  htmlbody: string
}

const sendEmail = async ({
  to,
  from,
  subject,
  htmlbody
}: EmailOptions): Promise<void> => {
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_PORT ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASSWORD
  ) {
    throw new Error('Credential not found!')
  }

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: `${from.name} <${from.email}>`,
    to: `${to.name} <${to.email}>`,
    subject,
    html: htmlbody
  }

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error)
        reject(new Error('Failed to send email'))
      } else {
        console.log('Email sent:', info.response)
        resolve()
      }
    })
  })
}

export { sendEmail }
