interface OtpTemplateParams {
  name: string
  otp: string
}
const emailOTP = ({ name, otp }: OtpTemplateParams): string => {
  return `<!DOCTYPE html>
              <html lang="en">
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>OTP Verification</title>
                      <style>
                          body {
                              background-color: #f4f4f4;
                              margin: 0;
                              padding: 0;
                          }
                          .email-container {
                              max-width: 600px;
                              margin: 0 auto;
                              background-color: #ffffff;
                              padding: 20px;
                              border: 1px solid #dddddd;
                              border-radius: 5px;
                          }
                          .header {
                              background-color: #00e3a1;
                              color: #232323;
                              padding: 10px 0;
                              text-align: center;
                              border-radius: 5px 5px 0 0;
                          }
                          .content {
                              margin: 20px 0;
                              text-align: center;
                          }
                          .otp {
                              font-size: 24px;
                              font-weight: bold;
                              margin: 20px 0;
                              padding: 10px;
                              background-color: #f1f1f1;
                              border: 1px solid #dddddd;
                              display: inline-block;
                              border-radius: 5px;
                          }
                          .footer {
                              text-align: center;
                              color: #888888;
                              font-size: 12px;
                              margin-top: 20px;
                          }
                      </style>
                  </head>
                  <body>
                      <div class="email-container">
                          <div class="header">
                              <h1>OTP Verification</h1>
                          </div>
                          <div class="content">
                              <p>Dear ${name},</p>
                              <p>Your one-time password (OTP) for verification is:</p>
                              <div class="otp">${otp}</div>
                              <p>Please use this OTP to complete your verification. This OTP is valid for the next 10 minutes.</p>
                              <p>If you did not request this OTP, please ignore this email.</p>
                          </div>
                          <div class="footer">
                              <p>&copy; 2024 www.foysal.com All rights reserved.</p>
                          </div>
                      </div>
                  </body>
              </html>
  `
}
export { emailOTP }
