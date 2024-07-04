import Checkbox from '@/components/checkbox'
import { TbTrash } from 'react-icons/tb'
import IncrementDecrement from '@/components/increment-decrement'
import { FieldValues, useForm, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { ProductType } from '@/lib/types'
import { useDispatch, useSelector } from 'react-redux'
import { changeProductQuantity, changeProductSellingPrice, deleteProduct } from '@/store/customersStore'
import Input from '@/components/input/input'
import { openModal } from '@/store/modalSlice'

const SalesItem = ({ product }: { product: ProductType }) => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(openModal({ id: 'createProduct', barcode: product.barcode }))
  }

  return (
    <tr className="relative after:pointer-events-none after:absolute after:left-0 after:top-1/2 after:h-[calc(100%-5px)] after:w-full after:-translate-y-1/2 after:rounded-lg after:border after:border-[#f1F1F1] after:content-['']">
      <td scope='col'>
        <div className='pl-5' onClick={() => dispatch(deleteProduct(product.barcode))}>
          <TbTrash className='shrink-0 cursor-pointer text-base text-[#FF3F3F]' />
        </div>
      </td>
      <td scope='col'>
        <button
          onClick={() => {
            handleClick()
          }}>
          {product.barcode}
        </button>
      </td>
      <td scope='col'>
        <div>{product.name}</div>
      </td>
      <td scope='col'>
        <div>
          <IncrementDecrement
            name={product.name}
            value={product.quantity}
            minValue={product.weightType === 'TERAZİ' ? 0.001 : 1}
            setValue={value => {
              dispatch(
                changeProductQuantity({
                  productBarcode: product.barcode,
                  quantity: value
                })
              )
            }}
            product={product}
          />
        </div>
      </td>

      <td scope='col'>
        <div>
          <Input
            name='price'
            value={product.sellingPrice}
            onChange={e => {
              dispatch(
                changeProductSellingPrice({
                  productBarcode: product.barcode,
                  sellingPrice: +e.target.value
                })
              )
            }}
            label='Fiyat'
            placeholder=''
            srOnly={true}
            size='x-small'
            type='number'
            className='max-w-[68px] rounded-md bg-[#F1F1F1] p-0 font-medium text-right'
          />
        </div>
      </td>
      <td scope='col'>
        <div>
          <Input
            name='totalPrice'
            disabled={true}
            value={(product.quantity * product.sellingPrice).toFixed(2)}
            label='Toplam Fiyat'
            placeholder=''
            srOnly={true}
            onChange={() => {}}
            size='x-small'
            type='number'
            className='max-w-[68px] rounded-md bg-[#F1F1F1] p-0 font-medium text-right'
          />
        </div>
      </td>
      {/* <td scope="col">
        <div className="rounded-r-xl border-r pl-10">
          <Checkbox name={product.name} label={product.name} />
        </div>
      </td> */}
    </tr>
  )
}

export default SalesItem
