import { Container } from '@mui/material'
import Link from 'next/link'
import { BiDonateBlood } from 'react-icons/bi'
import { FaHandHoldingHeart, FaUsers, FaHospital } from 'react-icons/fa'

const AboutPage = () => {
  const features = [
    {
      icon: <BiDonateBlood className="text-4xl text-red-500" />,
      title: 'Blood Donation Platform',
      description:
        'A dedicated platform connecting blood donors with those in need, making the donation process seamless and efficient.'
    },
    {
      icon: <FaHandHoldingHeart className="text-4xl text-red-500" />,
      title: 'Save Lives',
      description:
        'Every donation counts. Join our mission to save lives through voluntary blood donation and community support.'
    },
    {
      icon: <FaUsers className="text-4xl text-red-500" />,
      title: 'Community Network',
      description:
        'Build and be part of a strong community of donors, creating a reliable network for emergency situations.'
    },
    {
      icon: <FaHospital className="text-4xl text-red-500" />,
      title: 'Hospital Coordination',
      description:
        'Seamless coordination with hospitals and blood banks to ensure quick and efficient blood supply management.'
    }
  ]

  return (
    <div className="min-h-[calc(100vh-var(--header-height))] relative bg-gradient-to-b from-white to-gray-50">
      <Container maxWidth="lg" className="py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Blood Nexus</h1>
          <p className="text-xl text-gray-600 mb-8">
            Connecting donors with those in need
          </p>
        </div>

        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {features.map((feature, index) => (
            <div className="p-6 h-full border rounded-lg shadow" key={index}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-red-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            At Blood Nexus, we envision a Bangladesh where no life is lost due
            to blood shortage. Every 2 seconds, someone in our country needs
            blood, yet less than 1% of our population donates regularly.
            We&apos;re here to change that reality.
          </p>
          <p className="text-gray-700 mb-6">
            Our mission goes beyond just connecting donors with recipients.
            We&apos;re building a movement that transforms blood donation from
            an emergency response into a regular, sustainable practice. Through
            technology and community engagement, we&apos;re breaking down
            barriers and making blood donation accessible to all.
          </p>
          <p className="text-gray-700">
            We believe that every citizen has the power to be a hero. Whether
            you&apos;re a student, professional, or homemaker, your contribution
            can bridge the gap between life and death. Join us in our mission to
            create a self-sufficient blood donation network that serves every
            corner of Bangladesh, 24/7.
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Join Our Cause</h2>
          <div className="bg-white rounded-lg shadow p-8 max-w-3xl mx-auto">
            <p className="text-gray-700 text-lg mb-6">
              Every drop of blood can save a life. By joining Blood Nexus, you
              become part of a movement that&apos;s making a real difference in
              Bangladesh.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-red-500 font-bold text-2xl mb-2">
                  5000+
                </div>
                <div className="text-gray-600">Donors Registered</div>
              </div>
              <div className="text-center">
                <div className="text-red-500 font-bold text-2xl mb-2">
                  1000+
                </div>
                <div className="text-gray-600">Lives Saved</div>
              </div>
              <div className="text-center">
                <div className="text-red-500 font-bold text-2xl mb-2">24/7</div>
                <div className="text-gray-600">Emergency Support</div>
              </div>
            </div>
            <Link
              href="/auth/register"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300"
            >
              Become a Donor Today
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default AboutPage
