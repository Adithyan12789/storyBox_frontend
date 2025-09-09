import { useEffect, useState } from "react";
import NewTitle from "../../extra/Title"
import CoinPlanHistoryPage from "../coinPlan/CoinPlanHistoryPage";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { getUserWiseCoinPlan } from "../../store/coinPlanSlice";
import { useRouter } from "next/router";
import moment from "moment";
const CoinPlanHistory = ({ startDate, endDate }) => {
    const [multiButtonSelect, setMultiButtonSelect] = useState("Coin Plan");
    const [page, setPage] = useState(1);
    const [data, setData] = useState([])
    const [size, setSize] = useState(20);
    const { query } = useRouter();
    const userId = query.userId;
    const dispatch = useDispatch();
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };
    const { userCoinPlan } = useSelector((state) => state.coinPlan)
    useEffect(() => {
        setData(userCoinPlan)
    }, [userCoinPlan])
    const handleRowsPerPage = (value) => {
        setPage(1);
        setSize(value);
    };
    useEffect(() => {
        if (userId) {
            dispatch(getUserWiseCoinPlan({ page, size, startDate, endDate, userId }))
        }
    }, [userId, page, startDate])
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
            Header: "Unique Id",
            body: "uniqueId",
            Cell: ({ row }) => (
                <span className="  text-nowrap">
                    {row?.uniqueId || "-"}
                </span>
            )
        },
        {
            Header: "Payment Gateway",
            body: "paymentGateway",
            Cell: ({ row }) => (
                <span className="  text-nowrap">
                    {row?.paymentGateway || "-"}
                </span>
            )
        },
        {
            Header: "Coin",
            body: "coin",
            Cell: ({ row }) => (
                <span className="  text-nowrap">
                    {row?.coin || "-"}
                </span>
            )
        },
        {
            Header: "Price",
            body: "price",
            Cell: ({ row }) => (
                <span className="  text-nowrap">
                    {row?.price}
                </span>
            )
        },
        {
            Header: "Date",
            body: "createdAt",
            Cell: ({ row }) => (
                <span className="  text-nowrap">
                    {moment(row?.date).format("DD/MM/YYYY")}
                </span>
            )
        },

    ]
    return (
        <>
            <div className="userPage">
                <div>
                    <div className="user-table real-user mb-3">
                        <div className="user-table-top">
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
                {/* {multiButtonSelect == "Coin Plan" && <CoinPlanHistoryPage />} */}
                {/* {multiButtonSelect == "Payment Setting" && <PaymentSettingPage />} */}
                {/* {multiButtonSelect == "Ads Setting" && <AdsSettingPage />}
                {multiButtonSelect == "Currency Setting" && <CurrencySettingPage />} */}

            </div>
        </>
    )
}
export default CoinPlanHistory