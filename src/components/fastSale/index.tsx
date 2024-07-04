'use client'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal, openModal, setIsClickOutsideEnabled } from '@/store/modalSlice'
import useCustomToast from '@/hooks/use-toast'
import { AppDispatch, RootState } from '@/lib/store'
import Modal from '../popup/modal-form'
import Input from '../input/input'
import {addBarcode, addPage, changePageName, deleteBarcode, deletePage} from '@/store/fastSalesSlice'
import fetchClient from '@/lib/fetch-client'
import { FaRegCircleXmark } from 'react-icons/fa6'
import { PageData, ProductType } from '@/lib/types'
import { addProduct } from '@/store/customersStore'
import { useTranslations } from 'next-intl'

interface FastSalesProps {
  children?: React.ReactNode
}

interface BarcodesData {
  quickSaleHeaderId: number
  productName: string
  barcode: string
}

const FastSalesComponent = React.forwardRef<HTMLDivElement, FastSalesProps>((props, ref) => {
  FastSalesComponent.displayName = 'FastSalesComponent'
  const t = useTranslations('sales')
  const [name, setName] = useState('')
  const [barcode, setBarcode] = useState<string>()
  const [quickSaleHeaderId, setQuickSaleHeaderId] = useState(1)
  const [branchId, setBranchId] = useState(-1)
  const dispatch = useDispatch<AppDispatch>()
  const isPageModalOpen = useSelector((state: RootState) => state.modal.modals.some(modal => modal.id === 'pageName'))
  const isBarcodeModalOpen = useSelector((state: RootState) => state.modal.modals.some(modal => modal.id === 'barcode'))
  const isPageNameModalOpen = useSelector((state: RootState) => state.modal.modals.some(modal => modal.id === 'pageRename'))
  const isTeraziModalOpen = useSelector((state: RootState) =>state.modal.modals.some(modal => modal.id === 'fastTerazi'))
  const [pageData, setPageData] = useState<PageData[]>([])
  const [barcodesData, setBarcodesData] = useState<BarcodesData[]>([])
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null)
  const [weight, setWeight] = useState(0)
  const [productDetail, setProductDetail] = useState<ProductType | null>(null)
  const toast = useCustomToast()

  const nameInputRef = useRef<HTMLInputElement>(null)
  const barcodeInputRef = useRef<HTMLInputElement>(null)
  const weightInputRef = useRef<HTMLInputElement>(null)



  
  useEffect(() => {
    fetchPage();
  }, []);
  
  useEffect(() => {
    if (pageData.length > 0) {
      const firstPageId = pageData[0].id;
      setSelectedPageId(firstPageId);
    }
  }, [pageData]);
  useEffect(() => {
    if (selectedPageId !== null) {
      fetchPageBarcodes(selectedPageId);
    }
  }, [selectedPageId]);

  const fetchPage = async () => {
    try {
      const response = await fetchClient(`/quicksale/header?`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch page');
      }
      const result = await response.json();
      if (result.success) {
        setPageData(result.data);
        if (result.data.length > 0) {
          setQuickSaleHeaderId(result.data[0].id); 
          setName(result.data[0].name);
          setSelectedPageId(result.data[0].id); 
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
    }
  };

  const fetchPageBarcodes = async (quickSaleHeaderId: number) => {
    setQuickSaleHeaderId(quickSaleHeaderId)
    try {
      const response = await fetchClient(`/quicksale/product/${quickSaleHeaderId}`, {
        method: 'GET'
      })
      if (!response.ok) {
        throw new Error('Failed to fetch product data')
      }
      const result = await response.json()

      if (result.success) {
        setBarcodesData(result.data) // Set the state with the fetched data
        setName(name)
      } else {
        throw new Error(result.message) // Handle failure
      }
    } catch (error) {
      console.error('Error fetching product data:', error)
    }
  }

  const handleAddPage = useCallback(() => {
    const pageDetails = {
      name,
      barcode: barcode ?? '', // Provide a fallback value like 0 if barcode is undefined
      branchId
    };
    dispatch(addPage(pageDetails))
      .unwrap()
      .then(result => {
        toast({
          type: 'success',
          message: result.message // Display success message
        });
        return fetchPage();
      })
      .catch(error => {
        if (error.message === 'Kayıt bulunamadı.') {
          dispatch(openModal({ id: 'createProduct', barcode }));
        } else {
          toast({
            type: 'error',
            message: error.message || 'An unknown error occurred'
          });
        }
      });
    setBarcode(undefined);
    setName(''); // Set the name to an empty string
    dispatch(closeModal('pageName'));
  }, [dispatch, name, barcode, branchId]);
  

  const handleDeletePage = useCallback(
    (quickSaleHeaderId: number) => {
      // Ensures barcode is defined or fallbacks to a default value (e.g., 0)
      const safeBarcode = barcode ?? ''

      dispatch(deletePage({ quickSaleHeaderId, barcode: safeBarcode}))
        .unwrap()
        .then(result => {
          toast({
            type: 'success',
            message: result.message // Display success message
          })
          return  fetchPage();
        })

        .catch(error => {
          console.error('Failed to delete the page or fetch data:', error)
        })
    },
    [dispatch, quickSaleHeaderId, barcode]
  )
  const handleChangeHeaderName = useCallback(() => {
    dispatch(changePageName({ id: quickSaleHeaderId, name }))
      .unwrap()
      .then(result => {
        toast({
          type: 'success',
          message: result.message // Display success message
        })
        return  fetchPage();
      })

      .then(() => {
        fetchPageBarcodes(quickSaleHeaderId);
      })
    dispatch(closeModal('pageRename'))
  }, [dispatch, selectedPageId, name, branchId])

  const handleAddBarcode = useCallback(() => {
    const safeBarcode = barcode ?? ''
    dispatch(
      addBarcode({ quickSaleHeaderId, barcode: safeBarcode, quickSaleHeaderName: name })
    )
      .unwrap()
      .then(result => {
        toast({
          type: 'success',
          message: result.message // Display success message
        })
        return fetchPage();
      })
      .then(() => {
        fetchPageBarcodes(quickSaleHeaderId);
      })
      .catch(error => {
        console.error('Error when trying to add a barcode:', error)
        toast({
          type: 'error',
          message: error.message || 'An unknown error occurred' // Display error message
        })
      })
    dispatch(closeModal('barcode'))
    setBarcode(undefined)
  }, [dispatch, barcode, branchId, name, quickSaleHeaderId])

  const handleDeleteBarcode = useCallback(
    (barcode: string) => {
      dispatch(deleteBarcode({ barcode, quickSaleHeaderId }))
        .unwrap()
        .then(result => {
          toast({
            type: 'success',
            message: result.message // Display success message
          })
          return fetchPage();
        })
        .then(() => {
          fetchPageBarcodes(quickSaleHeaderId);
        })
    },
    [dispatch, branchId, quickSaleHeaderId]
  );

  const onSubmit = async (barcode: string) => {
    try {
      const response = await fetchClient(`/branch-catalog/${barcode}`)
      const product = await response.json()
      if (product.data) {
        setProductDetail(product.data) // Store the product details in state
        if (product.data.weightType === 'TERAZİ') {
          dispatch(openModal({ id: 'fastTerazi' }))
        } else {
          dispatch(addProduct({ ...product.data, quantity: 1 })) // Add directly if not a TERAZI type
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    }
  }

  const handleCloseModal = () => {
       dispatch(closeModal('fastTerazi'))
  }

  const handleSave = () => {
    if (productDetail && weight > 0) {
      const quantity = weight / 1000 // Convert grams to kilograms if needed
      dispatch(
        addProduct({
          ...productDetail,
          quantity
        })
      )
      setWeight(0) // Reset the weight after adding the product
        dispatch(closeModal('fastTerazi'))
    }
  }
  // modal passive trigger
  useEffect(() => {
    if (isPageModalOpen || isBarcodeModalOpen || isPageNameModalOpen || isTeraziModalOpen) {
      dispatch(setIsClickOutsideEnabled(false))
    }

    return () => {
      dispatch(setIsClickOutsideEnabled(true))
    }
  }, [isPageModalOpen, isBarcodeModalOpen, isPageNameModalOpen, isTeraziModalOpen])

  useEffect(() => {
    if (isPageModalOpen && nameInputRef.current) {
      nameInputRef.current.focus()
    } else if (isBarcodeModalOpen && barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    } else if (isTeraziModalOpen && weightInputRef.current) {
      weightInputRef.current.focus()
    }
  }, [isPageModalOpen, isBarcodeModalOpen, isTeraziModalOpen])

  return (
    <div ref={ref}>
      <div className='flex flex-wrap items-center mt-4 gap-2'>
      {(pageData || []).map(data => (
    <div
      key={data.id}
      className={`relative flex h-auto py-2 px-4 items-center rounded focus-within:bg-gradient-to-b from-orange-500 to-amber-500 focus-within:text-white ${
        quickSaleHeaderId === data.id ? 'bg-gradient-to-b from-orange-500 to-amber-500 text-white' : 'bg-gray-200 text-black'
      }`}
    >
      <button
        onClick={() => handleDeletePage(data.id)}
        className='absolute right-0 top-0 z-20 mr-[-10px] mt-[-10px] p-2 text-lg  focus-within:text-white hover:text-red-500'>
        <FaRegCircleXmark />
      </button>
      <button
        className=' z-10 h-full w-full text-center  '
        id={`button-${data.quickSaleHeaderId}`}
        onClick={() => fetchPageBarcodes(data.id)}
        onDoubleClick={() => dispatch(openModal({ id: 'pageRename' }))}>
        {data.name}
      </button>
    </div>
  ))}
        {isPageNameModalOpen && (
          <Modal
            id='pageRename'
            name={t('change_page_name')}
            onClose={() => dispatch(closeModal('pageRename'))}
            onSave={() => handleChangeHeaderName()}
            firstButtonName={t('cancel')}
            secondButtonName={t('save')}>
            <Input
              name='pageName'
              label={t('enter_page_name')}
              value={name}
              onChange={e => setName(e.target.value)}
              srOnly={false}
              className='py-1'
              ref={nameInputRef}
            />
          </Modal>
        )}
        <button
          onClick={() => dispatch(openModal({ id: 'pageName' }))}
          className='focus:shadow-outline  whitespace-nowrap rounded  border-bleck font-mideum text-black focus:outline-none'>
          + {t('add_page')}
        </button>
      </div>
      <div>
        {isPageModalOpen && (
          <Modal
            id='pageName'
            name={t('add_page')}
            onClose={() => dispatch(closeModal('pageName'))}
            onSave={handleAddPage}
            firstButtonName={t('cancel')}
            secondButtonName={t('save')}>
            <Input
              name='name'
              label={t('enter_page_name')}
              value={name}
              onChange={e => setName(e.target.value)}
              className='py-1'
              srOnly={false}
              ref={nameInputRef}
            />
            <Input
              name='productBarcode'
              label={t('enter_product_barcode')}
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              srOnly={false}
              className='py-1'
              ref={barcodeInputRef}
            />
          </Modal>
        )}
      </div>
      <div
        className='mt-2 flex flex-row flex-wrap gap-2 items-center overflow-y-auto'
        style={{ maxHeight: '15vh', maxWidth: '120vh' }}>
        {barcodesData&&
          barcodesData.map((item, index) => (
            <div
              key={index}
              className='relative h-32 w-32 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none'>
              <button
                onClick={() => handleDeleteBarcode(item.barcode)}
                className='absolute right-0 top-0 z-20 mr-[-10px] mt-[-10px] p-2 text-xl text-white hover:text-red-500'>
                <FaRegCircleXmark />
              </button>
              <button
                onClick={() => onSubmit(item.barcode)} // This triggers checking the product type
                className='absolute inset-0 z-10'>
                {item.productName}
              </button>
            </div>
          ))}
      </div>

      {isTeraziModalOpen && (
        <Modal
          id='fastTerazi'
          name={t('product_weight')}
          onClose={handleCloseModal}
          onSave={handleSave}
          firstButtonName={t('cancel')}
          secondButtonName={t('save')}>
          <Input
            className='mb-4 w-80'
            type='number'
            name='gram'
            value={weight.toString()}
            onChange={e => setWeight(Number(e.target.value))}
            label={t('enter_weight_in_grams')}
            srOnly={false}
            ref={weightInputRef}
          />
        </Modal>
      )}
      {pageData.length > 0 && (
        <button
          onClick={() => dispatch(openModal({ id: 'barcode' }))}
          className='focus:shadow-outline whitespace-nowrap rounded px-4 py-2 font-bold text-black focus:outline-none'>
          + {t('add_product')}
        </button>
      )}
      {isBarcodeModalOpen && (
        <Modal
          id='barcode'
          name={t('add_product')}
          onClose={() => dispatch(closeModal('barcode'))}
          onSave={handleAddBarcode}
          firstButtonName={t('cancel')}
          secondButtonName={t('save')}>
          <Input
            name='productBarcode'
            label={t('enter_product_barcode')}
            value={barcode}
            onChange={e => setBarcode(e.target.value)}
            srOnly={false}
            className='py-1'
            ref={barcodeInputRef}
          />
        </Modal>
      )}
    </div>
  )
})

export default FastSalesComponent
