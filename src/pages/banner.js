import RootLayout from "../component/layout/Layout";
import Button from "../extra/Button";
import Pagination from "../extra/Pagination";
import TrashIcon from "../assets/icons/trashIcon.svg";
import EditIcon from "../assets/icons/EditBtn.svg";
import Table from "../extra/Table";
import Title from "../extra/Title";
import ToggleSwitch from "../extra/ToggleSwitch";
import { activeBanner, deleteBanner, getBanner } from "../store/bannerSlice";
import { warning } from "../util/Alert";
import { baseURL } from "../util/config";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";

const Banner = () => {
  const { banner } = useSelector((state) => state.banner);

  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  useEffect(() => {
    dispatch(getBanner());
  }, [dispatch]);

  useEffect(() => {
    setData(banner);
  }, [banner]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteBanner = (row) => {
    
    const data = warning();
    data
      .then((res) => {
        if (res) {
          dispatch(deleteBanner(row?._id));
        }
      })
      .catch((err) => console.log(err));
  };

  const bannerTable = [
    {
      Header: "No",
      Cell: ({ index }) => <span>{page * parseInt(index) + 1}</span>,
    },
    {
      Header: "Image",
      Cell: ({ row, index }) => (
        <div className="userProfile">
          <img
            src={baseURL + row?.image}
            style={{ height: "100px", width: "200px", borderRadius: "8px" }}
            alt={`Banner`}
          />
        </div>
      ),
    },

    {
      Header: "Is Active",
      body: "isActive",
      sorting: { type: "client" },
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isActive}
          onClick={() => {
            const id = row?._id;
            
            dispatch(activeBanner(id));
          }}
        />
      ),
    },

    {
      Header: "Action",
      Cell: ({ row }) => (
        <>
          <div className="action-button">
            <Button
              btnIcon={
                <img src={EditIcon.src} alt="EditIcon" height={25} width={25} />
              }
            />

            <Button
              btnIcon={
                <img src={TrashIcon.src} alt="TrashIcon" height={27} width={27} />
              }
              onClick={() => handleDeleteBanner(row)}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      {/* {dialogueType === "banner" && <BannerDialogue />}
      {dialogueType === "editbanner" && <BannerDialogue />} */}

      <div className={`userTable`} style={{ padding: "20px" }}>
        <Title name="Banner" />

        <div className="betBox">
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 mt-2 m-sm-0 new-fake-btn px-3">
            <Button
              btnIcon={<AddIcon />}
              btnName={"New"}
              onClick={() => {
                // dispatch(openDialog({ type: "banner" }));
              }}
            />
          </div>
        </div>
        <div className="mt-3">
          <Table
            data={data}
            mapData={bannerTable}
            PerPage={size}
            Page={page}
            type={"client"}
          />
          <div className="mt-3">
            <Pagination
              type={"client"}
              activePage={page}
              rowsPerPage={size}
              userTotal={data?.length}
              setPage={setPage}
              setData={setData}
              data={data}
              actionShow={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};
Banner.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
export default Banner;
