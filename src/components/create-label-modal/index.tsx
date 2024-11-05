import React, { useEffect, useState } from 'react';
import Button from '@/components/button/index';
import Textarea from '@/components/textarea';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '../popup/modal-form';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import useCustomToast from '@/hooks/use-toast';
// import { useTranslations } from 'next-intl';
import { RootState } from '@/lib/store';
import { closeModal, setIsClickOutsideEnabled } from '@/store/modalSlice';
import { useSession } from 'next-auth/react';
import fetchClient from '@/lib/fetch-client';

interface CreateItemLabel {
  id: string;
}

const CreateLabelModal: React.FC = () => {
  const { handleSubmit, control, reset } = useForm<CreateItemLabel>();
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();
  // const t = useTranslations('item-id');

  const isModalOpen = useSelector((state: RootState) =>
    state.modal.modals.some(modal => modal.id === 'itemLabel' && modal.isOpen)
  );
  const dispatch = useDispatch();
  const { data: session } = useSession();

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
  }, [isModalOpen]);

  const onSubmit: SubmitHandler<CreateItemLabel> = async data => {
    setLoading(true);

    if (!session) {
      toast({
        type: 'error',
        message: 'You are not authenticated',
      });
      setLoading(false);
      return;
    }

    const sessionToken = session.token; // Assuming your session object contains the access token

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL +`/publishing/print?barcodes=${data.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
     
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `barcode_${data.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

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
          name='Item Label'
          onClose={handleCloseModal}
          onSave={handleSubmit(onSubmit)}
        >
          <div className='space-between flex gap-2 p-1'>
            <div className='space-between flex-1 px-1 mt-3 text-left'>
              <p>Enter Barcode:</p>
            </div>
          </div>
          <div className='space-between flex gap-2 p-1'>
            <div className='space-between flex-1'>
              <Controller
                name='id'
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Textarea
                    placeholder="Enter barcode"
                    name={name}
                    value={value}
                    onChange={e => onChange(e.target.value === '' ? '' : e.target.value)}
                  />
                )}
              />
            </div>
          </div>
          <div className='flex justify-end mt-4'>
            <Button type='button' onClick={handleSubmit(onSubmit)}>
              Submit
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateLabelModal;
