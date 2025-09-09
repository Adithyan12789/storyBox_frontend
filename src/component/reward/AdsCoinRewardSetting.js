import Button from '../../extra/Button';
import AddIcon from '@mui/icons-material/Add';
import Table from '../../extra/Table';
import { openDialog } from '../../store/dialogueSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { deleteAdsReward, getAdsRewardCoin } from '../../store/rewardSlice';
import Image from 'next/image';
import EditIcon from '../../assets/icons/EditBtn.svg';
import TrashIcon from '../../assets/icons/trashIcon.svg';
import AdsCoinRewarddialogue from './AdsCoinRewarddialogue';
import Input from '../../extra/Input';
import { getSetting, updateSetting } from '../../store/settingSlice';
import { warning } from '../../util/Alert';
import { toast } from 'react-toastify';
import { unwrapResult } from '@reduxjs/toolkit';

import { IconEdit, IconTrash } from '@tabler/icons-react';

const AdsCoinRewardSetting = () => {
  const dispatch = useDispatch();
  const { dialogueType } = useSelector((state) => state.dialogue);
  useEffect(() => {
    dispatch(getAdsRewardCoin());
  }, []);
  const { adsReward } = useSelector((state) => state.adsReward);
  const { setting } = useSelector((state) => state.setting);
  
  const [data, setData] = useState([]);
  const [error, setError] = useState({});
  const [maxAdPerDay, setMaxAdPerDay] = useState();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  useEffect(() => {
    setData(adsReward);
  }, [adsReward]);
  useEffect(() => {
    dispatch(getSetting());
  }, []);
  useEffect(() => {
    setMaxAdPerDay(setting?.maxAdPerDay);
  }, [setting]);
  const handleSubmit = () => {
    
    if (maxAdPerDay === "") {
      let error = {};
      if (maxAdPerDay === "") error.maxAdPerDay = "Amount Is Required !";
      return setError({ ...error });
    } else {
      let settingDataSubmit = {
        settingId: setting?._id ? setting?._id : '',
        maxAdPerDay: parseInt(maxAdPerDay),
      };
      dispatch(updateSetting(settingDataSubmit));
    }
  };
  const handleDeleteReward = (row) => {
    
    const data = warning();
    data
      .then((res) => {
        if (res) {
          dispatch(deleteAdsReward(row?._id))
            .then(unwrapResult) // This will unwrap the result and allow access to the payload directly
            .then((result) => {
              toast.success(result?.message);
              dispatch(getAdsRewardCoin());
            })
            .catch((err) => {
              console.log(err);
              toast.error('Failed to delete reward');
            });
        }
      })
      .catch((err) => console.log(err));
  };
  const adsRewardTable = [
    {
      Header: "No",
      Cell: ({ index }) => <span>{page * parseInt(index) + 1}</span>,
    },
    {
      Header: "Label",
      Cell: ({ row, index }) => (
        <div className="userProfile">
          <span>{row?.adLabel}</span>
        </div>
      ),
    },
    {
      Header: "Display Interval",
      Cell: ({ row, index }) => (
        <div className="userProfile">
          <span>{row?.adDisplayInterval}</span>
        </div>
      ),
    },
    {
      Header: "Coin Earned",
      Cell: ({ row, index }) => (
        <div className="userProfile">
          <span>{row?.coinEarnedFromAd}</span>
        </div>
      ),
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <>
          <div className="action-button">
            <Button
              btnIcon={
                <IconEdit className='text-secondary'/>
              }
                  onClick={() => {
                    // 
                    dispatch(
                      openDialog({
                        type: 'adsCoinReward',
                        data: row,
                      })
                    );
                  }}
            />

            <Button
              btnIcon={
                <IconTrash className='text-secondary'/>
              }
              onClick={() => handleDeleteReward(row)}
            />
          </div>
        </>
      ),
    },
  ];
  return (
    <>
      {dialogueType === "adsCoinReward" && <AdsCoinRewarddialogue />}
      <div className="mt-3">
        <div className="  ">
          <div className="card1">
            <div className="cardHeader p-3">
              <div className="align-items-center d-flex justify-content-between w-100">
                <h5 className=" m-0">Ads Coin Reward</h5>
                <Button
                  btnName={"Submit"}
                  type={"button"}
                  onClick={handleSubmit}
                  newClass={"submit-btn"}
                  // style={{
                  //   borderRadius: "0.5rem",
                  //   width: "88px",
                  //   marginLeft: "10px",
                  // }}
                />
              </div>
            </div>
         
              <div className=" p-3 withdrawal-input mt-1">
                <Input
                  label={"Maximum Ads Per Day"}
                  name={"maxAdPerDay"}
                  type={"number"}
                  value={maxAdPerDay}
                  placeholder={"Enter Amount"}
                  onChange={(e) => {
                    setMaxAdPerDay(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        maxAdPerDay: `Maximum Ads Per Day Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        maxAdPerDay: "",
                      });
                    }
                  }}
                />
              </div>
            
          </div>
        </div>
      </div>
      <div className="user-table real-user mb-3 mt-3">
        {/* <div className="payment-setting-box"> */}
        <div className="user-table-top">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div style={{ width: "100%" }}>
              <h5
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginTop: "5px",
                  marginBottom: "4px",
                }}
              >
                Ads Coin Reward
              </h5>
            </div>
            <div className="new-fake-btn">
              <Button
                btnIcon={<AddIcon />}
                btnName={"New"}
                onClick={() => {
                  // 
                  dispatch(
                    openDialog({
                      type: "adsCoinReward",
                    })
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="">
          {/* <div className="col-1fake2 text-black"> */}
          {/* <div className="withdrawal-box"> */}
          <Table
            data={data}
            mapData={adsRewardTable}
            PerPage={size}
            Page={page}
            type={"client"}
          />
          {/* </div> */}
          {/* </div> */}
        </div>
        {/* </div> */}
      </div>
    </>
  );
};
export default AdsCoinRewardSetting;
