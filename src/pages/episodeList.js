import { useEffect, useMemo, useState } from "react";
import RootLayout from "../component/layout/Layout";
import Button from "../extra/Button";
import Table from "../extra/Table";
import Pagination from "../extra/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { getEpisodeList } from "../store/episodeListSlice";
import { openDialog } from "../store/dialogueSlice";
import VideoDialogue from "../component/filmVideo/VideoDialogue";
import Male from "../assets/images/placeHolder.png";
import moment from "moment";
import { CiLock, CiUnlock } from "react-icons/ci";
import EpisodeListDialogue from "../component/episodeList/EpisodeListDialogue";
import EditIcon from "../assets/icons/EditBtn.svg";
import TrashIcon from "../assets/icons/trashIcon.svg";
import Image from "next/image";
import { warning } from "../util/Alert";
import defaultPsoter from "@/assets/images/default-movie-poster.jpg";
import { deleteShortVideo } from "../store/filmListSlice";
import {
  IconEdit,
  IconLockFilled,
  IconLockOpen,
  IconTrash,
  IconVideoOff,
} from "@tabler/icons-react";

const convertMilliseconds = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  let result = [];
  if (hours > 0) result.push(`${hours}h`);
  if (minutes > 0) result.push(`${minutes}m`);
  if (seconds > 0) result.push(`${seconds}s`);

  return result.length > 0 ? result.join(" ") : "0s";
};

const episodeList = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);

  const { dialogueType } = useSelector((state) => state.dialogue);
  const { episodeList, totalUser } = useSelector((state) => state.episodeList);

  

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };
  useEffect(() => {
    setData(episodeList);
  }, [episodeList]);
  
  useEffect(() => {
    dispatch(getEpisodeList({ page, size }));
  }, [page, size]);

  const handleDeleteFilmCategory = (video) => {
    console.log("video----", video);
    const data = warning();
    const payload = {
      shortVideoId: video?._id,
      movieSeriesId: video?.movieSeries._id,
      start: page,
      limit: size,
    };
    data
      .then((res) => {
        if (res) {
          dispatch(deleteShortVideo(payload)).then(() => {
            dispatch(getEpisodeList({ page, size }));
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const EpisodeListTable = useMemo(
    () => [
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
        Header: "Video Image",
        body: "image",
        Cell: ({ row }) => {
          const [imageError, setImageError] = useState(false);
          return (
            <>
              {imageError ? (
                <img
                  src={defaultPsoter.src} // Fallback image path
                  width={75}
                  height={100}
                  alt="Fallback Image"
                />
              ) : (
                <img
                  src={row?.videoImage}
                  width={75}
                  height={100}
                  alt="Thumbnail"
                  onError={() => setImageError(true)} // Set error state
                />
              )}
            </>
          );
        },
      },
      {
        Header: "Video",
        body: "video",
        Cell: ({ row }) => {
          const [videoError, setVideoError] = useState(false);
          return (
            <>
              {!videoError ? (
                <video
                  width={75}
                  height={100}
                  // autoPlay
                  muted
                  controls
                  src={row?.videoUrl}
                  onError={() => setVideoError(true)}
                />
              ) : (
                <div className="align-items-center border d-flex justify-content-center mx-auto rounded-1" style={{ width: "75px", height: "100px" }}>
                  <IconVideoOff style={{ width: "50px", height: "50px" }}/>
                </div>
              )}
            </>
          );
        },
      },
      // {
      //     Header: "Category",
      //     body: "category",
      //     Cell: ({ row }) => (
      //         <div className="userTableImage">
      //             <span>{row?.category?.name}</span>
      //         </div>
      //     )
      // },
      {
        Header: "Movie Series",
        body: "movieSeries",
        Cell: ({ row }) => (
          <div className="userTableImage">
            <span>{row?.movieSeries?.name}</span>
          </div>
        ),
      },
      {
        Header: "Episode Number",
        body: "episode number",
        Cell: ({ row }) => (
          <div className="userTableImage">
            <span>{row?.episodeNumber}</span>
          </div>
        ),
      },
      {
        Header: "Duration (seconds)",
        body: "Duration",
        Cell: ({ row }) => (
          <div className="userTableImage">
            <span>{row?.duration}</span>
          </div>
        ),
      },
      {
        Header: "Lock Status",
        body: "isLocked",
        Cell: ({ row }) => (
          <div className="userTableImage">
            <span>
              {row?.isLocked ? (
                <IconLockFilled className="text-danger" />
              ) : (
                <IconLockOpen className="text-success" />
              )}
            </span>
          </div>
        ),
      },
      {
        Header: "Coins",
        body: "coins",
        Cell: ({ row }) => (
          <div className="">
            <span>{row?.coin}</span>
          </div>
        ),
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
        Header: "Action",
        body: "action",
        Cell: ({ row }) => (
          <div className="action-button">
            <Button
              btnIcon={<IconEdit className="text-secondary" />}
              onClick={() => {
                dispatch(
                  openDialog({
                    type: "episodeList",
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
    ],
    [data]
  );

  return (
    <>
      {/* {dialogueType == "viewVideo" && <VideoDialogue />} */}
      {dialogueType == "episodeList" && (
        <EpisodeListDialogue page={page} size={size} />
      )}
      {/* <div className="userPage">
                <div className="dashboardHeader primeHeader mb-3 p-0">
                    <NewTitle
                    />

                </div>
            </div> */}
      <div className="userPage">
        <div>
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
                  Episode List
                </h5>
              </div>
              <div
                className="col-6 d-flex justify-content-end"
                // style={{ paddingRight: "20px", paddingTop: "20px" }}
              >
                <div className="ms-auto">
                  {/* <div className="new-fake-btn d-flex ">
                                    <Button
                                        btnIcon={<AddIcon />}
                                        btnName={"New"}
                                        onClick={() => {
                                            // 
                                            dispatch(openDialog({ type: "episodeList" }));
                                        }}
                                    />
                                </div> */}
                </div>
              </div>
            </div>
            <Table
              data={data}
              mapData={EpisodeListTable}
              serverPerPage={size}
              serverPage={page}
              // handleSelectAll={handleSelectAll}
              // selectAllChecked={selectAllChecked}
              type={"server"}
            />
            <Pagination
              type={"client"}
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
export default episodeList;
episodeList.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
