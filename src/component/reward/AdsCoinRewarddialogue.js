import { Box, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  addAdsRewardCoin,
  editAddsRewardCoin,
  getAdsRewardCoin,
} from '../../store/rewardSlice';
import { closeDialog } from '../../store/dialogueSlice';
import Button from '../../extra/Button';
import Input from '../../extra/Input';
import { useEffect, useState } from 'react';
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
const AdsCoinRewarddialogue = () => {
  const dispatch = useDispatch();
  const { dialogueData } = useSelector((state) => state.dialogue);
  
  const handleCloseAds = () => {
    dispatch(closeDialog());
  };
  useEffect(() => {
    setValues(dialogueData);
  }, [dialogueData]);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const validation = () => {
    let error = {};
    let isValid = true;
    if (!values?.adLabel) {
      isValid = false;
      error['adLabel'] = 'Please enter label';
    }
    if (!values?.adDisplayInterval) {
      isValid = false;
      error['adDisplayInterval'] = 'Please enter display interval';
    }
    if (!values?.coinEarnedFromAd) {
      isValid = false;
      error['coinEarnedFromAd'] = 'Please enter coin';
    }
    setErrors(error);
    return isValid;
  };
  const handleSubmit = () => {
    
    if (validation()) {
      if (dialogueData) {
        dispatch(editAddsRewardCoin(values)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            dispatch(closeDialog());
            dispatch(getAdsRewardCoin());
          } else {
            toast.error(res?.payload?.message);
          }
        });
      } else {
        dispatch(addAdsRewardCoin(values)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            dispatch(closeDialog());
            dispatch(getAdsRewardCoin());
          } else {
            toast.error(res?.payload?.message);
          }
        });
      }
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };
  const { dialogue: open } = useSelector((state) => state.dialogue);
  return (
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
               {dialogueData ? 'Edit Ads Coin Reward' : 'Add Ads Coin Reward'}
            </p>
          </div>
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Ads Coin Reward
            {dialogueData ? 'Edit Ads Coin Reward' : 'Add Ads Coin Reward'}
          </Typography> */}
          <div className="model-body">
          <form>
            <div className="row sound-add-box" style={{ overflowX: 'hidden' }}>
              <Input
                type={'text'}
                label={'Label'}
                onChange={handleInputChange}
                name={'adLabel'}
                value={values?.adLabel}
              />
              {errors?.adLabel && (
                <span
                  className="error mb-2"
                  style={{ fontSize: '15px', color: 'red' }}
                >
                  {errors?.adLabel}
                </span>
              )}
              <Input
                type={'number'}
                label={'Display Interval'}
                name={'adDisplayInterval'}
                onChange={handleInputChange}
                value={values?.adDisplayInterval}
              />
              {errors?.adDisplayInterval && (
                <span
                  className="error mb-2"
                  style={{ fontSize: '15px', color: 'red' }}
                >
                  {errors?.adDisplayInterval}
                </span>
              )}
              <Input
                type={'number'}
                label={'Coin Earned'}
                name={'coinEarnedFromAd'}
                onChange={handleInputChange}
                value={values?.coinEarnedFromAd}
              />
              {errors?.coinEarnedFromAd && (
                <span
                  className="error mb-2"
                  style={{ fontSize: '15px', color: 'red' }}
                >
                  {errors?.coinEarnedFromAd}
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
  );
};
export default AdsCoinRewarddialogue;
