import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserCoinHistory } from "../../store/userSlice";
import { useRouter } from "next/router";
import Table from "../../extra/Table";
import moment from "moment";
import Pagination from "../../extra/Pagination";

const CoinHistory = ({ startDate, endDate }) => {
    const { query } = useRouter();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const dispatch = useDispatch();
    const userId = query.userId;
    const { coinHistory } = useSelector((state) => state.users);
    const [data, setData] = useState([]);
    useEffect(() => {
        setData(coinHistory);
    }, [coinHistory]);
    useEffect(() => {
        if (userId) {
            dispatch(getUserCoinHistory({ startDate, endDate, userId }));
        }
    }, [userId, startDate]);
    const coinHistoryTable = [
        {
            Header: "No",
            Cell: ({ index }) => <span>{page * parseInt(index) + 1}</span>,
        },
        {
            Header: "UniqueId",
            Cell: ({ row, index }) => (
                <div className="userProfile">
                    <span>{row?.uniqueId}</span>
                </div>
            ),
        },
        {
            Header: "Coin",
            Cell: ({ row, index }) => (
                <div className="userProfile">
                    <span style={{color: row?.type === 6 ? "#D62828" : "black"}}>{row?.type === 6 ? `-${row?.coin}` : `${row?.coin}`}</span>
                </div>
            ),
        },
        {
            Header: "Type",
            Cell: ({ row, index }) => (
                <>
                    <button
                        className="mx-auto btn fw-semibold"
                        style={{
                            backgroundColor:
                                row?.type === 1
                                    ? "#D4F6C3" // Light Green
                                    : row?.type === 2
                                    ? "#FFEFB3" // Light Yellow
                                    : row?.type === 6
                                    ? "#FFD1D9" // Light Red
                                    : row?.type === 4
                                    ? "#D0E8FF" // Light Blue
                                    : row?.type === 5
                                    ? "#e7e5ff" // Light Purple
                                    : row?.type === 3
                                    ? "#FFDEAD" // Light Orange
                                    : row?.type === 7
                                    ? "#B3E5FC" // Sky Blue
                                    : row?.type === 8
                                    ? "#E0E0E0" // Light Gray
                                    : "#EAEAEA", // Default Gray
                            color:
                                row?.type === 1
                                    ? "#008000" // Green Text
                                    : row?.type === 2
                                    ? "#D68C00" // Yellow Text
                                    : row?.type === 6
                                    ? "#D62828" // Red Text
                                    : row?.type === 4
                                    ? "#0056B3" // Blue Text
                                    : row?.type === 5
                                    ? "#8a82fb" // Purple Text
                                    : row?.type === 3
                                    ? "#FF8C00" // Orange Text
                                    : row?.type === 7
                                    ? "#0277BD" // Dark Blue Text
                                    : row?.type === 8
                                    ? "#616161" // Gray Text
                                    : "#555555", // Default Gray Text
                            borderRadius: "10px",
                            padding: "8px 16px",
                            border: "none",
                        }}
                    >
                        {row?.type === 1
                            ? "DAILY CHECK IN REWARD"
                            : row?.type === 2
                            ? "AD VIEW REWARD"
                            : row?.type === 3
                            ? "LOGIN REWARD"
                            : row?.type === 4
                            ? "REFERRAL REWARD"
                            : row?.type === 5
                            ? "COIN PLAN SUBSCRIPTION"
                            : row?.type === 6
                            ? "UNLOCK VIDEO"
                            : row?.type === 7
                            ? "AUTO UNLOCK VIDEO"
                            : row?.type === 8
                            ? "VIDEO VIEW COIN DEDUCT"
                            : "N/A"}
                    </button>
                </>
            ),
        },
        {
            Header: "Date",
            body: "date",
            Cell: ({ row }) => (
                <span className="text-capitalize cursorPointer">
                    {moment(row?.date).format("DD/MM/YYYY") || "-"}
                </span>
            ),
        },
    ];

    return (
        <>
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
                            Coin History Table
                        </h5>
                    </div>
                    <Table
                        mapData={coinHistoryTable}
                        data={data}
                        PerPage={size}
                        Page={page}
                        type={"client"}
                    />
                    <Pagination
                        type={"server"}
                        activePage={page}
                        rowsPerPage={size}
                        // userTotal={totalUser}
                        setPage={setPage}
                        // handleRowsPerPage={handleRowsPerPage}
                        // handlePageChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    );
};
export default CoinHistory;
