import axios from 'axios'

const sendMessage = async ({
  phone,
  message
}: {
  phone: string
  message: string
}) => {
  const formattedPhoneNumber = phone.replaceAll(' ', '').replaceAll('+', '')
  const url = `http://portal.khudebarta.com:3775/sendtext?apikey=${process.env.KHUDEBARTA_API_KEY}&secretkey=${process.env.KHUDEBARTA_API_SECRET}&callerID=${process.env.KHUDEBARTA_CALLER_ID}&toUser=${formattedPhoneNumber}&messageContent=${message}`
  try {
    const { data } = await axios.get(url)
    if (data.TEXT === 'ACCEPTD') {
      console.log('Send message')
    }
  } catch (error) {
    console.log(error)
    throw new Error('Failed to send sms')
  }
}
export { sendMessage }
