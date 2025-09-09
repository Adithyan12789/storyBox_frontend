import { use, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserCoinHistory, getUserReferralHistory } from "../../store/userSlice"
import { useRouter } from "next/router";
import Table from "../../extra/Table";
import moment from "moment";
import Pagination from "../../extra/Pagination";
import Button from "../../extra/Button";

const ReferralHistory = ({ startDate, endDate }) => {
    const { query } = useRouter();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const dispatch = useDispatch()
    const userId = query.userId;
    const { referralHistory } = useSelector((state) => state.users)
    const [data, setData] = useState([])
    useEffect(() => {
        setData(referralHistory)
    }, [referralHistory])
    useEffect(() => {
        if (userId) {
            dispatch(getUserReferralHistory({ startDate, endDate, userId }))
        }
    }, [userId,startDate]);
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
                    <span>{row?.coin}</span>
                </div>
            ),
        },
        {
            Header: "Type",
            Cell: ({ row, index }) => (
                <>

                    <button
                        className="viewbutton mx-auto"
                    >
                       
                        <span>{row?.type === 1 ? "DAILY CHECK IN REWARD" : row?.type === 2 ? "AD VIEW REWARD" : row?.type === 3 ? "LOGIN REWARD" : row?.type === 4 ? "REFERRAL REWARD" : "COIN PLAN SUBSCRIPTION"}</span>
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
    ]

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
                            Referral History Table
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
    )
}
export default ReferralHistory