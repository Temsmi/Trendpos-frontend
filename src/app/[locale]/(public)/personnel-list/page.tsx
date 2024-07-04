'use client'
import Button from '@/components/button'
import { UpdateTable } from '@/components/update-table'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createColumnHelper } from '@tanstack/react-table'
import fetchClient from '@/lib/fetch-client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

type Personnel = {
  userId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: number
  responsibility: string
  roles:[]
}

const columnHelper = createColumnHelper<Personnel>()

const PersonnelList = () => {
  const router = useRouter()
  const [personnelList, setPersonnelList] = useState<Personnel[]>([])

  const t = useTranslations('personnel-list')
  const columns = [
    columnHelper.accessor('firstName', {
      header: t('personnel_name')
    }),
    columnHelper.accessor('lastName', {
      header: t('personnel_surname')
    }),
    columnHelper.accessor('phoneNumber', {
      header: t('personnel_phone')
    }),
    columnHelper.accessor('email', {
      header: t('personnel_email')
    }),
    columnHelper.accessor('responsibility', {
      header: t('personnel_responsibility')
    }),
    columnHelper.accessor('roles', {
      header: t('roles')
    })
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personnelListResponse = await fetchClient(`/branch/personnel`)
        const personnelListData = await personnelListResponse.json()
        const personnelList: Personnel[] = personnelListData?.data || []
        setPersonnelList(personnelList)
      } catch (error) {
        console.error('Error fetching personnel list:', error)
      }
    }

    fetchData()
  }, [])

  const handleUpdateClick = (userId: string) => {
    router.push(`/settings/update-account/${userId}`)
  }
  const handleDelete = () =>{
    console.log("success")
  }

  return (
    <div className='container mx-auto mb-12 mt-12'>
      <div className='w-full max-w-[1531px] rounded-3xl bg-white'>
        <div className='flex gap-3 px-4 py-4'>
          <Link href='/settings/add-account'>
            <Button variant='outline' className='py-3'>
              {t('add_personnel')}
            </Button>
          </Link>
        </div>
        <hr className='block h-[1px] w-full bg-[#E5E5E5]' />
        <div className='h-[500px] overflow-auto px-4 py-4'>
          <UpdateTable data={personnelList} columns={columns} onUpdateClick={handleUpdateClick} onDelete={handleDelete}/>
        </div>
      </div>
    </div>
  )
}

export default PersonnelList
