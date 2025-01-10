'use client'

import { Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Donations } from './components/Donations'
import { Requests } from './components/Requests'
import PendingRequests from './components/Pending'

const AccountBloodDonationsPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [value, setValue] = useState<'pending' | 'donations' | 'requests'>(
    (searchParams.get('tab') as 'pending' | 'donations' | 'requests') ||
      'pending'
  )

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: 'pending' | 'donations' | 'requests'
  ) => {
    setValue(newValue)
    const params = new URLSearchParams(searchParams)
    params.set('tab', newValue)
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <Tabs value={value} onChange={handleTabChange}>
        <Tab value="pending" label="Pending" />
        <Tab value="requests" label="Requested" />
        <Tab value="donations" label="Donated" />
      </Tabs>

      <div className="p-6 space-y-6">
        {value === 'pending' && <PendingRequests />}
        {value === 'donations' && <Donations />}
        {value === 'requests' && <Requests />}
      </div>
    </div>
  )
}

export default AccountBloodDonationsPage
