import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import EditIcon from "../../assets/icons/EditBtn.svg";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import Button from "../../extra/Button";
import Searching from "../../extra/Searching";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import { allUsers, blockUser, deleteUser } from "../../store/userSlice";
// import { openDialog } from "../../store/dialogSlice";
import { warning } from "../../util/Alert";
import { baseURL } from "@/util/config";
import { useRouter } from "next/router";
import useClearSessionStorageOnPopState from "../../extra/ClearStorage";

const FakeUser = ({ startDate, endDate, setMultiButtonSelect }) => {
  // const { dialogueData } = useSelector((state: RootStore) => state.dialogue);

  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [actionPagination, setActionPagination] = useState("delete");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [search, setSearch] = useState("");
  const { fakeUserData, totalFakeUser } = useSelector(
    (state) => state.user
  );
  useClearSessionStorageOnPopState("multiButton");

  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(fakeUserData);
  }, [fakeUserData]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const handleEdit = (row, type) => {
    

    dispatch(openDialog({ type: type, data: row }));

    router.push({
      pathname: "/viewProfile",
      query: { id: row?._id },
    });

    localStorage.removeItem("multiButton");

    localStorage.setItem("postData", JSON.stringify(row));
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    
    setSelectAllChecked(checked);
    if (checked) {
      setSelectCheckData([...data]);
    } else {
      setSelectCheckData([]);
    }
  };

  const paginationSubmitButton = () => {
    
    const selectCheckDataGetId = selectCheckData?.map((item) => item?._id);
    const isActiveData = fakeUserData?.filter((user) => {
      return (
        user.isBlock === false &&
        selectCheckData.some((ele) => ele._id === user._id)
      );
    });
    const deActiveData = fakeUserData?.filter((user) => {
      return (
        user.isBlock === true &&
        selectCheckData.some((ele) => ele._id === user._id)
      );
    });

    const getId = isActiveData?.map((item) => item?._id);
    const getId_ = deActiveData?.map((item) => item?._id);
    if (actionPagination === "block") {
      const data = true;
      const payload = {
        id: getId,
        data: data,
      };
      dispatch(blockUser(payload));
    } else if (actionPagination === "unblock") {
      const data = false;
      const payload = {
        id: getId_,
        data: data,
      };
      dispatch(blockUser(payload));
    } else if (actionPagination === "delete") {
      const getIdFind = selectCheckDataGetId?.join(",");
      const data = warning();
      data
        .then((res) => {
          if (res) {
            const payload = {
              id: getIdFind,
            };
            dispatch(deleteUser(payload));
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleRedirect = (row) => {
    localStorage.setItem("postData", JSON.stringify(row));
    localStorage.removeItem("multiButton");
    router.push({
      pathname: "/viewProfile",
      query: { id: row?._id },
    });
  };

  const ManageUserData = [
    {
      Header: "NO",
      body: "no",
      Cell: ({ index }) => (
        <span className="  text-nowrap">
          {(page - 1) * size + parseInt(index) + 1}
        </span>
      ),
    },
    {
      Header: "Unique id",
      body: "id",
      Cell: ({ row }) => (
        <span className="text-capitalize    cursorPointer">
          {row?.uniqueId}
        </span>
      ),
    },
    {
      Header: "User",
      body: "name",
      Cell: ({ row, index }) => (
        <div
          className="d-flex align-items-center "
          style={{ cursor: "pointer" }}
          onClick={() => handleRedirect(row)}
        >
          {row?.image && (
            <img src={baseURL + row?.image} width="50px" height="50px" />
          )}
          <span className="text-capitalize ms-3  cursorPointer text-nowrap">
            {row?.name}
          </span>
        </div>
      ),
    },

    {
      Header: "User name",
      body: "userName",
      Cell: ({ row }) => (
        <span className="text-lowercase    cursorPointer">{row?.userName}</span>
      ),
    },
    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={
              <img src={EditIcon.src} alt="Edit Icon" width={25} height={25} />
            }
            onClick={() => handleEdit(row, "manageUser")}
          />
          <Button
            btnIcon={
              <img src={TrashIcon.src} alt="Trash Icon" width={25} height={25} />
            }
            onClick={() => handleDeleteUser(row)}
          />
        </div>
      ),
    },

    {
      Header: "View",
      body: "View",
      Cell: ({ row }) => (
        <>
          <button
            className="viewbutton mx-auto"
            onClick={() => handleRedirect(row)}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              stroke-linejoin="round"
              className="css-i6dzq1"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>View</span>
          </button>
        </>
      ),
    },
  ];

  useEffect(() => {
    const payload = {
      type: "fakeUser",
      start: page,
      limit: size,
      startDate,
      endDate,
    };
    dispatch(allUsers(payload));
  }, [startDate, endDate, page, size]);

  const handleIsActive = (row) => {
    
    const id = row?._id;
    const data = row?.isBlock === false ? true : false;
    const payload = { id, data };
    dispatch(blockUser(payload));
  };

  const handleDeleteUser = (row) => {
    
    const data = warning();
    data
      .then((res) => {
        if (res) {
          const payload = {
            id: row?._id,
            data: row?.userName,
          };
          dispatch(deleteUser(payload));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  return (
    <div>
      <div className="user-table real-user mb-3">
        <div className="user-table-top">
          <div className="row">
            <div className="col-6">
              <h5
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                User Table
              </h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <div className=" mt-2">
                <div className="new-fake-btn d-flex ">
                  <Button
                    btnIcon={<AddIcon />}
                    btnName={"New"}
                    onClick={() => {
                      // dispatch(openDialog({ type: "fakeUser" }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <Searching
            label={"Search for ID, Keyword,  Username"}
            placeholder={"Search..."}
            data={fakeUserData}
            type={"client"}
            setData={setData}
            onFilterData={handleFilterData}
            searchValue={search}
            actionPagination={actionPagination}
            setActionPagination={setActionPagination}
            paginationSubmitButton={paginationSubmitButton}
            actionShow={false}
            customSelectDataShow={true}
          />
        </div>
        <Table
          data={data}
          mapData={ManageUserData}
          serverPerPage={size}
          serverPage={page}
          handleSelectAll={handleSelectAll}
          selectAllChecked={selectAllChecked}
          type={"server"}
        />
        <Pagination
          type={"server"}
          activePage={page}
          rowsPerPage={size}
          userTotal={totalFakeUser}
          setPage={setPage}
          handleRowsPerPage={handleRowsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default FakeUser;
