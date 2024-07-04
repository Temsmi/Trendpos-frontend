import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '../popup/modal-form';
import Button from '@/components/button/index';
import Input from '@/components/input/input';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import useCustomToast from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { AppDispatch, RootState } from '@/lib/store';
import { closeModal } from '@/store/modalSlice';
import { checkoutCart } from '@/store/customersStore'
import { resetProductName } from '@/store/productDetail';

interface PartialPaymentFormData {
  cash: number;
  card: number;
  onCredit?: number;
}
interface PaymentInfo {
  paymentMethodId: number;
  cashAmount?: number;
  cardAmount?: number;
  creditAmount?: number;
}

const PartialPaymentModal: React.FC = () => {
  const { handleSubmit, control } = useForm<PartialPaymentFormData>();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('partial');
  const toast = useCustomToast();
  const t = useTranslations('partial-payment');

  const isModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'partialPayment' && modal.isOpen)
  );
  const dispatch = useDispatch<AppDispatch>()

  const handleCloseModal = () => {
    dispatch(closeModal('partialPayment'));
  };

  const onSubmit: SubmitHandler<PartialPaymentFormData> = async data => {
    const { cash, card, onCredit } = data;
    const paymentInfo: PaymentInfo = {
      paymentMethodId: 4,
      cashAmount: Number(cash) || 0,
      cardAmount: Number(card)|| 0,
      creditAmount: Number(onCredit) || 0,
    };

    console.log(paymentInfo);
    dispatch(checkoutCart(paymentInfo));
    dispatch(closeModal('partialPayment'));
    dispatch(resetProductName()); // This will reset the product name to an empty string
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          id='partialPayment'
          name={t('partial_payment')}
          onClose={handleCloseModal}
          onSave={handleSubmit(onSubmit)}
          firstButtonName={t('cancel')}
          secondButtonName={t('confirm')}>
          <div className='flex col-span-2 gap-3.5 w-80 justify-center'>
            <Button
              variant={activeTab === 'partial' ? 'outlineOrange' : 'outlineOpacity'}
              size='small'
              className={activeTab === 'partial' ? 'active' : ''}
              onClick={() => setActiveTab('partial')}>
              {t('cash_card')}
            </Button>
            <Button
              variant={activeTab === 'full' ? 'outlineOrange' : 'outlineOpacity'}
              className={activeTab === 'full' ? 'active' : ''}
              onClick={() => setActiveTab('full')}>
              {t('current')}
            </Button>
          </div>
          {activeTab === 'partial' && (
            <>
            <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1 px-1 mt-3 text-left'>
                  <p>{t('cash')}</p>
                </div>
              </div>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1'>
                  <Controller
                    name='cash'
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label={t('cash')}
                        placeholder={t('cash')}
                        name={name}
                        type='number'
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1 px-1 mt-3 text-left'>
                  <p>{t('card')}</p>
                </div>
              </div>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1'>
                  <Controller
                    name='card'
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label={t('card')}
                        placeholder={t('card')}
                        name={name}
                        type='number'
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {activeTab === 'full' && (
            <>
            <div className='space-between flex gap-2 p-1'>
            <div className='space-between flex-1 px-1 mt-3 text-left'>
              <p>{t('cash')}</p>
            </div>
          </div>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1'>
                  <Controller
                    name='cash'
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label={t('cash')}
                        placeholder={t('cash')}
                        name={name}
                        type='number'
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1 px-1 mt-3 text-left'>
                  <p>{t('card')}</p>
                </div>
              </div>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1'>
                  <Controller
                    name='card'
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label={t('card')}
                        placeholder={t('card')}
                        name={name}
                        type='number'
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1 px-1 mt-3 text-left'>
                  <p>{t('on_credit')}</p>
                </div>
              </div>
              <div className='space-between flex gap-2 p-1'>
                <div className='space-between flex-1'>
                  <Controller
                    name='onCredit'
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label={t('on_credit')}
                        placeholder={t('on_credit')}
                        name={name}
                        type='text'
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default PartialPaymentModal;
