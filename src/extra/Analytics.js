import React, { useEffect, useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import dayjs from "dayjs";
import $ from "jquery";

export default function Analytics(props) {
  const {
    analyticsStartDate,
    analyticsStartEnd,
    analyticsStartDateSet,
    analyticsStartEndSet,
    color,
    bgColor,
  } = props;

  const handleApply = (event, picker) => {
    const start = dayjs(picker.startDate).format("YYYY-MM-DD");
    const end = dayjs(picker.endDate).format("YYYY-MM-DD");
    analyticsStartDateSet(start);
    analyticsStartEndSet(end);
  };

  const [state, setState] = useState({
    start: moment().subtract(29, "days"),
    end: moment(),
  });

  const { start, end } = state;

  const handleCancel = (event , picker) => {
    picker?.element.val("");
    analyticsStartDateSet("");
    analyticsStartEndSet("");
  };

  const handleCallback = (start, end) => {
    setState({ start, end });
  };

  const label = `${start.format("DD/MM/YYYY")} - ${end.format("DD/MM/YYYY")}`;

  const startAllDate = "1970-01-01";
  const endAllDate = moment().format("YYYY-MM-DD");

  useEffect(() => {
    $("data-range-key").removeClass("active");
    $("[data-range-key='ALL']").addClass("active");
  }, []);

  return (
    <div className="d-flex my-2" style={{ width: "250px" }}>
      <DateRangePicker
        initialSettings={{
          startDate: undefined,
          endDate: undefined,
          ranges: {
            ALL: [new Date("1970-01-01"), moment().toDate()],
            Today: [moment().toDate(), moment().toDate()],
            Yesterday: [
              moment().subtract(1, "days").toDate(),
              moment().subtract(1, "days").toDate(),
            ],

            "Last 7 Days": [
              moment().subtract(6, "days").toDate(),
              moment().toDate(),
            ],
            "Last 30 Days": [
              moment().subtract(29, "days").toDate(),
              moment().toDate(),
            ],
            "This Month": [
              moment().startOf("month").toDate(),
              moment().endOf("month").toDate(),
            ],
            "Last Month": [
              moment().subtract(1, "month").startOf("month").toDate(),
              moment().subtract(1, "month").endOf("month").toDate(),
            ],
          },
        }}
        onCallback={handleCallback}
        onApply={handleApply}
      >
        <input
          type="text"
          color={color}
          readOnly
          className={`daterange float-right  mr-4  text-center ${bgColor} ${color}`}
          value={
            (analyticsStartDate === startAllDate &&
              analyticsStartEnd === endAllDate) ||
            (analyticsStartDate === "ALL" && analyticsStartEnd === "ALL")
              ? "Select Date Range"
              : moment(analyticsStartDate).format("MM/DD/YYYY") &&
                moment(analyticsStartEnd).format("MM/DD/YYYY")
              ? `${moment(analyticsStartDate).format("MM/DD/YYYY")} - ${moment(
                  analyticsStartEnd
                ).format("MM/DD/YYYY")}`
              : "Select Date Range"
          }
          style={{
            width: "85%",
            fontWeight: 500,
            cursor: "pointer",
            background: "rgb(0 0 0 / 83%)",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            fontSize: "14px",
            padding: "16px",
            borderRadius: "6px",
            border: "1px solid #e83a57",
            height: "48px ",
          }}
        />
      </DateRangePicker>
    </div>
  );
}
