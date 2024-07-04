import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { useTranslations } from 'next-intl'
import parse from 'html-react-parser'

function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ')
}

export default function TermModal({tabId, kvkkContentData}:{tabId:number, kvkkContentData:any}) {
  const t = useTranslations('auth')
  const [selectedIdx, setSelectedIdx] = useState<number>(tabId)

  let [categories] = useState({
    explicit_consent_text: [
      {
        id: 1,
        title: kvkkContentData?.data?.data?.[0]?.title,
        content:kvkkContentData?.data?.data?.[0]?.content
      }
    ],
    clarification_text: [
      {
        id: 3,
        title: kvkkContentData?.data?.data?.[2]?.title,
        content:parse(kvkkContentData?.data?.data?.[2]?.content)
      }
    ],
    membership_conditions_text: [
      {
        id: 4,
        title: kvkkContentData?.data?.data?.[3]?.title,
        content:parse(kvkkContentData?.data?.data?.[3]?.content)
      }     
    ],
  })


  const handleOnChange = (id:number) => {
    setSelectedIdx(id)
  }
  
  return (
    <div className='w-full max-w-md px-2 sm:px-0'>
      <Tab.Group selectedIndex={selectedIdx} onChange={handleOnChange}>
        <Tab.List className='flex space-x-1 rounded-xl bg-orange-400 p-1'>
          {Object.keys(categories).map(category => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white/60 ring-offset-2 ring-offset-orange-400 focus:outline-none focus:ring-2',
                  selected ? 'bg-white text-orange-400 shadow' : 'text-white hover:bg-orange hover:text-orange'
                )
              }>
              {t(category)}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='mt-2'>
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel key={idx} className={classNames('rounded-xl bg-white p-3')}>
              <ul className='max-h-80 overflow-auto scrollbar scrollbar-track-slate-300 scrollbar-thumb-slate-500'>
                {posts.map(post => (
                  <li key={post.id} className='relative rounded-md p-3 bg-gray-200'>
                    <h3 className='text-sm font-bold leading-5'>{post.title}</h3>

                    <ul className='mt-1 flex text-sm font-normal leading-5 text-gray-900'>
                      <li>{post.content}</li>
                    </ul>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
