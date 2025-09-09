import Button from '../../extra/Button';
import AddIcon from '@mui/icons-material/Add';
import Table from '../../extra/Table';
import { openDialog } from '../../store/dialogueSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  deleteAdsReward,
  deleteDailyReward,
  getAdsRewardCoin,
  getDailyRewardCoin,
} from "../../store/rewardSlice";
import Image from "next/image";
import EditIcon from "../../assets/icons/EditBtn.svg";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import AdsCoinRewarddialogue from "./AdsCoinRewarddialogue";
import Input from "../../extra/Input";
import { getSetting, updateSetting } from "../../store/settingSlice";
import { warning } from "../../util/Alert";
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import DailyRewardCoinDialogue from "./DailyRewardCoinDialogue";

import { setToast } from "../../util/toastServices";
import { IconEdit, IconTrash } from '@tabler/icons-react';

const DailyRewardSetting = () => {
  const dispatch = useDispatch();
  const { dialogueType } = useSelector((state) => state.dialogue);
  useEffect(() => {
    dispatch(getDailyRewardCoin());
  }, []);
  const { dailyReward } = useSelector((state) => state.adsReward);
  const { setting } = useSelector((state) => state.setting);
  
  const [data, setData] = useState([]);
  const [error, setError] = useState({});
  const [maxAdPerDay, setMaxAdPerDay] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  useEffect(() => {
    setData(dailyReward);
  }, [dailyReward]);
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
          dispatch(deleteDailyReward(row?._id))
            .then(unwrapResult) // This will unwrap the result and allow access to the payload directly
            .then((result) => {
              toast.success(result?.message);
              dispatch(getDailyRewardCoin());
            })
            .catch((err) => {
              console.log(err);
              toast.error("Failed to delete reward");
            });
        }
      })
      .catch((err) => console.log(err));
  };
  const dailyRewardTable = [
    {
      Header: "No",
      Cell: ({ index }) => <span>{page * parseInt(index) + 1}</span>,
    },
    {
      Header: "Daily Reward",
      Cell: ({ row, index }) => (
        <div className="userProfile">
          <span>{row?.dailyRewardCoin}</span>
        </div>
      ),
    },
    {
      Header: "Day",
      Cell: ({ row, index }) => (
        <div className="userProfile">
          <span>{row?.day}</span>
        </div>
      ),
    },
    {
      Header: "Created At",
      Cell: ({ row, index }) => (
        <div className="userProfile">
          <span>{moment(row?.createdAt).format("DD/MM/YYYY")}</span>
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
                    dispatch(
                      openDialog({
                        type: "dailyCoinReward",
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
      {dialogueType === "dailyCoinReward" && <DailyRewardCoinDialogue />}
      <div className="user-table real-user mb-3 mt-3">
        <div className="payment-setting-box">
          <div className="user-table-top">
            <div className="col-12 d-flex justify-content-between align-items-center">
            <div style={{ width: "100%" }}>
              <h5
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginTop: "5px",
                  marginBottom: "4px",
                }}>Daily Coin Reward</h5>
            </div>
              <div className="new-fake-btn">
                <Button
                  btnIcon={<AddIcon />}
                  btnName={"New"}
                  onClick={() => {
                    
                    if (data.length === 7) {
                      setToast("error", "All 7 days are already exists");
                    } else if (data.length < 7) {
                      dispatch(openDialog({ type: "dailyCoinReward" }));
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="">
            <div className="col-1fake2">
              {/* <div className="withdrawal-box"> */}
              <Table
                data={data}
                mapData={dailyRewardTable}
                PerPage={size}
                Page={page}
                type={"client"}
              />
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DailyRewardSetting;
