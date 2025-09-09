import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FaHistory, FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "../assets/icons/EditBtn.svg";
import defaultImage from "../assets/images/defaultImage.png";
import RootLayout from "../component/layout/Layout";
import UserDialogue from "../component/user/UserDialogue";
import Button from "../extra/Button";
import Pagination from "../extra/Pagination";
import Table from "../extra/Table";
import ToggleSwitch from "../extra/ToggleSwitch";
import { openDialog } from "../store/dialogueSlice";
import {
  blockUser,
  getAllUsers
} from "../store/userSlice";

import { IconEdit, IconEye, IconHistory } from "@tabler/icons-react";

const UserTable = () => {
  const [multiButtonSelect, setMultiButtonSelect] = useState("User");
  const [startDate, setStartDate] = useState("All");
  const [endDate, setEndDate] = useState("All");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const { dialogueType } = useSelector((state) => state.dialogue);

  const { realUserData, totalRealUser } = useSelector((state) => state.users);

  
  // console.log(totalUsers)

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  useEffect(() => {
    setData(realUserData);
  }, [realUserData]);
  const dispatch = useDispatch();
  useEffect(() => {
    // if (search.length === 0) {
    dispatch(getAllUsers({ startDate, endDate, page, size, search: "All" }));
    // }
  }, [page, startDate]);

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };
  const router = useRouter();
  const handleRedirect = (id) => {
    router.push({
      pathname: "/viewProfile",
      query: { userId: id },
    });
  };
  const handleRedirectHistory = (id) => {
    router.push({
      pathname: "/viewProfileHistory",
      query: { userId: id },
    });
  };

  const handleIsActive = (row) => {
    
    dispatch(blockUser(row?._id));
    // .then((res) => {
    //     // console.log("resss", res)
    //     if (res?.payload?.status) {
    //         toast.success(res?.payload?.message);
    //         dispatch(getAllUsers({ startDate, endDate, page, size }));
    //     } else {
    //         toast.error(res?.payload?.message);
    //     }
    // });
  };
  const ManageUserData = useMemo(() => {
    return [
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
        Header: "User Name",
        body: "userName",
        Cell: ({ row, index }) => (
          <div
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
            // onClick={() => handleEdit(row, "manageUser")}
          >
            <img
              src={row?.profilePic === "" ? defaultImage.src : row?.profilePic}
              width="50px"
              height="50px"
              onError={(e) => {
                e.currentTarget.src = defaultImage.src;
              }}
            />
            <span
              className="text-capitalize   cursorPointer text-nowrap"
              style={{ paddingLeft: "10px" }}
            >
              {row?.name || "-"}
            </span>
            {/* <span className="text-capitalize   cursorPointer text-nowrap" style={{paddingLeft:"10px"}}>
                        {row?.email || "-"}
                    </span> */}
          </div>
        ),
      },
      {
        Header: "Unique Id",
        body: "unique id",
        Cell: ({ row }) => (
          <span className="text-capitalize cursorPointer">
            {row?.uniqueId || "-"}
          </span>
        ),
      },
      {
        Header: "Coins",
        body: "coins",
        Cell: ({ row }) => (
          <span className="text-lowercase cursorPointer">
            {row?.coin || "-"}
          </span>
        ),
      },
      {
        Header: "Plan",
        body: "plan",
        Cell: ({ row }) => (
          <span className="text-lowercase cursorPointer">
            {row?.isVipPlan ? "Vip" : "Free"}
          </span>
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
      {
        Header: "Block",
        body: "isActive",
        Cell: ({ row }) => (
          <ToggleSwitch
            value={row?.isBlock}
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
                 <IconEdit className="text-secondary" />
              }
                  onClick={() => {
                    dispatch(
                      openDialog({
                        type: "manageUsers",
                        data: row,
                      })
                    );
                  }}
             
            />
            <Button
              btnIcon={
                 <IconEye className="text-secondary" />
              }
                  onClick={() => handleRedirect(row?._id)}
            />
            <Button
              btnIcon={
                 <IconHistory className="text-secondary" />
              }
                  onClick={() => handleRedirectHistory(row?._id)}
            />
          
          </div>
        ),
      },
      // {
      //   Header: "Info",
      //   body: "info",
      //   Cell: ({ row }) => (
      //     <button
      //       className="viewbutton mx-auto"
      //       onClick={() => handleRedirect(row?._id)}
      //       style={{ background: "transparent" }}
      //     >
      //       <FaRegEye size={25} color="#e83a57" className="cursorPointer" />
      //     </button>
      //   ),
      // },
      // {
      //   Header: "History",
      //   body: "history",
      //   Cell: ({ row }) => (
      //     <button
      //       className="viewbutton mx-auto"
      //       onClick={() => handleRedirectHistory(row?._id)}
      //       style={{ background: "transparent" }}
      //     >
      //       <FaHistory size={25} color="#e83a57" className="cursorPointer" />
      //     </button>
      //   ),
      // },
    ];
  }, []);
  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  const handleSearch = (event) => {
    if (event?.key === "Enter") {
      event.preventDefault();
      const searchValue = search
        ? search.trim().toLowerCase()
        : event?.target?.value?.toLowerCase();
      if (searchValue) {
        dispatch(
          getAllUsers({
            startDate,
            endDate,
            page,
            size,
            search: searchValue,
          })
        );
      } else {
        dispatch(
          getAllUsers({
            startDate,
            endDate,
            page,
            size,
            search: "All",
          })
        );
      }
    }
  };
  return (
    <>
      {dialogueType === "manageUsers" && (
        <UserDialogue
          startDate={startDate}
          endDate={endDate}
          page={page}
          size={size}
        />
      )}

      {/* <div className="userPage">
                <div className="dashboardHeader primeHeader mb-3 p-0">
                    <NewTitle
                        dayAnalyticsShow={true}
                        setEndDate={setEndDate}
                        setStartDate={setStartDate}
                        startDate={startDate}
                        endDate={endDate}
                        titleShow={true}
                        setMultiButtonSelect={setMultiButtonSelect}
                        multiButtonSelect={multiButtonSelect}
                        name={`User`}
                    // labelData={["User", "Fake User"]}
                    />
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
                Real User
              </h5>
            </div>

            <div
              className="prime-input search-input-box searching-box m-0 undefined"
              style={{ width: "300px" }}
            >
              <input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search here..."
                className="form-input searchBarBorderr"
                onKeyPress={(e) => handleSearch(e)}
              />
            </div>
          </div>
          <Table
            data={data}
            mapData={ManageUserData}
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
            userTotal={totalRealUser}
            setPage={setPage}
            handleRowsPerPage={handleRowsPerPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};
UserTable.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
export default UserTable;
