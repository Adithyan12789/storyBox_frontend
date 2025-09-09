import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../store/dialogueSlice';
import { Box, Modal, Typography } from '@mui/material';
import Input from '../../extra/Input';
import { useEffect, useState } from 'react';
import Selector from '../../extra/Selector';
import Button from '../../extra/Button';
import {
  addVipPlan,
  getVipPlan,
  updateVipPlan,
} from '../../store/vipPlanSlice';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  backgroundColor: 'background.paper',
  borderRadius: '5px',
  border: '1px solid #C9C9C9',
  boxShadow: '24px',
  // padding: '19px',
};
const VipPlanDialogue = ({ page, size }) => {
  const dispatch = useDispatch();
  const [offerPrice, setOfferPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [productKey, setProductKey] = useState('');
  const [tags, setTags] = useState('');
  const [validityType, setValidityType] = useState('');
  const [validity, setValidity] = useState('');
  const [error, setError] = useState({});
  

  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const handleCloseAds = () => {
    dispatch(closeDialog());
  };
  useEffect(() => {
    if (dialogueData) {
      setOfferPrice(dialogueData?.offerPrice);
      setAmount(dialogueData?.price);
      setProductKey(dialogueData?.productKey);
      setTags(dialogueData?.tags);
      setValidityType(dialogueData?.validityType);
      setValidity(dialogueData?.validity);
    }
  }, [dialogueData]);
  const validate = () => {
    let error = {};
    let isValid = true;
    if (!offerPrice) {
      isValid = false;
      error['offerPrice'] = 'Please enter offer price';
    }
    if (!amount) {
      isValid = false;
      error['amount'] = 'Please enter amount';
    }
    if (offerPrice > amount) {
      isValid = false;
      error['offerPrice'] = 'Offer price should be less than amount';
    }
    if (!validity) {
      isValid = false;
      error['validity'] = 'Please enter validity';
    }
    if (!validityType) {
      isValid = false;
      error['validityType'] = 'Please select validity type';
    }
    if (!productKey) {
      isValid = false;
      error['productKey'] = 'Please enter product key';
    }
    if (!tags) {
      isValid = false;
      error['tags'] = 'Please enter tags';
    }
    setError(error);
    return isValid;
  };
  const handleSubmit = () => {
    
    if (validate()) {
      let data = {
        offerPrice: offerPrice,
        price: amount,
        validityType: validityType,
        validity: validity,
        productKey: productKey,
        tags: tags,
        vipPlanId: dialogueData?._id,
      };
      if (dialogueData) {
        dispatch(updateVipPlan(data)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            handleCloseAds();
            dispatch(getVipPlan({ page, size }));
          } else {
            toast.error(res?.payload?.message);
          }
        });
      } else {
        dispatch(addVipPlan(data)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            handleCloseAds();
            dispatch(getVipPlan({ page, size }));
          } else {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };
  return (
    <>
      <div>
        <Modal
          open={open}
          onClose={handleCloseAds}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="">
            

            <div className="model-header">
            <p className="m-0">
             {dialogueData ? 'Edit VIP Plan' : 'Add VIP Plan'}
            </p>
          </div>
              <div className="model-body">

            <form>
              <div
                className="row sound-add-box"
                style={{ overflowX: 'hidden' }}
              >
                <Input
                  type={'number'}
                  label={'Offer Price'}
                  onChange={(e) => {
                    setOfferPrice(e.target.value);
                    setError({ ...error, offerPrice: '' });
                  }}
                  name={'offerPrice'}
                  value={offerPrice}
                />
                {error?.offerPrice && (
                  <span
                    className="error mb-2"
                    style={{ fontSize: '15px', color: 'red' }}
                  >
                    {error?.offerPrice}
                  </span>
                )}

                <Input
                  type={'number'}
                  label={'Price'}
                  name={'price'}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError({ ...error, amount: '' });
                  }}
                  value={amount}
                />
                {error?.amount && (
                  <span
                    className="error mb-2"
                    style={{ fontSize: '15px', color: 'red' }}
                  >
                    {error?.amount}
                  </span>
                )}
                <Input
                  type={'number'}
                  label={'Validity'}
                  onChange={(e) => {
                    setValidity(e.target.value);
                    setError({ ...error, validity: '' });
                  }}
                  name={'validity'}
                  value={validity}
                />
                {error?.validity && (
                  <span
                    className="error mb-2"
                    style={{ fontSize: '15px', color: 'red' }}
                  >
                    {error?.validity}
                  </span>
                )}
                <Selector
                  label={'Validity Type'}
                  name={'validityType'}
                  className={'mb-2'}
                  selectValue={validityType}
                  placeholder={'Select Validity Type'}
                  selectData={['month', 'year']}
                  onChange={(e) => {
                    setValidityType(e.target.value);
                    setError({ ...error, validityType: '' });
                  }}
                />
                {error?.validityType && (
                  <span
                    className="error mb-2"
                    style={{ fontSize: '15px', color: 'red' }}
                  >
                    {error?.validityType}
                  </span>
                )}
                <Input
                  className={'mt-3'}
                  type={'text'}
                  label={'Tags'}
                  onChange={(e) => {
                    setTags(e.target.value);
                    setError({ ...error, tags: '' });
                  }}
                  name={'tags'}
                  value={tags}
                />
                {error?.tags && (
                  <span
                    className="error mb-2"
                    style={{ fontSize: '15px', color: 'red' }}
                  >
                    {error?.tags}
                  </span>
                )}

                <Input
                  type={'text'}
                  label={'Product Key'}
                  onChange={(e) => {
                    setProductKey(e.target.value);
                    setError({ ...error, productKey: '' });
                  }}
                  name={'productKey'}
                  value={productKey}
                />
                {error?.productKey && (
                  <span
                    className="error mb-2"
                    style={{ fontSize: '15px', color: 'red' }}
                  >
                    {error?.productKey}
                  </span>
                )}
                
              </div>
            </form>
              </div>
                <div className="model-footer">
                <div className="m-3 d-flex justify-content-end">
                  <Button
                    onClick={handleCloseAds}
                    btnName={'Close'}
                    newClass={'close-model-btn'}
                  />
                  <Button
                    onClick={handleSubmit}
                    btnName={'Submit'}
                    type={'button'}
                    newClass={'submit-btn'}
                    style={{
                      borderRadius: '0.5rem',
                      width: '80px',
                      marginLeft: '10px',
                    }}
                  />
                </div>
                </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};
export default VipPlanDialogue;
