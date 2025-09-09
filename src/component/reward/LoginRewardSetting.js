import { useDispatch, useSelector } from 'react-redux';
import Button from '../../extra/Button';
import Input from '../../extra/Input';
import { useEffect, useState } from 'react';
import { getSetting, updateSetting } from '../../store/settingSlice';

import { setToast } from '../../util/toastServices';

const LoginRewardSetting = () => {
  const { setting } = useSelector((state) => state.setting);
  
  const dispatch = useDispatch();
  const [loginRewardCoins, setLoginRewardCoins] = useState();

  const [error, setError] = useState({
    loginRewardCoins: '',
  });

  useEffect(() => {
    setLoginRewardCoins(setting?.loginRewardCoins);
  }, [setting]);

  useEffect(() => {
     dispatch(getSetting());
  }, []);
  const handleSubmit = async () => {
    
    const loginRewardCoinsValue = parseInt(loginRewardCoins);
    if (loginRewardCoins === '' || loginRewardCoinsValue <= 0) {
      let error = {};
      if (loginRewardCoins === '')
        error.loginRewardCoins = 'Amount Is Required !';

      if (loginRewardCoinsValue <= 0)
        error.loginRewardCoins = 'Amount Invalid !';

      return setError({ ...error });
    } else {
      let settingDataSubmit = {
        settingId: setting?._id ? setting?._id : '',
        loginRewardCoins: parseInt(loginRewardCoins),
      };


          const res = await dispatch(updateSetting(settingDataSubmit))
            if (res?.payload?.status) {
                setToast("success", res?.payload?.message);
                // handleCloseAds();
                // dispatch(getEpisodeList({ page, size }));
            } else {
                setToast("error", res?.payload?.message);
            }
        }
    };
    return (
        <>
            <div className="  userPage withdrawal-page p-0" style={{ marginTop: "20px" }}>
                
                    <div className="">
                        <div className="card1">
                        <div className="cardHeader p-3">

                            <div className="align-items-center d-flex justify-content-between w-100">
                                
                                    <h5 className="m-0">Login Reward</h5>
                                
                                
                                    <Button
                                        btnName={"Submit"}
                                        type={"button"}
                                        onClick={handleSubmit}
                                        newClass={"submit-btn"}
                                        style={{
                                            borderRadius: "0.5rem",
                                            width: "88px",
                                            marginLeft: "10px",
                                        }}
                                    />
                               
                            </div>
                        </div>
                           
                                <div className="col-12 p-3 withdrawal-input">
                                    <Input
                                        label={"Login Reward Coin"}
                                        name={"loginRewardCoins"}
                                        value={loginRewardCoins}
                                        type={"number"}
                                        errorMessage={error.loginRewardCoins}
                                        placeholder={"Enter login reward coin.."}
                                        onChange={(e) => {
                                            setLoginRewardCoins(e.target.value);
                                        }}
                                    />
                                </div>
                           
                        </div>
                    </div>
                
            </div>
    </>
  );
};
export default LoginRewardSetting;
