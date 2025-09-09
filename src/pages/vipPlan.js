import { useDispatch, useSelector } from 'react-redux';
import RootLayout from '../component/layout/Layout';
import Pagination from '../extra/Pagination';
import Table from '../extra/Table';
import NewTitle from '../extra/Title';
import { getVipPlan, handleIsActiveVipCoin } from '../store/vipPlanSlice';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { openDialog } from '../store/dialogueSlice';
import Button from '../extra/Button';
import AddIcon from '@mui/icons-material/Add';
import CoinPlanDialogue from '../component/coinPlan/CoinPlanDialogue';
import ToggleSwitch from '../extra/ToggleSwitch';
import Image from 'next/image';
import EditIcon from '../assets/icons/EditBtn.svg';
import { toast } from 'react-toastify';
import VipPlanDialogue from '../component/vipPlan/VipPlanDialogue';

import { IconEdit } from '@tabler/icons-react';

const vipPlan = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const { dialogueType } = useSelector((state) => state.dialogue);
  
  const [data, setData] = useState([]);
  const { vipPlan } = useSelector((state) => state.vipPlan);
  const dispatch = useDispatch();
  useEffect(() => {
    setData(vipPlan);
  }, [vipPlan]);
  useEffect(() => {
    dispatch(getVipPlan({ page, size }));
  }, [page]);
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };
  const handleIsActive = (row) => {
    
    dispatch(handleIsActiveVipCoin(row?._id)).then((res) => {
      // console.log("resss", res)
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getVipPlan({ page, size }));
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };
  const coinPlanTable = [
    {
      Header: "No",
      body: "no",
      Cell: ({ index }) => (
        <span className="  text-nowrap">
          {(page - 1) * size + parseInt(index) + 1}
        </span>
      ),
    },
    {
      Header: "ProductKey",
      body: "productKey",
      Cell: ({ row }) => (
        <span className="  text-nowrap">{row?.productKey}</span>
      ),
    },
    {
      Header: "Tags",
      body: "tags",
      Cell: ({ row }) => <span className="  text-nowrap">{row?.tags}</span>,
    },
    {
      Header: "Price",
      body: "price",
      Cell: ({ row }) => <span className="  text-nowrap">{row?.price}</span>,
    },
    {
      Header: "Offer Price",
      body: "offerPrice",
      Cell: ({ row }) => (
        <span className="  text-nowrap">{row?.offerPrice}</span>
      ),
    },
    {
      Header: "Validity",
      body: "validity",
      Cell: ({ row }) => <span className="  text-nowrap">{row?.validity}</span>,
    },
    {
      Header: "Validity Type",
      body: "validityType",
      Cell: ({ row }) => (
        <span className="  text-nowrap">{row?.validityType}</span>
      ),
    },
    {
      Header: "Date",
      body: "createdAt",
      Cell: ({ row }) => (
        <span className="  text-nowrap">
          {moment(row?.createdAt).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      Header: "Active",
      body: "isActive",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isActive}
          onChange={() => handleIsActive(row)}
        />
      ),
    },
    {
      Header: "Action",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={
              <IconEdit className='text-secondary'/>
            }
                onClick={() => {
                 
                  dispatch(
                    openDialog({
                      type: "coinPlan",
                      data: row,
                    })
                  );
                }}
          />
          {/* <Button
                        btnIcon={
                            <img src={TrashIcon.src} alt="Trash Icon" width={25} height={25} />
                        }
                        onClick={() => handleDeleteFilmCategory(row)}
                    /> */}
        </div>
      ),
    },
  ];
  return (
    <>
      {dialogueType === "coinPlan" && (
        <VipPlanDialogue page={page} size={size} />
      )}
      {/* <div className="userPage">
                <div className="dashboardHeader primeHeader mb-3 p-0">
                    <NewTitle />
                </div>
            </div> */}
      <div className="userPage">
        <div className="user-table real-user mb-3">
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
                VIP Plan
              </h5>
            </div>
            <div
              className="col-6 d-flex justify-content-end"
            >
              <div className="ms-auto">
                <div className="new-fake-btn d-flex ">
                  <Button
                    btnIcon={<AddIcon />}
                    btnName={"New"}
                    onClick={() => {
                    
                      dispatch(openDialog({ type: "coinPlan" }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <Table
            data={data}
            mapData={coinPlanTable}
            serverPerPage={size}
            serverPage={page}
            // handleSelectAll={handleSelectAll}
            // selectAllChecked={selectAllChecked}
            type={"server"}
          />
          <Pagination
            type={"server"}
            activePage={page}
            rowsPerPage={size}
            // userTotal={totalUser}
            setPage={setPage}
            handleRowsPerPage={handleRowsPerPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};
export default vipPlan;
vipPlan.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
