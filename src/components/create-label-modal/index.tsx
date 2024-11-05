import React, { useEffect, useState } from 'react';
import Button from '@/components/button/index';
import Textarea from '@/components/textarea';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '../popup/modal-form';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import useCustomToast from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { RootState } from '@/lib/store';
import { closeModal, setIsClickOutsideEnabled } from '@/store/modalSlice';
import fetchClientForm from '@/lib/fetch-client';

interface CreateItemLabel {
  id: string;
}

const CreateLabelModal: React.FC = () => {
  const { handleSubmit, control, reset } = useForm<CreateItemLabel>();
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();
  const t = useTranslations('sales');

  const isModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'itemLabel' && modal.isOpen)
  );
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(closeModal('itemLabel'));
    reset();
  };

  useEffect(() => {
    if (isModalOpen) {
      dispatch(setIsClickOutsideEnabled(false));
    }

    return () => {
      dispatch(setIsClickOutsideEnabled(true));
    };
  }, [isModalOpen, dispatch]);

  const onSubmit: SubmitHandler<CreateItemLabel> = async data => {
    setLoading(true);
    try {
      // data id should be row by row
      const barcodeList = data.id.split('\n');
      // Check empty items and remove them
      const filteredBarcodeList = barcodeList.filter(barcode => barcode.trim() !== '');
      const barcodes = filteredBarcodeList.join(',');
      const url = `/publishing/print?barcodes=${barcodes}`;
      const response = await fetchClientForm(url, {
        method: 'GET',
      });
        if (!response.ok){
          throw new Error('Network response was not ok'); 
        }
       const blob = await response.blob();
      const pdf = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pdf;
      link.download = `ItemLabel_${data.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        type: 'success',
        message: 'PDF generated successfully',
      });
    } catch (error: any) {
      toast({
        type: 'error',
        message: error.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          id='itemLabel'
          name={t('print_label')}
          onClose={handleCloseModal}
          onSave={handleSubmit(onSubmit)}
          firstButtonName={t('cancel')}
          secondButtonName={t('confirm')}
        >
          <div className='space-between flex gap-2 p-1'>
            <div className='space-between flex-1 px-1 mt-3 text-left'>
              <p>{t('enter_barcode')}</p>
            </div>
          </div>
          <div className='space-between flex gap-2 p-1'>
            <div className='space-between flex-1'>
              <Controller
                name='id'
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Textarea
                    placeholder={t('enter_barcode')}
                    name={name}
                    value={value}
                    onChange={e => onChange(e.target.value === '' ? '' : e.target.value)}
                  />
                )}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateLabelModal;
