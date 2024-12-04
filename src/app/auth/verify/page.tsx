import { decrypt } from '@/utils/crypto'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BiSolidHome, BiSolidInfoCircle } from 'react-icons/bi'
import VerifyOTPForm from './VerifyOTPForm'
import { TokenType } from '@/schema/auth'
import * as z from 'zod'
const VerifyPage = async ({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined }
}) => {
  if (!searchParams.token) {
    redirect('/login')
  }

  const token = decodeURIComponent(searchParams.token)

  let decoded
  try {
    decoded = (await decrypt(token)) as {
      phone: string
      email: string
      name: string
      scope: z.infer<typeof TokenType>
    }
  } catch (error) {
    console.log(error)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-white rounded-lg  p-8">
          <div className="flex flex-col items-center gap-3">
            <BiSolidInfoCircle
              className="text-red-500"
              style={{ fontSize: '48px' }}
            />
            <p className="text-gray-600 text-center">
              Something went wrong. Please make sure you have access to this
              page.
            </p>
            <Link
              className="text-blue-600 flex items-center gap-1 hover:underline"
              href="/"
            >
              <BiSolidHome /> Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!decoded || (!decoded.email && !decoded.phone)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-white rounded-lg  p-8">
          <div className="flex flex-col items-center gap-3">
            <BiSolidInfoCircle
              className="text-red-500"
              style={{ fontSize: '48px' }}
            />
            <p className="text-gray-600 text-center">
              Something went wrong. Please make sure you have access to this
              page.
            </p>
            <Link
              className="text-blue-600 flex items-center gap-1 hover:underline"
              href="/"
            >
              <BiSolidHome /> Home
            </Link>
          </div>
        </div>
      </div>
    )
  }
  return (
    <VerifyOTPForm
      name={decoded.name || ''}
      phone={decoded.phone || ''}
      email={decoded.email || ''}
      scope={decoded.scope}
    />
  )
}

export default VerifyPage
