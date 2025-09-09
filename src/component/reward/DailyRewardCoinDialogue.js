import { Box, Modal, Typography } from '@mui/material';
import { closeDialog } from '../../store/dialogueSlice';
import Input from '../../extra/Input';
import Button from '../../extra/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  addDailyRewardCoin,
  editDailyRewardCoin,
  getDailyRewardCoin,
} from '../../store/rewardSlice';
import { toast } from 'react-toastify';
import Selector from '../../extra/Selector';
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
const DailyRewardCoinDialogue = () => {
  const { dialogue: open } = useSelector((state) => state.dialogue);
  
  const handleCloseAds = () => {
    dispatch(closeDialog());
  };
  const [day, setDay] = useState();
  const [dailyRewardCoin, setDailyRewardCoin] = useState();
  const { dialogueData } = useSelector((state) => state.dialogue);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  useEffect(() => {
    setDay(dialogueData?.day);
    setDailyRewardCoin(dialogueData?.dailyRewardCoin);
  }, [dialogueData]);
  const validation = () => {
    let error = {};
    let isValid = true;
    if (!day) {
      isValid = false;
      error['day'] = 'Please enter day';
    }
    if (!dailyRewardCoin) {
      isValid = false;
      error['dailyRewardCoin'] = 'Please enter daily reward coin';
    }

    setErrors(error);
    return isValid;
  };
  const handleSubmit = () => {
    
    if (validation()) {
      if (dialogueData) {
        const data = {
          dailyRewardCoin: dailyRewardCoin,
          dailyRewardCoinId: dialogueData?._id,
        };
        dispatch(editDailyRewardCoin(data)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            dispatch(closeDialog());
            dispatch(getDailyRewardCoin());
          } else {
            toast.error(res?.payload?.message);
          }
        });
      } else {
        const data = {
          day: day,
          dailyRewardCoin: dailyRewardCoin,
        };
        dispatch(addDailyRewardCoin(data)).then((res) => {
          if (res?.payload?.status) {
            toast.success(res?.payload?.message);
            dispatch(getDailyRewardCoin());
          } else {
            toast.error(res?.payload?.message);
          }
          dispatch(closeDialog());
        });
      }
    }
  };
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
             {dialogueData ? 'Edit Daily Coin Reward' : 'Add Daily Coin Reward'}
            </p>
          </div>
          <div className="model-body">
          <form>
            <div className="row sound-add-box" style={{ overflowX: 'hidden' }}>
              <Selector
                label={'Day'}
                name={'day'}
                placeholder={'Select Day...'}
                className={'mb-2'}
                selectValue={day}
                type={'number'}
                selectData={['1', '2', '3', '4', '5', '6', '7']}
                disabled={dialogueData ? true : false}
                onChange={(e) => {
                  setDay(parseInt(e.target.value));
                  setErrors({ ...errors, day: '' });
                }}
              />

              {errors?.day && (
                <span
                  className="error mb-2"
                  style={{ fontSize: '15px', color: 'red' }}
                >
                  {errors?.day}
                </span>
              )}
              <div className="mt-3">
                <Input
                  type={'number'}
                  label={'Daily Reward Coin'}
                  name={'dailyRewardCoin'}
                  onChange={(e) => {
                    setDailyRewardCoin(parseInt(e.target.value, 10));
                    setErrors({ ...errors, dailyRewardCoin: '' });
                  }}
                  value={dailyRewardCoin}
                />
                {errors?.dailyRewardCoin && (
                  <span
                    className="error mb-2"
                    style={{ fontSize: '15px', color: 'red' }}
                  >
                    {errors?.dailyRewardCoin}
                  </span>
                )}
              </div>

              
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
export default DailyRewardCoinDialogue;
