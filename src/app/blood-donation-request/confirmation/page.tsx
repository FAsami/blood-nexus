import { Paper, Button } from '@mui/material'
import { redirect } from 'next/navigation'
import { BiSolidDonateBlood } from 'react-icons/bi'
import Link from 'next/link'

const BloodDonationRequestConfirmation = ({
  searchParams
}: {
  searchParams: { id: string }
}) => {
  const id = searchParams.id
  if (!id) {
    return redirect('/')
  }
  return (
    <Paper className="max-w-2xl mx-auto mt-10 p-4">
      <div className="flex justify-center items-center">
        <BiSolidDonateBlood className="text-7xl text-primary mb-4 text-red-700 text-center" />
      </div>
      <h1 className="text-2xl font-bold text-red-700 text-center">
        Request Submitted
      </h1>
      <p className="text-lg text-gray-500 px-4 text-center my-12">
        <span className="text-green-900 font-bold mb-4 inline-block">
          Your request has been submitted successfully.
        </span>
        <br />
        <div>
          Your blood requirement request has been registered successfully. Our
          team will contact you shortly on your registered phone number to
          assist you with finding suitable donors. For any urgent updates,
          please contact our helpline.
        </div>
      </p>
      <div className="flex justify-center mt-6">
        <Link href="/account/blood-donations">
          <Button
            variant="contained"
            className="bg-red-700 hover:bg-red-800 text-white"
          >
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </Paper>
  )
}

export default BloodDonationRequestConfirmation
