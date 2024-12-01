'use client'
import { useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { RadioButton } from './components/RadioButton'
import { MdBloodtype } from 'react-icons/md'
import { BiSolidDonateBlood } from 'react-icons/bi'

const Home = () => {
  const [selectedBlood, setSelectedBlood] = useState('B+')

  const handleBloodTypeChange = (value: string) => {
    setSelectedBlood(value)
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[150px] md:w-[300px] h-[150px] md:h-[300px] rounded-full bg-gradient-to-r from-red-500/30 to-transparent blur-3xl" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[150px] md:w-[300px] h-[150px] md:h-[300px] rounded-full bg-gradient-to-l from-red-500/30 to-transparent blur-3xl" />
      <div className="absolute top-32 md:top-48 left-8 md:left-20 text-red-500/10 rotate-12">
        <BiSolidDonateBlood className="text-[80px] md:text-[120px]" />
      </div>
      <div className="absolute top-28 md:top-40 right-8 md:right-32 text-red-500/10 -rotate-12">
        <MdBloodtype className="text-[60px] md:text-[100px]" />
      </div>

      <div className="container mx-auto px-4 pt-56 relative z-10">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
          <div className="w-full flex flex-col justify-center">
            <div className="text-neutral-500 text-center font-light text-sm mb-1">
              Select your Blood group
            </div>
            <div className="flex justify-center">
              <RadioButton
                options={[
                  { id: 'B+', label: 'B+' },
                  { id: 'A+', label: 'A+' },
                  { id: 'O+', label: 'O+' },
                  { id: 'AB+', label: 'AB+' },
                  { id: 'B-', label: 'B-' },
                  { id: 'A-', label: 'A-' },
                  { id: 'O-', label: 'O-' },
                  { id: 'AB-', label: 'AB-' }
                ]}
                value={selectedBlood}
                onChange={handleBloodTypeChange}
                color="red"
              />
            </div>
          </div>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Enter location"
              className="w-full p-4 pl-12 pr-16 rounded-full border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none"
            />
            <button
              className="absolute  flex items-center gap-1  px-4 right-2 top-1/2 -translate-y-1/2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200"
              aria-label="Search"
            >
              <IoSearchOutline className="text-2xl md:text-3xl" />{' '}
              <span className="hidden md:inline">Search Donors</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full"
        >
          <path
            fill="#EF4444"
            fillOpacity="0.15"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,138.7C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </path>
          <path
            fill="#EF4444"
            fillOpacity="0.1"
            d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,138.7C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="15s"
              repeatCount="indefinite"
              values="
                M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,138.7C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,138.7C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </path>
          <path
            fill="#EF4444"
            fillOpacity="0.05"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="20s"
              repeatCount="indefinite"
              values="
                M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,138.7C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </path>
        </svg>
      </div>
    </div>
  )
}

export default Home
