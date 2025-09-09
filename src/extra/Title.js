import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import $ from "jquery";
import DateRangePicker from "react-bootstrap-daterangepicker";
import MultiButton from "./MultiButton";

export default function Title(props) {
  const {
    newClass,
    name,
    dayAnalyticsShow,
    titleShow,
    setStartDate,
    setEndDate,
    endDate,
    startDate,
    setMultiButtonSelect,
    multiButtonSelect,
    labelData,
    color,
    bgColor,
  } = props;


  const selectedLabelRef = useRef("");
  const [dayAnalytics, setDayAnalytics] = useState("All");

  // const handleApply = (event, picker) => {
  //   const start = dayjs(picker.startDate).format("YYYY-MM-DD");
  //   const end = dayjs(picker.endDate).format("YYYY-MM-DD");
  //   setStartDate(start);
  //   setEndDate(end);
  // };

  const handleCallback = (start, end, label) => {
    selectedLabelRef.current = label;
    setState({ start, end });
  };

  const handleApply = (event, picker) => {
    const label = selectedLabelRef.current;

    if (label === "All") {
      setStartDate("All");
      setEndDate("All");
    } else {
      const start = dayjs(picker.startDate).format("YYYY-MM-DD");
      const end = dayjs(picker.endDate).format("YYYY-MM-DD");
      setStartDate(start);
      setEndDate(end);
    }
  };




  const [isDateRangePickerVisible, setDateRangePickerVisible] = useState(false);

  const [state, setState] = useState({
    start: dayjs().subtract(29, "days"),
    end: dayjs(),
  });
  const { start, end } = state;

  const handleCancel = (event, picker) => {
    picker?.element.val("");
    setStartDate("");
    setEndDate("");
  };

  // const handleCallback = (start, end) => {
  //   setState({ start, end });
  // };




  const label = start.format("DD/MM/YYYY") + " - " + end.format("DD/MM/YYYY");

  const startAllDate = "1970-01-01";
  const endAllDate = dayjs().format("YYYY-MM-DD");

  // useEffect(() => {
  //   $(document).ready(function () {
  //     $("data-range-key").removeClass("active");
  //     $("[data-range-key='All']").addClass("active");
  //   });
  // }, []);

  const handleInputClick = () => {
    setDateRangePickerVisible(!isDateRangePickerVisible);
  };

  return (
    <>
      <div>
        <div className="row align-items-center" style={{ color: "white" }}>
          <div
            className={`text-black ${dayAnalyticsShow
              ? ` col-12 col-sm-12 col-md-12 ${titleShow ? "col-lg-6" : "col-lg-8"
              }`
              : "col-12"
              }`}
          >
            {/* <h4 className="heading-dashboard d-block">Welcome Admin !</h4> */}

            {titleShow && (
              <div className={!newClass ? `boxBetween ` : `${newClass}`}>
                <div className="title">
                  <h4
                    className="mb-0  text-capitalize text-nowrap"
                    style={{ fontSize: "20px", fontWeight: "500" }}
                  >
                    {name}
                  </h4>
                </div>
              </div>
            )}
          </div>
          {dayAnalyticsShow ? (
            <div
              className={`col-12 col-sm-12 col-md-12 col-lg-4 pl-0 ${titleShow ? "col-lg-6" : "col-lg-4"
                }`}
              style={{ paddingRight: "10px", paddingLeft: "0px" }}
            >
              <div className="dayAnalytics">
                <div className="date-range-box">
                  <DateRangePicker
                    initialSettings={{
                      startDate: undefined,
                      endDate: undefined,
                      ranges: {
                        All: ["All", "All"],
                        Today: [dayjs().toDate(), dayjs().toDate()],
                        Yesterday: [
                          dayjs().subtract(1, "days").toDate(),
                          dayjs().subtract(1, "days").toDate(),
                        ],

                        "Last 7 Days": [
                          dayjs().subtract(6, "days").toDate(),
                          dayjs().toDate(),
                        ],
                        "Last 30 Days": [
                          dayjs().subtract(29, "days").toDate(),
                          dayjs().toDate(),
                        ],
                        "This Month": [
                          dayjs().startOf("month").toDate(),
                          dayjs().endOf("month").toDate(),
                        ],
                        "Last Month": [
                          dayjs()
                            .subtract(1, "month")
                            .startOf("month")
                            .toDate(),
                          dayjs().subtract(1, "month").endOf("month").toDate(),
                        ],
                        // "Reset Dates": [new Date("1970-01-01"), dayjs().toDate()],
                      },
                      maxDate: new Date(),
                    }}
                    onCallback={handleCallback}
                    onApply={handleApply}
                  >
                    <input
                      type="text"
                      color={color}
                      readOnly
                      placeholder="Select Date Range"
                      onClick={handleInputClick}
                      className={`daterange float-right  mr-4  text-center ${bgColor} ${color}`}
                      // value={
                      //   (startDate === startAllDate &&
                      //     endDate === endAllDate) ||
                      //   (startDate === "All" && endDate === "All")
                      //     ? "Select Date Range"
                      //     : dayjs(startDate).format("MM/DD/YYYY") &&
                      //       dayjs(endDate).format("MM/DD/YYYY")
                      //     ? `${dayjs(startDate).format("MM/DD/YYYY")} - ${dayjs(
                      //         endDate
                      //       ).format("MM/DD/YYYY")}`
                      //     : "Select Date Range"
                      // }
                     value={
                        (startDate === startAllDate && endDate === endAllDate) || (startDate === "All" && endDate === "All")
                          ? "Select Date Range"
                          : dayjs(startDate).format("MM/DD/YYYY") && dayjs(endDate).format("MM/DD/YYYY")
                          ? `${dayjs(startDate).format("MM/DD/YYYY")} - ${dayjs(endDate).format("MM/DD/YYYY")}`
                          : "Select Date Range"
                      }


                      style={{
                        fontWeight: 500,
                        cursor: "pointer",
                        background: "white",
                        color: "rgba(0, 0, 0, 0.87)",
                        display: "flex",
                        width: "100%",
                        justifyContent: "end",
                        fontSize: "13px",
                        padding: "7px",
                        maxWidth: "250px",
                        borderRadius: "5px",
                        border: "1px solid #e83a57",
                      }}
                    />
                  </DateRangePicker>
                  {/* <div className="right-drp-btn">Analytics</div> */}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {multiButtonSelect && <div className="multi-user-btn ">
            <MultiButton
              multiButtonSelect={multiButtonSelect ? multiButtonSelect : ""}
              setMultiButtonSelect={
                setMultiButtonSelect ? setMultiButtonSelect : ""
              }
              label={labelData ? labelData : []}
            />
          </div>}
        </div>
      </div>
    </>
  );
}
