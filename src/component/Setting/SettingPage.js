import { useDispatch, useSelector } from "react-redux";
import Button from "../../extra/Button";
import Input, { Textarea } from "../../extra/Input";
import { useEffect, useState } from "react";
import {
  getSetting,
  saveToggle,
  updateSetting,
} from "../../store/settingSlice";
import { toast } from "react-toastify";

import ToggleSwitch from "../../extra/ToggleSwitch";
import { FormControlLabel, Switch } from "@mui/material";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";

const SettingPage = () => {
  const { setting } = useSelector((state) => state.setting);

  
  const [freeEpisodesForNonVip, setFreeEpisodesForNonVip] = useState("");
  const [durationOfShorts, setDurationOfShorts] = useState("");
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState("");
  const [privacyPolicyText, setPrivacyPolicyText] = useState("");
  const [firebaseKeyText, setFirebaseKeyText] = useState();
  const [localStorage, setLocalStorage] = useState(false);
  const [awsS3Storage, setAwsS3Storage] = useState(false);
  const [digitalOceanStorage, setDigitalOceanStorage] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');

  
  const dispatch = useDispatch();
  useEffect(() => {
    if (setting) {
      setFreeEpisodesForNonVip(setting?.freeEpisodesForNonVip);
      setDurationOfShorts(setting?.durationOfShorts);
      setFirebaseKeyText(JSON.stringify(setting?.privateKey));
      setPrivacyPolicyLink(setting?.privacyPolicyLink);
      setPrivacyPolicyText(setting?.termsOfUsePolicyLink);
      setSupportEmail(setting?.contactEmail);
      setResendApiKey(setting?.resendApiKey);
      // Initialize storage settings if they exist in the setting object
      if (setting.storage) {
        setLocalStorage(setting?.storage?.local);
        setAwsS3Storage(setting?.storage?.awsS3);
        setDigitalOceanStorage(setting?.storage?.digitalOcean);
      }
    }
  }, [setting]);

  const theme = useTheme();

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: "67px",
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      top: "8px",
      transform: "translateX(10px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(40px)",
        top: "8px",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.5992 5.06724L16.5992 5.06719C16.396 4.86409 16.1205 4.75 15.8332 4.75C15.546 4.75 15.2705 4.86409 15.0673 5.06719L15.0673 5.06721L7.91657 12.2179L4.93394 9.23531C4.83434 9.13262 4.71537 9.05067 4.58391 8.9942C4.45174 8.93742 4.30959 8.90754 4.16575 8.90629C4.0219 8.90504 3.87925 8.93245 3.74611 8.98692C3.61297 9.04139 3.49202 9.12183 3.3903 9.22355C3.28858 9.32527 3.20814 9.44622 3.15367 9.57936C3.0992 9.7125 3.07179 9.85515 3.07304 9.99899C3.07429 10.1428 3.10417 10.285 3.16095 10.4172C3.21742 10.5486 3.29937 10.6676 3.40205 10.7672L7.15063 14.5158L7.15066 14.5158C7.35381 14.7189 7.62931 14.833 7.91657 14.833C8.20383 14.833 8.47933 14.7189 8.68249 14.5158L8.68251 14.5158L16.5992 6.5991L16.5992 6.59907C16.8023 6.39592 16.9164 6.12042 16.9164 5.83316C16.9164 5.54589 16.8023 5.27039 16.5992 5.06724Z" fill="white" stroke="white" strokeWidth="0.5"/></svg>')`,
        },
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme === "dark" ? "#8796A5" : "#FCF3F4",
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: theme === "dark" ? "#0FB515" : "red",
      width: 24,
      height: 24,
      "&:before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14.1665 5.83301L5.83325 14.1663" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><path d="M5.83325 5.83301L14.1665 14.1663" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      borderRadius: "52px",
      border: "0.5px solid rgba(0, 0, 0, 0.14)",
      background: " #FFEDF0",
      boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.08) inset",
      opacity: 1,
      width: "79px",
      height: "28px",
    },
  }));
  const handleSubmit = () => {
    
    const data = {
      freeEpisodesForNonVip: freeEpisodesForNonVip,
      durationOfShorts: durationOfShorts,
      settingId: setting?._id ? setting?._id : '',
      privateKey: firebaseKeyText,
      privacyPolicyLink: privacyPolicyLink,
      termsOfUsePolicyLink: privacyPolicyText,
      contactEmail: supportEmail,
      resendApiKey: resendApiKey,
      storage: {
        local: localStorage,
        awsS3: awsS3Storage,
        digitalOcean: digitalOceanStorage,
      },
    };
    dispatch(updateSetting(data)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
         dispatch(getSetting());
      }
    });
  };

  const handleChange = (type) => {
    console.log("type", type);

    // Set only the selected storage to true, rest to false
    setLocalStorage(type === "local");
    setAwsS3Storage(type === "awsS3");
    setDigitalOceanStorage(type === "digitalOcean");

    setSelectedStorage(type);
  };
  const handleSave = () => {
    

    const payload = {
      settingId: setting?._id ? setting?._id : '',
      type: selectedStorage,
    };

    dispatch(saveToggle(payload)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
         dispatch(getSetting());
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const fakeFirebaseJson = {
    type: 'service_account',
    project_id: 'demo-project-12345',
    private_key_id: 'fakeprivatekeyid1234567890abcdef',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0FAKEFAASCBKcwggSjAgEAAoIBAQDUMMYKEYEXAMPLE\n-----END PRIVATE KEY-----\n',
    client_email:
      'firebase-adminsdk-abcde@demo-project-12345.iam.gserviceaccount.com',
    client_id: '123456789012345678901',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-abcde%40demo-project-12345.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com',
  };

  //    const handleChange = (type) => {
  //     

  //     const payload = {
  //         settingId: setting?._id,
  //         type: type,
  //     };
  //     dispatch(saveToggle(payload))
  //         .then((res) => {
  //             if (res?.payload?.status) {
  //                 toast.success(res?.payload?.message);
  //                 dispatch(getSetting());
  //             } else {
  //                 toast.error(res?.payload?.message)
  //             }
  //         })
  // };

  return (
    <>
      <div className="payment-setting card1 p-0 mt-3">
        <div className="cardHeader">
          <div className=" align-items-center d-flex flex-wrap justify-content-between p-3">
            <div>
              <p className="m-0 fs-5 fw-medium">App Setting</p>
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
          <div className="">
            <div className="row">
              {/* <div className="col-6">
                                <div className="mb-4">
                                    <div className="withdrawal-box payment-box">
                                        <h6>Free Episodes For Non Vip</h6>
                                        <div className="row">
                                            <div className="row">
                                                <div className="col-12 withdrawal-input border-setting">
                                                    <Input
                                                        // label={"Free Episodes For Non Vip"}
                                                        name={"freeEpisodesForNonVip"}
                                                        type={"text"}
                                                        value={freeEpisodesForNonVip || ""}
                                                        placeholder={""}
                                                        onChange={(e) => {
                                                            setFreeEpisodesForNonVip(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="withdrawal-box payment-box">
                                        <h6>Duration Of Shorts</h6>
                                        <div className="row">
                                            <div className="row">
                                                <div className="col-12 withdrawal-input border-setting">
                                                    <Input
                                                        // label={"Duration Of Shorts"}
                                                        name={"durationOfShorts"}
                                                        type={"text"}
                                                        value={durationOfShorts || ""}
                                                        placeholder={""}
                                                        onChange={(e) => {
                                                            setDurationOfShorts(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
              {/* <div className="col-6">
                                <div className="mb-4">
                                    <div className="withdrawal-box payment-box">
                                        <h6>Duration Of Shorts</h6>
                                        <div className="row">
                                            <div className="row">
                                                <div className="col-12 withdrawal-input border-setting">
                                                    <Input
                                                        // label={"Duration Of Shorts"}
                                                        name={"durationOfShorts"}
                                                        type={"text"}
                                                        value={durationOfShorts || ""}
                                                        placeholder={""}
                                                        onChange={(e) => {
                                                            setDurationOfShorts(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
              <div className="col-6">
                <div className="withdrawal-box payment-box">
                  <h6>Firebase Notification Setting</h6>
                  <div className="row">
                    <div className="row">
                      <div className="col-12 withdrawal-input">
                        <div className="row">
                          <div className="col-12">
                            <Textarea
                              row={10}
                              col={60}
                              type={`text`}
                              id={`firebaseKey`}
                              name={`firebaseKey`}
                              label={`Private Key JSON`}
                              //   placeholder={`Enter firebaseKey`}
                              placeholder={`Enter firebaseKey`}
                              value={firebaseKeyText}
                              onChange={(e) => {
                                setFirebaseKeyText(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="mb-4">
                  <div className="withdrawal-box payment-box">
                    <h6>Non-VIP Access Setting</h6>

                    <div className="row">
                      <div className="row">
                        <div className="col-12 withdrawal-input border-setting">
                          <Input
                            label={'Free Episodes For Non Vip'}
                            name={'freeEpisodesForNonVip'}
                            type={'text'}
                            value={freeEpisodesForNonVip || ''}
                            placeholder={`Enter Free Episodes Limit`}
                            onChange={(e) => {
                              setFreeEpisodesForNonVip(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="withdrawal-box payment-box">
                    <h6>Episode Duration Setting</h6>
                    <div className="row">
                      <div className="row">
                        <div className="col-12 withdrawal-input border-setting">
                          <Input
                            label={'Duration Of Shorts(Seconds)'}
                            name={'durationOfShorts'}
                            type={'text'}
                            value={durationOfShorts || ''}
                            placeholder={'Enter Duration of Shorts'}
                            onChange={(e) => {
                              setDurationOfShorts(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6" style={{ marginTop: "20px" }}>
                <div className="mb-4">
                  <div className="withdrawal-box payment-box">
                    <h6>App Setting</h6>
                    <div className="row">
                      <div className="row">
                        <div className="col-6 withdrawal-input border-setting">
                          <Input
                            label={'Privacy Policy Link'}
                            name={'privacyPolicyLink'}
                            type={'text'}
                            value={privacyPolicyLink || ''}
                            placeholder={`Enter Privacy policy link`}
                            onChange={(e) => {
                              setPrivacyPolicyLink(e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-6 withdrawal-input">
                          <Input
                            label={'Terms and Condition'}
                            name={'privacyPolicyText'}
                            value={privacyPolicyText || ''}
                            type={'text'}
                            placeholder={`Enter Terms and condition Link`}
                            onChange={(e) => {
                              setPrivacyPolicyText(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="withdrawal-box payment-box">
                    <h6>Email Setting</h6>
                    <div className="row">
                      <div className="row">
                        <div className="col-12 withdrawal-input border-setting">
                          <Input
                            label={'Enter Resend Api Key'}
                            name={'resendApiKey'}
                            type={'text'}
                            value={resendApiKey || ''}
                            placeholder={`Enter API Key`}
                            onChange={(e) => {
                              setResendApiKey(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6" style={{ marginTop: "20px" }}>
                {/* <div className="mb-4">
                  <div className="withdrawal-box payment-box">
                    <h6>Storage Setting</h6>
                    <div className="row">
                      <div className="col-12 withdrawal-input border-setting">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="">local</span>
                          <FormControlLabel
                            control={
                              <MaterialUISwitch
                                sx={{ m: 1 }}
                                checked={localStorage === true ? true : false}
                                theme={theme}
                              />
                            }
                            label=""
                            onClick={() => handleChange("local")}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>AWS S3</span>
                          <FormControlLabel
                            control={
                              <MaterialUISwitch
                                sx={{ m: 1 }}
                                checked={awsS3Storage === true ? true : false}
                                theme={theme}
                              />
                            }
                            label=""
                            onClick={() => handleChange("awsS3")}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>Digital Ocean Space</span>
                          <FormControlLabel
                            control={
                              <MaterialUISwitch
                                sx={{ m: 1 }}
                                checked={
                                  digitalOceanStorage === true ? true : false
                                }
                                theme={theme}
                              />
                            }
                            label=""
                            onClick={() => handleChange("digitalOcean")}
                          />
                        </div>
                      </div>
                      <div className="col-12 mt-3 d-flex justify-content-end ">
                        <Button
                          btnName={"Save"}
                          type={"button"}
                          onClick={handleSave}
                          newClass={"submit-btn"}
                          style={{
                            borderRadius: "0.5rem",
                            width: "88px",
                            marginLeft: "10px",
                            // background : "#db2342"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="mb-4">
                  <div className="withdrawal-box payment-box">
                    <h6>Support Email Setting</h6>
                    <div className="row">
                      <div className="row">
                        <div className="withdrawal-input border-setting">
                          <Input
                            label={"Support Email"}
                            name={"supportEmail"}
                            type={"email"}
                            value={supportEmail || ""}
                            placeholder={`Enter Support Email`}
                            onChange={(e) => {
                              setSupportEmail(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
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
export default SettingPage;
