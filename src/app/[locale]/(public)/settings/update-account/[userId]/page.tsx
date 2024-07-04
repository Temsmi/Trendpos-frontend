'use client'
import React, { useEffect, useState } from 'react'
import fetchClient from '@/lib/fetch-client'
import AccountForm from '@/components/company/account-form'

const SettingsUpdateAccount = ({ params }: { params: { userId: string } }) => {
  const [personnelInfoData, setPersonnelInfoData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personnelInfoResponse = await fetchClient(
          `/branch/personnel/${params.userId}`
        )
        const personnelInfoData = await personnelInfoResponse.json()

        setPersonnelInfoData(personnelInfoData.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <AccountForm type='update' initialData={personnelInfoData} />
    </>
  )
}

export default SettingsUpdateAccount
