"use client";
import RootLayout from "../component/layout/Layout";
import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import { useDispatch, useSelector } from "react-redux";
import {
  dashboardCount,
  getChartRevenue,
  getChartUser,
} from "@/store/dashSlice";
import UserTotalIcon from "../assets/icons/UserSideBarIcon.svg";
import Category from "../assets/icons/category.svg";
import ShortVideo from "../assets/icons/ShortIcon.svg";
import MovieSeries from "../assets/icons/VideoIcon.svg";
import Revenue from "../assets/icons/revenue.svg";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { IconClipboardData, IconHistory, IconMovie, IconUsers, IconVideo } from "@tabler/icons-react";
// import ReactApexChart from "react-apexcharts"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Dashboard = (props) => {
  const [startDate, setStartDate] = useState("All");
  const [endDate, setEndDate] = useState("All");
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(dashboardCount({ startDate, endDate }));
  //   dispatch(getChartUser({ startDate, endDate }));
  //   dispatch(getChartRevenue({ startDate, endDate }));
  // }, [startDate]);
  useEffect(() => {
  if (startDate && endDate) {
    dispatch(dashboardCount({ startDate, endDate }));
    dispatch(getChartUser({ startDate, endDate }));
    dispatch(getChartRevenue({ startDate, endDate }));
  }
}, [startDate, endDate]);

  const { dashCount, chartAnalyticOfRevenue, chartAnalyticOfUsers } =
    useSelector((state) => state.dashboard);
  // let dataUser = [];
  // let dataRevenue = [];
  let label = [];
  let dataUser = [];
  let dataRevenue = [];

  chartAnalyticOfUsers?.forEach((data_) => {
    const newDate = data_?._id;
    if (newDate) {
      label?.push(newDate);
      dataUser?.push(data_?.count);
    }
  });
  chartAnalyticOfRevenue?.forEach((data_) => {
    const newDate = data_?._id;
    if (newDate) {
      label?.push(newDate);
      dataRevenue?.push(data_?.count);
    }
  });

  const optionsTotal = {
    chart: {
      type: "area",
      stacked: false,
      height: "200px",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      categories: label,
      rotate: 0,
      rotateAlways: true,
      minHeight: 50,
      maxHeight: 100,
      labels: {
        offsetX: -4, // Adjust the offset vertically
        fontSize: 10,
      },
    },

    tooltip: {
      shared: true,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetX: -10,
    },
    colors: ["#e83a57", "#786D81", "#be73f6"],
  };
  // chartAnalyticOfUsers?.forEach((data_) => {
  //   const newDate = data_?._id;
  //   const date = newDate;
  //   label.push(date);
  //   dataUser.push(data_?.count || 0); // Use 0 if count is undefined
  // });
  // chartAnalyticOfRevenue?.forEach((data_) => {
  //   const newDate = data_?._id;
  //   const date = newDate;
  //   label.push(date);
  //   dataRevenue.push(data_?.count || 0); // Use 0 if count is undefined
  // });
  let labelSet = new Set(label);
  // Convert labelSet back to array and sort
  label = [...labelSet].sort((a, b) => new Date(a) - new Date(b));

  // Ensure all arrays have the same length and are aligned properly with labels
  const maxLength = label?.length;

  for (let i = 0; i < maxLength; i++) {
    if (dataUser[i] === undefined) {
      dataUser[i] = 0;
    }
    if (dataRevenue[i] === undefined) {
      dataRevenue[i] = 0;
    }
  }
  const isValidNumber = (value) => typeof value === "number" && !isNaN(value);

  // Calculate activeUserData
  const activeUserData =
    chartAnalyticOfUsers?.reduce((acc, obj) => {
      const count = obj?.count;
      return isValidNumber(count) ? acc + count : acc;
    }, 0) || 0;

  // Calculate userData
  const userData =
    chartAnalyticOfUsers?.reduce((acc, obj) => {
      const count = obj?.count;
      return isValidNumber(count) ? acc + count : acc;
    }, 0) || 0;

  // Calculate percentage
  const percentage =
    activeUserData && userData ? (activeUserData / userData) * 100 : 0;

  // Create the series data
  const seriesGradient = [percentage ? Number(percentage.toFixed(0)) : 0];

  // console.log("dashCount", dashCount)

  const totalSeries = {
    labels: label,
    dataSet: [
      {
        name: "Total User",
        data: dataUser,
      },
      {
        name: "Total Revenue",
        data: dataRevenue,
      },
    ],
  };
  const router = useRouter();

    const CustomeCard = ({ link, title, count, icon }) => {
    return (
      <div
        className="col-xl-4 col-sm-6 col-12 cursor-pointer"
        onClick={() => router.push(link)}
      >
        <div className="card">
          <div className="card-content cursor-pointer">
            <div className="card-body p-4">
              <div className="align-content-center d-flex justify-content-between media">
                <div className="media-body text-left">
                  <h3 className="warning">{count}</h3>
                  <span className="fw-medium">{title}</span>
                </div>
                <div className="align-self-center">{icon}</div>
              </div>
              <div className="progress mt-2 mb-0" style={{ height: 7 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: "50%" }}
                  aria-valuenow={50}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="dashboard "
        style={{ padding: "15px",  marginTop: "0px"}}
      >
        <div className="dashboardHeader primeHeader !mb-0 !p-0">
         <h4 className="heading-dashboard fw-semibold d-block">Welcome Admin !</h4>
          <NewTitle
            dayAnalyticsShow={true}
            titleShow={true}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
            endDate={endDate}
            name={`Dashboard`}
          />
        </div>
        <div className="dashBoardMain px-4 mt-4">
          <div className="row dashboard-count-box mt-2">
          <CustomeCard
              link={"/user"}
              title={"Total User"}
              count={dashCount?.totalUsers ? dashCount?.totalUsers : 0}
              icon={
                <IconUsers
                  className=" icon-color"
                  
                />
              }
            />
          <CustomeCard
              link={"/filmCategory"}
              title={"Total Film Category"}
              count={dashCount?.totalCategory ? dashCount?.totalCategory : 0}
              icon={
                <IconMovie
                  className=" icon-color"
                />
              }
            />
          <CustomeCard
              link={"/filmList"}
              title={"Total Short Video"}
              count={dashCount?.totalShortVideos ? dashCount?.totalShortVideos : 0}
              icon={
                <IconClipboardData
                  className=" icon-color"
                />
              }
            />
          <CustomeCard
              link={"/episodeList"}
              title={"Total Movie Series"}
              count={dashCount?.totalMovieSeries ? dashCount?.totalMovieSeries : 0}
              icon={
                <IconVideo
                   className=" icon-color"
                />
              }
            />

          <CustomeCard
              link={"/orderHistory"}
              title={"Total Revenue"}
              count={dashCount?.totalRevenue ? dashCount?.totalRevenue : 0}
              icon={
                <IconHistory
                  className=" icon-color"
                />
              }
            />


          </div>
          <div className="dashboard-analytics">
            <h6 className="heading-dashboard">Data Analytics</h6>
            <div className="row dashboard-chart justify-content-between">
              <div
                className="col-lg-12 col-md-12 col-sm-12 mt-lg-0 mt-4 dashboard-chart-box"
                style={{ position: "relative" }}
              >
                <div
                  id="chart"
                  className="dashboard-user-count"
                  style={{ height: "100%" }}
                >
                  <div className="mt-3">
                    {/* <Chart
                      options={optionsTotal}
                      series={
                        totalSeries.dataSet.length >= 1
                          ? totalSeries.dataSet
                          : ""
                      }
                      type="area"
                      height={"380px"}
                    /> */}
                    <Chart
                      options={{...optionsTotal,  tooltip: {
                        theme: "light",
                        style: {
                          fontSize: "14px",
                          color: "#000000",
                        },
                      },}}
                      series={
                        totalSeries.dataSet.length > 1
                          ? totalSeries.dataSet
                          : [{ data: [] }]
                      }
                      type="area"
                      height="380px"
                    />
                  </div>
                </div>
              </div>
              {/* <div className="col-lg-3 col-md-12  col-sm-12 mt-3 mt-lg-0 dashboard-total-user">
                <div className="user-activity">
                  <h6
                    style={{
                      color: "#000000",
                      fontWeight: "600",
                      fontSize: "22px",
                    }}
                  >
                    Total User Activity
                  </h6>
                  <div
                    id="chart"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <ReactApexChart
                      options={optionsGradient}
                      series={seriesGradient}
                      type="radialBar"
                      width={380}
                      height={"300px"}
                    />
                  </div>
                  <div className="total-user-chart">
                    <span></span>
                    <h5>Total User</h5>
                  </div>
                  <div className="total-active-chart">
                    <span></span>
                    <h5>Total Block User</h5>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Dashboard.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default Dashboard;
