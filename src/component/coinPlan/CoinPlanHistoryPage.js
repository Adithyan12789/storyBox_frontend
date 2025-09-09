import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCoinPlan } from '../../store/coinPlanSlice';
import NewTitle from '../../extra/Title';
import Table from '../../extra/Table';
import Pagination from '../../extra/Pagination';
import moment from 'moment';
import { useRouter } from 'next/router';
import { getSetting } from '../../store/settingSlice';
import Button from '../../extra/Button';
import { IconHistory } from '@tabler/icons-react';
const CoinPlanHistoryPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('All');
  const [endDate, setEndDate] = useState('All');
  const [size, setSize] = useState(20);
  const { allCoinPlan, totalEarnings, total } = useSelector(
    (state) => state.coinPlan
  );
  const { setting } = useSelector((state) => state.setting);
  
  useEffect(() => {
    setData(allCoinPlan);
  }, [allCoinPlan]);
  useEffect(() => {
    dispatch(getAllCoinPlan({ startDate, endDate, page, size }));
  }, [startDate, page]);

  useEffect(() => {
     dispatch(getSetting());
  }, []);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('coinPlanHistory');
    }
  }, []);

  const handleOpen = async (row) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('coinPlanHistory', JSON.stringify(row));
      await router.prefetch('/coinPlanHistory');
      router.push(`/coinPlanHistory`);
    }
  };

  const coinPlanTable = [
    {
      Header: 'No',
      body: 'no',
      Cell: ({ index }) => (
        <span className="  text-nowrap">
          {(page - 1) * size + parseInt(index) + 1}
        </span>
      ),
    },
    {
      Header: 'Name',
      body: 'name',
      Cell: ({ row }) => (
        <span className="  text-nowrap">{row?.name || '-'}</span>
      ),
    },
    {
      Header: 'Total Purchases',
      body: 'totalPurchases',
      Cell: ({ row }) => (
        <span className="text-nowrap">{row?.totalPlansPurchased || '-'}</span>
      ),
    },
    {
      Header: 'Amount Spent',
      body: 'amountSpent',
      Cell: ({ row }) => (
        <span className="text-nowrap">{row?.totalAmountSpent || '-'}</span>
      ),
    },
    {
      Header: 'Date',
      body: 'createdAt',
      Cell: ({ row }) => (
        <span className="  text-nowrap">
          {moment(row?.createdAt).format('DD/MM/YYYY')}
        </span>
      ),
    },
    {
      Header: 'History',
      body: 'history',
      Cell: ({ row }) => (
        // <button
        //   onClick={() => handleOpen(row)}
        //   style={{
        //     border: 'none',
        //     outline: 'none',
        //     backgroundColor: 'transparent',
        //   }}
        // >
        //   <svg
        //     fill="#e83a57"
        //     width="25px"
        //     height="25px"
        //     viewBox="0 0 24 24"
        //     xmlns="http://www.w3.org/2000/svg"
        //   >
        //     <path d="M11.998 2.5A9.503 9.503 0 003.378 8H5.75a.75.75 0 010 1.5H2a1 1 0 01-1-1V4.75a.75.75 0 011.5 0v1.697A10.997 10.997 0 0111.998 1C18.074 1 23 5.925 23 12s-4.926 11-11.002 11C6.014 23 1.146 18.223 1 12.275a.75.75 0 011.5-.037 9.5 9.5 0 009.498 9.262c5.248 0 9.502-4.253 9.502-9.5s-4.254-9.5-9.502-9.5z" />
        //     <path d="M12.5 7.25a.75.75 0 00-1.5 0v5.5c0 .27.144.518.378.651l3.5 2a.75.75 0 00.744-1.302L12.5 12.315V7.25z" />
        //   </svg>
        // </button>

        <div className='action-button'>
          <Button
              btnIcon={
                <IconHistory  className="text-secondary" />
              }
              onClick={() => handleOpen(row)}
            />
        </div>
      ),
    },
  ];
  return (
    <>
      {/* <div className="userPage">
        <NewTitle
          dayAnalyticsShow={true}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          startDate={startDate}
          endDate={endDate}
        />
      </div> */}
      {/* <div> */}
        <div className="user-table real-user mb-3">
          <div className="align-items-center d-flex justify-content-between user-table-top">
            <h5
              style={{
                fontWeight: "500",
                fontSize: "20px",
                marginBottom: "5px",
                marginTop: "5px",
              }}
            >
              Coin Plan History
            </h5>
            <p className="fw-medium m-0 text-success">Admin Earnings : {totalEarnings} {setting?.currency?.symbol || "$"}</p>
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
            userTotal={total}
            setPage={setPage}
            handleRowsPerPage={handleRowsPerPage}
            handlePageChange={handlePageChange}
          />
        </div>
        
      {/* </div> */}
      {/* </div> */}
    </>
  );
};
export default CoinPlanHistoryPage;
