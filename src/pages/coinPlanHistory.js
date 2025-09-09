import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import RootLayout from "../component/layout/Layout";
import Table from "../extra/Table";
import moment from "moment";

const coinPlanHistory = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [name, setName] = useState("");
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            const coinPlanHistory = JSON.parse(sessionStorage.getItem("coinPlanHistory"));
            setData(coinPlanHistory.coinPlanPurchase);
            setName(coinPlanHistory.name);
            console.log(coinPlanHistory)
        }
    }, [])

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
            Header: "uniqueId",
            body: "uniqueId",
            Cell: ({row}) => (
                <span className="text-nowrap">{row?.uniqueId || "-"}</span>
            )
        },
        {
            Header: "Price ($)",
            body: "price",
            Cell: ({ row }) => (
                <span className="  text-nowrap">{row?.price || "-"}</span>
            ),
        },
        {
            Header: "Coin",
            body: "coin",
            Cell: ({ row }) => (
                <span className="  text-nowrap">{row?.coin || "-"}</span>
                
            ),
        },
        {
            Header: "Date",
            body: "date",
            Cell: ({ row }) => (
                <span className="  text-nowrap">{moment(row?.date).format("DD/MM/YYYY")}</span>
            ),
        },
    ]

    const handleRowsPerPage = (e) => {
        setSize(e.target.value);
    }

    const handlePageChange = (e) => {
        setPage(e.target.value);
    }

  return (
    <div className="userPage">
      <div className="user-table real-user mb-3">
                <div className="align-items-center d-flex justify-content-between user-table-top" >
                    
                        <h5
                            style={{
                                fontWeight: "500",
                                fontSize: "20px",
                                marginBottom: "5px",
                                marginTop: "5px",
                            }}
                        >
                           {name}'s Coin Plan Purchase History
                        </h5>
                   
                    {/* <div className="col-12 col-sm-6 col-md-6 col-lg-6 mt-2 m-sm-0 new-fake-btn d-flex justify-content-end">
                    </div> */}
                </div>
                <div className="">
                    <Table
                        data={data}
                        mapData={coinPlanTable}
                        serverPerPage={size}
                        serverPage={page}
                        type={"server"}
                    />
                    
                </div>
            </div>
     </div>
  );
};

export default coinPlanHistory;
coinPlanHistory.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};

