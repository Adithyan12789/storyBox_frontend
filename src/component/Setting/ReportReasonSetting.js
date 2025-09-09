import Button from '@/extra/Button';
import Input from '@/extra/Input';
import {
  deleteReportSetting,
  getReportSetting,
  getSetting,
  settingSwitch,
  updateSetting,
} from '@/store/settingSlice';
import { useTheme } from '@emotion/react';
import { FormControlLabel, Switch, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import { openDialog } from '@/store/dialogueSlice';
import ReportReasonDialogue from '../reportreason/ReportReasonDialogue';
import Table from '@/extra/Table';
import Image from 'next/image';
import TrashIcon from '../../assets/icons/trashIcon.svg';
import EditIcon from '../../assets/icons/EditBtn.svg';
import { warning } from '@/util/Alert';
import useClearSessionStorageOnPopState from '@/extra/ClearStorage';
import { IconEdit, IconTrash } from '@tabler/icons-react';

const ReportReasonSetting = () => {
  const { settingData } = useSelector((state) => state.setting);
  

  const dispatch = useDispatch();
 

  const { dialogueType } = useSelector((state) => state.dialogue);

  const [size, setSize] = useState(20);
  const [page, setPage] = useState(1);
  useClearSessionStorageOnPopState('multiButton');

  const theme = useTheme();

  useEffect(() => {
    const payload = {};
    dispatch(getReportSetting(payload));
  }, [dispatch]);

  const handleDelete = (row) => {
    
    const data = warning();
    data
      .then((res) => {
        if (res) {
          const id = row?._id;
          dispatch(deleteReportSetting(id)).then((res) => {
            dispatch(getReportSetting());
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const reportReasonTable = [
    {
      Header: 'No',
      body: 'name',
      Cell: ({ index }) => <span>{index + 1}</span>,
    },
    {
      Header: 'Title',
      body: 'name',
      Cell: ({ row }) => <span className="text-capitalize">{row?.title}</span>,
    },

    {
      Header: 'Action',
      body: 'action',
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={
              <IconEdit className='text-secondary' />
            }
            onClick={() => {
              
              dispatch(
                openDialog({
                  type: 'editreportreason',
                  data: row,
                })
              );
            }}
          />

          <Button
            btnIcon={
              <IconTrash className='text-secondary' />
            }
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
    },
  ];

    return (
        <>
            {dialogueType == "reportreason" && <ReportReasonDialogue />}
            {dialogueType == "editreportreason" && <ReportReasonDialogue />}

            <div className="user-table real-user mb-3">
                {/* <div className="payment-setting-box"> */}
                 <div className="user-table-top">
              <div style={{ width: "100%" }}>
                <h5
                  style={{
                    fontWeight: "500",
                    fontSize: "20px",
                    marginTop: "5px",
                    marginBottom: "4px",
                  }}
                >
                  Report Reason
                </h5>
              </div>
              <div className="col-6 d-flex justify-content-end">
                <div className="ms-auto">
                  <div className="new-fake-btn d-flex ">
                    <Button
                      btnIcon={<AddIcon />}
                      btnName={"New"}
                     onClick={() => {
                                        
                                        dispatch(
                                            openDialog({ type: "reportreason" })
                                        );
                                    }}
                    />
                  </div>
                </div>
              </div>
            </div>
                  
                   
                                <Table
                                    data={settingData}
                                    mapData={reportReasonTable}
                                    PerPage={size}
                                    Page={page}
                                    type={"client"}
                                />
                          
              
            </div>
         
    </>
  );
};

export default ReportReasonSetting;
