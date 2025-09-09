import Button from "@/extra/Button";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import Input from "@/extra/Input";
import {
  getSetting,
  saveToggle,
  settingSwitch,
  StorageSetting,
  updateSetting,
} from "@/store/settingSlice";
import { RootStore, useAppDispatch } from "@/store/store";

import { useTheme } from "@emotion/react";
import { FormControlLabel, styled, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

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

const StorageSettingPage = () => {
  const { setting } = useSelector((state) => state.setting);
  const dispatch = useDispatch();
  const [data, setData] = useState();

  const [localStorage, setLocalStorage] = useState(false);
  const [awsS3Storage, setAwsS3Storage] = useState(false);
  const [digitalOceanStorage, setDigitalOceanStorage] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState("");

  const [doEndpoint, setdoEndpoint] = useState("");
  const [doAccessKey, setdoAccessKey] = useState("");
  const [doSecretKey, setdoSecretKey] = useState("");
  const [doHostname, setdoHostname] = useState("");
  const [doBucketName, setdoBucketName] = useState("");
  const [doRegion, setdoRegion] = useState("");

  const [awsEndpoint, setawsEndpoint] = useState("");
  const [awsAccessKey, setawsAccessKey] = useState("");
  const [awsSecretKey, setawsSecretKey] = useState("");
  const [awsHostname, setawsHostname] = useState("");
  const [awsBucketName, setawsBucketName] = useState("");
  const [awsRegion, setawsRegion] = useState("");

  useClearSessionStorageOnPopState("multiButton");

  

  const theme = useTheme(); // Using useTheme hook and type assertion to cast Theme to ThemeType

  useEffect(() => {
    const payload = {};
     dispatch(getSetting(payload));
  }, []);

  useEffect(() => {
    setData(setting);
  }, [setting]);

  useEffect(() => {
    setdoEndpoint(setting?.doEndpoint);
    setdoAccessKey(setting?.doAccessKey);
    setdoSecretKey(setting?.doSecretKey);
    setdoHostname(setting?.doHostname);
    setdoBucketName(setting?.doBucketName);
    setdoRegion(setting?.doRegion);

    setawsEndpoint(setting?.awsEndpoint);
    setawsAccessKey(setting?.awsAccessKey);
    setawsSecretKey(setting?.awsSecretKey);
    setawsHostname(setting?.awsHostname);
    setawsBucketName(setting?.awsBucketName);
    setawsRegion(setting?.awsRegion);

    if (setting?.storage) {
      setAwsS3Storage(setting?.storage?.awsS3);
      setDigitalOceanStorage(setting?.storage?.digitalOcean);
      setLocalStorage(setting?.storage?.local);
    }
  }, [setting]);

  const handleSubmit = () => {
    

    const settingDataAd = {
      doEndpoint,
      doAccessKey,
      doSecretKey,
      doHostname,
      doBucketName,
      doRegion,
      awsEndpoint,
      awsAccessKey,
      awsSecretKey,
      awsHostname,
      awsBucketName,
      awsRegion,
    };

    const payload = {
      ...settingDataAd,
      settingId: setting?._id,
    };

    dispatch(updateSetting(payload)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
         dispatch(getSetting());
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleChangeStorage = (type) => {
    setLocalStorage(type === "local");
    setAwsS3Storage(type === "awsS3");
    setDigitalOceanStorage(type === "digitalOcean");
    setSelectedStorage(type);
  };

  const handleSave = () => {
    
    const payload = {
      settingId: setting?._id,
      type: selectedStorage,
    };
    dispatch(saveToggle(payload)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getSetting());
      }
    });
  };

  const handleChange = (type) => {
    
    const payload = {
      settingId: setting?._id,
      type: type,
    };
    dispatch(settingSwitch(payload));
  };

  const [selectedOption, setSelectedOption] = useState(
    setting?.isWatermarkOn ? "active" : "inactive"
  );

  return (
    <>
      <div className="payment-setting card1 p-0 mt-3">
        <div className="cardHeader">
          <div className=" align-items-center d-flex flex-wrap justify-content-between p-3">
            <div>
              <p className="m-0 fs-5 fw-medium">Storage Setting</p>
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
              <div className="mb-4">
                <div className="withdrawal-box payment-box">
                  <h6>Digital Ocean Setting</h6>
                  <div className="row">
                    <div className="row">
                      <div className="col-6 withdrawal-input border-setting">
                        <Input
                          label={"Endpoint"}
                          name={"doEndpoint"}
                          type={"text"}
                          value={doEndpoint || ""}
                          placeholder={"Endpoint"}
                          onChange={(e) => {
                            setdoEndpoint(e.target.value);
                          }}
                        />
                        <p className="text-danger">
                          e.g https://region.digitaloceanspaces.com
                        </p>
                      </div>
                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Host Name"}
                          name={"doHostname"}
                          value={doHostname || ""}
                          type={"text"}
                          placeholder={"Host Name"}
                          onChange={(e) => {
                            setdoHostname(e.target.value);
                          }}
                        />
                        <p className="text-danger ">
                          e.g. https://bucketname.region.digitaloceanspaces.com
                        </p>
                      </div>

                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Secret Key"}
                          name={"doSecretKey"}
                          type={"text"}
                          value={doSecretKey || ""}
                          placeholder={"Secret Key"}
                          onChange={(e) => {
                            setdoSecretKey(e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Access Key"}
                          name={"doAccessKey"}
                          value={doAccessKey || ""}
                          type={"text"}
                          placeholder={"Access Key"}
                          onChange={(e) => {
                            setdoAccessKey(e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Bucket Name"}
                          name={"doBucketName"}
                          type={"text"}
                          value={doBucketName || ""}
                          placeholder={"Bucket Name"}
                          onChange={(e) => {
                            setdoBucketName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Region"}
                          name={"doRegion"}
                          value={doRegion || ""}
                          type={"text"}
                          placeholder={"Region"}
                          onChange={(e) => {
                            setdoRegion(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="mb-4">
                <div className="withdrawal-box payment-box">
                  <h6>AWS Setting</h6>
                  <div className="row">
                    <div className="row">
                      <div className="col-6 withdrawal-input border-setting">
                        <Input
                          label={"Endpoint"}
                          name={"awsEndpoint"}
                          type={"text"}
                          value={awsEndpoint || ""}
                          placeholder={"Endpoint"}
                          onChange={(e) => {
                            setawsEndpoint(e.target.value);
                          }}
                        />
                        <p className="text-danger">
                          e.g https://s3.region.amazonaws.com
                        </p>
                      </div>
                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Host Name"}
                          name={"awsHostname"}
                          value={awsHostname || ""}
                          type={"text"}
                          placeholder={"Host Name"}
                          onChange={(e) => {
                            setawsHostname(e.target.value);
                          }}
                        />
                        <p className="text-danger">
                          e.g https://bucket-name.s3.region.amazonaws.com
                        </p>
                      </div>
                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Access Key"}
                          name={"awsAccessKey"}
                          value={awsAccessKey || ""}
                          type={"text"}
                          placeholder={"Access Key"}
                          onChange={(e) => {
                            setawsAccessKey(e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Secret Key"}
                          name={"awsSecretKey"}
                          type={"text"}
                          value={awsSecretKey || ""}
                          placeholder={"Secret Key"}
                          onChange={(e) => {
                            setawsSecretKey(e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Bucket Name"}
                          name={"awsBucketName"}
                          type={"text"}
                          value={awsBucketName || ""}
                          placeholder={"Bucket Name"}
                          onChange={(e) => {
                            setawsBucketName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Region"}
                          name={"awsRegion"}
                          value={awsRegion || ""}
                          type={"text"}
                          placeholder={"Region"}
                          onChange={(e) => {
                            setawsRegion(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="mb-4">
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
                          onClick={() => handleChangeStorage("local")}
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
                          onClick={() => handleChangeStorage("awsS3")}
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
                          onClick={() => handleChangeStorage("digitalOcean")}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StorageSettingPage;
