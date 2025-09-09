import { FormControlLabel, Switch } from '@mui/material';
import Button from '../../extra/Button';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../extra/Input';
import {
  getSetting,
  handleSwitchUpdate,
  updateSetting,
} from '../../store/settingSlice';
import { toast } from 'react-toastify';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: '67px',
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    top: '8px',
    transform: 'translateX(10px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(40px)',
      top: '8px',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.5992 5.06724L16.5992 5.06719C16.396 4.86409 16.1205 4.75 15.8332 4.75C15.546 4.75 15.2705 4.86409 15.0673 5.06719L15.0673 5.06721L7.91657 12.2179L4.93394 9.23531C4.83434 9.13262 4.71537 9.05067 4.58391 8.9942C4.45174 8.93742 4.30959 8.90754 4.16575 8.90629C4.0219 8.90504 3.87925 8.93245 3.74611 8.98692C3.61297 9.04139 3.49202 9.12183 3.3903 9.22355C3.28858 9.32527 3.20814 9.44622 3.15367 9.57936C3.0992 9.7125 3.07179 9.85515 3.07304 9.99899C3.07429 10.1428 3.10417 10.285 3.16095 10.4172C3.21742 10.5486 3.29937 10.6676 3.40205 10.7672L7.15063 14.5158L7.15066 14.5158C7.35381 14.7189 7.62931 14.833 7.91657 14.833C8.20383 14.833 8.47933 14.7189 8.68249 14.5158L8.68251 14.5158L16.5992 6.5991L16.5992 6.59907C16.8023 6.39592 16.9164 6.12042 16.9164 5.83316C16.9164 5.54589 16.8023 5.27039 16.5992 5.06724Z" fill="white" stroke="white" strokeWidth="0.5"/></svg>')`,
      },
    },
    '& + .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme === 'dark' ? '#8796A5' : '#FCF3F4',
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme === 'dark' ? '#0FB515' : 'red',
    width: 24,
    height: 24,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14.1665 5.83301L5.83325 14.1663" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><path d="M5.83325 5.83301L14.1665 14.1663" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: '52px',
    border: '0.5px solid rgba(0, 0, 0, 0.14)',
    background: ' #FFEDF0',
    boxShadow: '0px 0px 2px 0px rgba(0, 0, 0, 0.08) inset',
    opacity: 1,
    width: '79px',
    height: '28px',
  },
}));

const PaymentSettingPage = () => {
  const [razorPaySwitch, setRazorPaySwitch] = useState();
  const [stripePublishableKey, setStripePublishableKey] = useState();
  const [stripeSecretKey, setStripeSecretKey] = useState();
  const [stripeSwitch, setStripeSwitch] = useState();
  const [googlePlaySwitch, setGooglePlaySwitch] = useState();
  const [flutterWaveId, setFlutterWaveId] = useState();
  const [isFlutterWaveSwitch, setIsFlutterWaveSwitch] = useState();
  const { setting } = useSelector((state) => state.setting);
  const [razorSecretKey, setRazorSecretKey] = useState();
  const [razorPayId, setRazorPayId] = useState();
  const dispatch = useDispatch();
  
  
  useEffect(() => {
    setRazorPayId(setting?.razorPayId);
    setStripeSwitch(setting?.stripeSwitch);
    setRazorPaySwitch(setting?.razorPaySwitch);
    setStripeSecretKey(setting?.stripeSecretKey);
    setStripePublishableKey(setting?.stripePublishableKey);
    setRazorSecretKey(setting?.razorSecretKey);
    setGooglePlaySwitch(setting?.googlePlaySwitch);
    setFlutterWaveId(setting?.flutterWaveId);
    setIsFlutterWaveSwitch(setting?.flutterWaveSwitch);
  }, [setting]);
  const theme = useTheme();
  const handleChange = (type) => {
    

    const payload = {
      settingId: setting?._id ? setting?._id : '',
      type: type,
    };
    dispatch(handleSwitchUpdate(payload)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getSetting());
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };
  const handleSubmit = () => {
    

    const settingDataAd = {
      razorPayId: razorPayId,
      razorSecretKey: razorSecretKey,
      stripeSecretKey: stripeSecretKey,
      stripePublishableKey: stripePublishableKey,
      flutterWaveId: flutterWaveId,
      settingId: setting?._id,
    };
        

    dispatch(updateSetting(settingDataAd)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getSetting());
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };
  return (
    <>
            <div className="payment-setting card1 p-0 mt-3" >
            <div className="cardHeader">
                      <div className=" align-items-center d-flex flex-wrap justify-content-between p-3">
                        <div>
                          <p className="m-0 fs-5 fw-medium">Payment Setting</p>
                        </div>
                        <Button
                          btnName={"Submit"}
                          type={"button"}
                          onClick={handleSubmit}
                          newClass={"submit-btn"}
                          style={{
                            borderRadius: "5px",
                            width: "88px",
                          }}
                        />
                      </div>
                    </div>
                <div className="payment-setting-box p-3">
                    <div className="row">
                        <div className="col-6">
                            <div className="withdrawal-box">
                                <h6>Razor Pay Setting</h6>
                                <div className="row  withdrawal-input">
                                    <div className="col-12 mt-1 d-flex justify-content-between align-items-center">
                                        <button className="payment-content-button">
                                            <span>Razor Pay (enable/disable for payment in app)</span>
                                        </button>
                                        <FormControlLabel
                                            control={
                                                <MaterialUISwitch
                                                    sx={{ m: 1 }}
                                                    checked={razorPaySwitch === true ? true : false}
                                                    theme={theme}
                                                />
                                            }
                                            label=""
                                            onClick={() => handleChange("razorPaySwitch")}
                                        />
                                    </div>

                  <div className="col-6 withdrawal-input">
                    <Input
                      label={'Razor Pay Id'}
                      name={'razorPayId'}
                      type={'text'}
                      value={razorPayId || ''}
                      placeholder={` RazorPay Id`}
                      onChange={(e) => {
                        setRazorPayId(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-6 withdrawal-input">
                    <Input
                      label={'Razor Secret Key'}
                      name={'durationOfShorts'}
                      type={'text'}
                      value={razorSecretKey || ''}
                      placeholder={`Razorpay Secret Key`}
                      onChange={(e) => {
                        setRazorSecretKey(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="withdrawal-box">
                <h6>Stripe Pay Setting</h6>
                <div className="row  withdrawal-input">
                  <div className="col-12 mt-1 d-flex justify-content-between align-items-center ">
                    <button className="payment-content-button">
                      <span>Stripe (enable/disable for payment in app)</span>
                    </button>
                    <FormControlLabel
                      label=""
                      control={
                        <MaterialUISwitch
                          sx={{ m: 1 }}
                          checked={stripeSwitch === true ? true : false}
                          theme={theme}
                        />
                      }
                      onClick={() => handleChange('stripeSwitch')}
                    />
                  </div>

                  <div className="col-6 withdrawal-input">
                    <Input
                      label={'Stripe Publishable Key'}
                      name={'stripePublishableKey'}
                      type={'text'}
                      value={stripePublishableKey || ''}
                      placeholder={`Stripe Publishable Key`}
                      onChange={(e) => {
                        setStripePublishableKey(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-6 withdrawal-input">
                    <Input
                      label={'Stripe Secret Key'}
                      name={'stripeSecretKey'}
                      type={'text'}
                      value={stripeSecretKey || ''}
                      placeholder={`Stripe Secret Key`}
                      onChange={(e) => {
                        setStripeSecretKey(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 mt-2">
              <div className="withdrawal-box">
                <h6>Google Play Setting</h6>
                <div className="row  withdrawal-input">
                  <div className="col-12 mt-1 d-flex justify-content-between align-items-center">
                    <button className="payment-content-button">
                      <span>
                        Google Play (enable/disable for payment in app)
                      </span>
                    </button>
                    <FormControlLabel
                      control={
                        <MaterialUISwitch
                          sx={{ m: 1 }}
                          checked={googlePlaySwitch === true ? true : false}
                          theme={theme}
                        />
                      }
                      label=""
                      onClick={() => handleChange('googlePlaySwitch')}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 mt-2">
              <div className="withdrawal-box">
                <h6>Flutter Wave Setting</h6>
                <div className="row withdrawal-input">
                  <div className="col-12 mt-1 d-flex justify-content-between align-items-center ">
                    <button className="payment-content-button">
                      <span>
                        Flutter Wave (enable/disable for payment in app)
                      </span>
                    </button>
                    <FormControlLabel
                      label=""
                      control={
                        <MaterialUISwitch
                          sx={{ m: 1 }}
                          checked={isFlutterWaveSwitch === true ? true : false}
                          theme={theme}
                        />
                      }
                      onClick={() => handleChange('flutterWaveSwitch')}
                    />
                  </div>

                  <div className="col-6 withdrawal-input">
                    <Input
                      label={'Flutter Wave Id'}
                      name={'flutterWaveId'}
                      type={'text'}
                      value={flutterWaveId || ''}
                      placeholder={`FlutterWave Key`}
                      onChange={(e) => {
                        setFlutterWaveId(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PaymentSettingPage;
