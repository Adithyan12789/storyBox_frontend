import { useDispatch, useSelector } from "react-redux";
import RootLayout from "../component/layout/Layout";
import { useEffect, useState } from "react";
import {
  deleteFilmCategory,
  filmCategoryActive,
  getFilmCategory,
} from "../store/filmSlice";
import NewTitle from "../extra/Title";
import Pagination from "../extra/Pagination";
import Table from "../extra/Table";
import moment from "moment";
import Button from "../extra/Button";
import EditIcon from "../assets/icons/EditBtn.svg";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import { openDialog } from "../store/dialogueSlice";
import FilmCategoryDialogue from "../component/filmCategory/FilmCategoryDialogue";
import TrashIcon from "../assets/icons/trashIcon.svg";
import { warning } from "../util/Alert";
import { toast } from "react-toastify";
import ToggleSwitch from "../extra/ToggleSwitch";
import { IconEdit, IconTrash } from "@tabler/icons-react";

const filmCategory = () => {
  const dispatch = useDispatch();
  const { dialogueType } = useSelector((state) => state.dialogue);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getFilmCategory({ page, size }));
  }, [page]);

  const { filmsCategory, total } = useSelector((state) => state.films);
  useEffect(() => {
    setData(filmsCategory);
  }, [filmsCategory]);
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };
  const handleDeleteFilmCategory = (row) => {
    const data = warning();
    data
      .then((res) => {
        if (res) {
          const id = row?._id;
          dispatch(deleteFilmCategory(id)).then((res) => {
            if (res?.payload?.status) {
              toast.success(res?.payload?.message);
              dispatch(getFilmCategory({ page, size }));
            }
          });
        }
      })
      .catch((err) => console.log(err));
  };
  const handleIsActive = (row) => {
    dispatch(filmCategoryActive(row?._id)).then((res) => {
      // console.log("resss", res)
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getFilmCategory({ page, size }));
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };
  const filmCategoryTable = [
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
      Header: "Unique Id",
      body: "unique id",
      Cell: ({ row }) => (
        <span className="text-capitalize cursorPointer">
          {row?.uniqueId || "-"}
        </span>
      ),
    },

    {
      Header: "Category Name",
      body: "categoryName",
      Cell: ({ row, index }) => (
        <span
          className="text-capitalize   cursorPointer text-nowrap"
          style={{ paddingLeft: "10px" }}
        >
          {row?.name || "-"}
        </span>
      ),
    },
    {
      Header: "Total Movies",
      body: "coins",
      Cell: ({ row }) => (
        <span className="text-lowercase    cursorPointer">
          {row?.totalMovies === 0 ? 0 : row?.totalMovies || "-"}
        </span>
      ),
    },
    // {
    //     Header: "Total Episodes",
    //     body: "plan",
    //     Cell: ({ row }) => (
    //         <span className="text-lowercase cursorPointer">{row?.totalShortVideos === 0 ? 0 : row?.totalShortVideos || "-"}</span>
    //     ),
    // },
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
            btnIcon={<IconEdit className="text-secondary" />}
            onClick={() => {
              dispatch(
                openDialog({
                  type: "filmCategory",
                  data: row,
                })
              );
            }}
          />
          <Button
            btnIcon={<IconTrash className="text-secondary" />}
            onClick={() => handleDeleteFilmCategory(row)}
          />
        </div>
      ),
    },
  ];
  return (
    <>
      {dialogueType === "filmCategory" && (
        <FilmCategoryDialogue page={page} size={size} />
      )}
      {/* <div className="userPage">
                <div className="dashboardHeader primeHeader mb-3 p-0">
                    <NewTitle
                        titleShow={true}
                    // labelData={["User", "Fake User"]}
                    />

                </div>
            </div> */}
      <div className="">
        <div className="userPage">
          <div className=" user-table real-user mb-3">
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
                  Film Category
                </h5>
              </div>
              <div className="col-6 d-flex justify-content-end">
                <div className="ms-auto">
                  <div className="new-fake-btn d-flex ">
                    <Button
                      btnIcon={<AddIcon />}
                      btnName={"New"}
                      onClick={() => {
                        dispatch(openDialog({ type: "filmCategory" }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Table
              data={data}
              mapData={filmCategoryTable}
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
        </div>
      </div>
    </>
  );
};
export default filmCategory;
filmCategory.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
