'use client'

import { Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { Donations } from './components/Donations'
import { Requests } from './components/Requests'

const AccountBloodDonationsPage = () => {
  const [value, setValue] = useState<'donations' | 'requests'>('requests')

  return (
    <div>
      <Tabs value={value} onChange={(_, newValue) => setValue(newValue)}>
        <Tab value="requests" label="Requests" />
        <Tab value="donations" label="Donations" />
      </Tabs>

      <div className="p-6 space-y-6">
        {value === 'donations' && <Donations />}
        {value === 'requests' && <Requests />}
      </div>
    </div>
  )
}

export default AccountBloodDonationsPage
