import { Box, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../extra/Input';
import { useEffect, useState } from 'react';
import { closeDialog } from '../../store/dialogueSlice';
import Button from '../../extra/Button';
import {
  addCoinPlan,
  getCoinPlan,
  updateCoinPlan,
} from '../../store/coinPlanSlice';
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
const CoinPlanDialogue = ({ page, size }) => {
  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const [coin, setCoin] = useState('');
  const [bonusCoin, setBonusCoin] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [error, setError] = useState({});
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();
  const [productKey, setProductKey] = useState('');
  const handleCloseAds = () => {
    dispatch(closeDialog());
  };
  
  const validate = () => {
    let error = {};
    let isValid = true;
    if (!offerPrice) {
      isValid = false;
      error.offerPrice = 'Offer Price Is Required !';
    }
    if (!bonusCoin) {
      isValid = false;
      error.bonusCoin = 'Bonus Coin Is Required !';
    }
    if (!amount) {
      isValid = false;
      error.amount = 'Amount Is Required !';
    }
    if (!productKey) {
      isValid = false;
      error.productKey = 'Product Key Is Required !';
    }
    if (!coin) {
      isValid = false;
      error.coin = 'Coin Is Required !';
    }
    if (+offerPrice > +amount) {
      isValid = false;
      error['offerPrice'] = 'Offer price should be less than amount';
    }
    setError(error);
    return isValid;
  };

  useEffect(() => {
    if (dialogueData) {
      setCoin(dialogueData?.coin);
      setBonusCoin(dialogueData?.bonusCoin);
      setOfferPrice(dialogueData?.offerPrice);
      setAmount(dialogueData?.price);
      setProductKey(dialogueData?.productKey);
    }
  }, [dialogueData]);

  const handleSubmit = () => {
    
    if (validate()) {
      let data = {
        offerPrice: +offerPrice,
        bonusCoin: +bonusCoin,
        price: +amount,
        productKey: productKey,
        coin: coin,
        coinPlanId: dialogueData?._id,
      };
      if (dialogueData) {
        dispatch(updateCoinPlan(data)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            handleCloseAds();
            dispatch(getCoinPlan({ page, size }));
          } else {
            toast.error(res?.payload?.message);
          }
        });
      } else {
        dispatch(addCoinPlan(data)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            handleCloseAds();
            dispatch(getCoinPlan({ page, size }));
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
              {dialogueData ? 'Edit Coin Plan' : 'Add Coin Plan'}
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
                  label={'Bonus Coin'}
                  onChange={(e) => {
                    setBonusCoin(e.target.value);
                    setError({ ...error, bonusCoin: '' });
                  }}
                  name={'bonusCoin'}
                  value={bonusCoin}
                />
                {error?.bonusCoin && (
                  <span
                    className="error mb-2"
                    style={{ fontSize: '15px', color: 'red' }}
                  >
                    {error?.bonusCoin}
                  </span>
                )}
                <Input
                  type={'number'}
                  label={'Coin'}
                  onChange={(e) => {
                    setCoin(e.target.value);
                    setError({ ...error, coin: '' });
                  }}
                  name={'coin'}
                  value={coin}
                />
                {error?.coin && (
                  <span
                    className="error mb-2"
                    style={{ fontSize: '15px', color: 'red' }}
                  >
                    {error?.coin}
                  </span>
                )}
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
                  type={'text'}
                  label={'Product Key'}
                  onChange={(e) => {
                    setProductKey(e.target.value);
                    setError({ ...error, setProductKey: '' });
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

          <div className='model-footer'>
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
export default CoinPlanDialogue;
