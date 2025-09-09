import { Box, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../store/dialogueSlice';
import Input from '../../extra/Input';
import { useEffect, useState } from 'react';
import Button from '../../extra/Button';
import Selector from '../../extra/Selector';
import { editUser, getAllUsers } from '../../store/userSlice';
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

const UserDialogue = ({ startDate, endDate, page, size }) => {
  const dispatch = useDispatch();

  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const [values, setValues] = useState({});
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState({});
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };
  useEffect(() => {
    setValues(dialogueData);
    setGender(dialogueData?.gender);
  }, [dialogueData]);
  const handleCloseAds = () => {
    dispatch(closeDialog());
  };
  const validation = () => {
    let error = {};
    let isValid = true;
    // if (!values?.username) {
    //     isValid = false;
    //     error["username"] = "Please enter username";
    // }
    if (!values?.name) {
      isValid = false;
      error['name'] = 'Please enter name';
    }
    // if (!values?.age) {
    //     isValid = false;
    //     error["age"] = "Please enter age";
    // }
    // if (!values?.bio) {
    //     isValid = false;
    //     error["bio"] = "Please enter bio";
    // }
    // if (!gender || gender === "") {
    //     isValid = false;
    //     error["gender"] = "Please Select gender";
    // }
    setErrors(error);
    return isValid;
  };
  const handleSubmit = () => {
    

    if (validation()) {
      const data = {
        username: values?.username,
        name: values?.name,
        gender: gender,
        age: values?.age,
        bio: values?.bio,
        userId: dialogueData?._id,
      };
      dispatch(editUser(data)).then((res) => {
        if (res?.payload?.status) {
          toast.success(res?.payload?.message);
          dispatch(closeDialog());
          dispatch(getAllUsers({ startDate, endDate, page, size }));
        } else {
          toast.error(res?.payload?.message);
        }
      });
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
              Edit User
            </p>
          </div>
          <div className="model-body">

          <form>
            <div className="row sound-add-box" style={{ overflowX: 'hidden' }}>
              <Input
                type={'text'}
                label={'User Name'}
                onChange={handleInputChange}
                name={'username'}
                value={values?.username}
              />
              {errors?.username && (
                <span
                  className="error mb-2"
                  style={{ fontSize: '15px', color: 'red' }}
                >
                  {errors?.username}
                </span>
              )}
              <Input
                type={'text'}
                label={'Name'}
                name={'name'}
                onChange={handleInputChange}
                value={values?.name}
              />
              {errors?.name && (
                <span
                  className="error mb-2"
                  style={{ fontSize: '15px', color: 'red' }}
                >
                  {errors?.name}
                </span>
              )}
              <Input
                type={'number'}
                label={'Age'}
                name={'age'}
                onChange={handleInputChange}
                value={values?.age}
              />
              {errors?.age && (
                <span
                  className="error mb-2"
                  style={{ fontSize: '15px', color: 'red' }}
                >
                  {errors?.age}
                </span>
              )}
              <Input
                type={'text'}
                label={'Bio'}
                name={'bio'}
                onChange={handleInputChange}
                value={values?.bio}
              />
              {errors?.bio && (
                <span
                  className="error mb-2"
                  style={{ fontSize: '15px', color: 'red' }}
                >
                  {errors?.bio}
                </span>
              )}
              <Selector
                label={'Gender'}
                name={'gender'}
                placeholder={'Select Gender...'}
                className={'mb-2'}
                selectValue={gender}
                type={'number'}
                selectData={['male', 'female']}
                // disabled={dialogueData ? true : false}
                onChange={(e) => {
                  setGender(e.target.value);
                  setErrors({ ...errors, gender: '' });
                }}
              />
              {errors?.gender && (
                <span
                  className="error mb-2"
                  style={{ fontSize: '15px', color: 'red' }}
                >
                  {errors?.gender}
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
export default UserDialogue;
