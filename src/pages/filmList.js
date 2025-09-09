import { useDispatch, useSelector } from "react-redux";
import RootLayout from "../component/layout/Layout";
import Button from "../extra/Button";
import Pagination from "../extra/Pagination";
import Table from "../extra/Table";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import {
  deleteFilm,
  filmListActive,
  filmListBanner,
  filmListTrending,
  getFilmList,
} from "../store/filmListSlice";
import femalImage from "../assets/images/8.jpg";
import moment from "moment";
import ToggleSwitch from "../extra/ToggleSwitch";
import { toast } from "react-toastify";
import EditIcon from "../assets/icons/EditBtn.svg";
import TrashIcon from "../assets/icons/trashIcon.svg";
import Image from "next/image";
import { openDialog } from "../store/dialogueSlice";
import FilmListDialogue from "../component/filmList/FilmListDialogue";
import { useRouter } from "next/router";
import { CiVideoOn } from "react-icons/ci";
import EpisodeListDialogue from "../component/episodeList/EpisodeListDialogue";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import Male from "../assets/images/placeHolder.png";
import { warning } from "../util/Alert";
import { getSetting } from "../store/settingSlice";
import defaultMoviePoster from "../assets/images/default-movie-poster.jpg";
import { setToast } from "../util/toastServices";
import { IconEdit, IconEye, IconTrash, IconVideoPlus } from "@tabler/icons-react";

const filmList = () => {
  const dispatch = useDispatch();
  const { dialogueType } = useSelector((state) => state.dialogue);

  const [page, setPage] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);
  const { filmsList, totalUser } = useSelector((state) => state.filmsList);
  

  useEffect(() => {
     dispatch(getSetting());
  }, []);

  useEffect(() => {
    dispatch(getFilmList({ page, size }));
  }, [page]);

  useEffect(() => {
    setData(filmsList);
  }, [filmsList]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };
  const [expandedRows, setExpandedRows] = useState({});

  const handleToggleDescription = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const handleIsActive = (row) => {
    
    dispatch(filmListActive(row?._id)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getFilmList({ page, size }));
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };
  const handleIsBanner = (row) => {
    
    dispatch(filmListBanner(row?._id)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getFilmList({ page, size }));
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };
  const handleIsTrending = (row) => {
    
    dispatch(filmListTrending(row?._id)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getFilmList({ page, size }));
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };
  const router = useRouter();
  const handleRedirect = (id) => {
    router.push({
      pathname: "/ViewShortVideo",
      query: { movieSeriesId: id },
    });
  };

  const handleDeleteFilm = (row) => {
    // 
    const data = warning();
    data.then((res) => {
      if (res) {
        dispatch(deleteFilm(row?._id)).then((res) => {
          console.log(res);
          if (res?.payload.status) {
            setToast("success", res?.payload.message);
          } else {
            setToast("error", res?.payload.message);
          }
          setTimeout(() => {
            dispatch(getFilmList({ page, size }));
          }, 1000);
        });
      }
    });
  };

  const filmListTable = [
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
      Header: "Image",
      body: "images",
      Cell: ({ row }) => {
        const [imageError, setImageError] = useState(false);

        return (
          <>
            <img
              src={row?.thumbnail}
              width={75}
              height={100}
              alt="Thumbnail"
              onError={(e) => {
                e.target.src = defaultMoviePoster.src;
              }}
            />
          </>
        );
      },
    },
    {
      Header: "Category",
      body: "category",
      Cell: ({ row, index }) => (
        <span
          className="text-capitalize   cursorPointer text-nowrap"
          style={{ paddingLeft: "10px" }}
        >
          {row?.category || "-"}
        </span>
      ),
    },
    {
      Header: "Name",
      body: "Name",
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
      Header: "Description",
      body: "description",
      Cell: ({ row, index }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const toggleExpand = () => setIsExpanded(!isExpanded);

        return (
          <div
            className="text-capitalize cursorPointer text-nowrap"
            style={{ paddingLeft: "10px" }}
          >
            <span
              style={{
                display: "block",
                whiteSpace: isExpanded ? "normal" : "nowrap",
              }}
            >
              {isExpanded
                ? row?.description || "-"
                : (row?.description || "-").slice(0, 50)}
            </span>
            {row?.description && row.description.length > 50 && (
              <span
                onClick={toggleExpand}
                style={{ color: "#e83a57", cursor: "pointer" }}
              >
                {isExpanded ? "Show Less" : "Show More"}
              </span>
            )}
          </div>
        );
      },
    },
    {
      Header: "Date",
      body: "date",
      Cell: ({ row }) => (
        <span className="text-capitalize cursorPointer">
          {moment(row?.releaseDate).format("DD/MM/YYYY") || "-"}
        </span>
      ),
    },
    {
      Header: "Total Episodes",
      body: "plan",
      Cell: ({ row }) => (
        <span className="text-lowercase cursorPointer">
          {row?.totalShortVideos === 0 ? 0 : row?.totalShortVideos || "-"}
        </span>
      ),
    },
    {
      Header: "Max Ads For Free View",
      body: "maxAdsForFreeView",
      Cell: ({ row }) => (
        <span className="text-lowercase cursorPointer">
          {row?.maxAdsForFreeView || "-"}
        </span>
      ),
    },
    {
      Header: "Banner",
      body: "isBanner",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isAutoAnimateBanner}
          onChange={() => handleIsBanner(row)}
        />
      ),
    },
    {
      Header: "Trending",
      body: "isTrending",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isTrending}
          onChange={() => handleIsTrending(row)}
        />
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
      Header: "Add Episode",
      body: "episode",
      Cell: ({ row }) => (
        <div className="action-button">
          {/* <MdOutlineCreateNewFolder
            
            size={25}
            color="#e83a57"
            style={{ cursor: "pointer" }}
          /> */}

          <Button
            btnIcon={<IconVideoPlus className="text-secondary" />}
            onClick={() => {
              dispatch(openDialog({ type: "episodeList", data: row }));
            }}
          />
        </div>
      ),
    },

    {
      Header: "View Episodes",
      body: "episodes",
      Cell: ({ row }) => (
        <div className="action-button">
          {/* <CiVideoOn
            onClick={() => handleRedirect(row?._id)}
            size={25}
            color="#e83a57"
            style={{ cursor: "pointer" }}
          /> */}
          <Button
            btnIcon={<IconEye className="text-secondary" />}
            onClick={() => handleRedirect(row?._id)}
          />
        </div>
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
                      type: "filmList",
                      data: row,
                    })
                  );
                }}
          />
          <Button
            btnIcon={<IconTrash className="text-secondary" />}
            onClick={() => {
              
              handleDeleteFilm(row);
            }}
          />
        </div>
      ),
    },
  ];
  return (
    <>
      {dialogueType === "filmList" && (
        <FilmListDialogue page={page} size={size} />
      )}
      {dialogueType == "episodeList" && (
        <EpisodeListDialogue page={page} size={size} />
      )}
      {/* <div className="userPage">
                <div className="dashboardHeader primeHeader mb-3 p-0">
                    <NewTitle
                        titleShow={true}
                    // labelData={["User", "Fake User"]}
                    />

                </div>
            </div> */}

      <div className="userPage">
        <div>
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
                  Film List
                </h5>
              </div>
              <div className="col-6 d-flex justify-content-end">
                <div className="ms-auto">
                  <div className="new-fake-btn d-flex ">
                    <Button
                      btnIcon={<AddIcon />}
                      btnName={"New"}
                      onClick={() => {
                        dispatch(openDialog({ type: "filmList" }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Table
              data={data}
              mapData={filmListTable}
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
              userTotal={totalUser}
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
export default filmList;
filmList.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
