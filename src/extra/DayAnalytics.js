import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function DayAnalytics(props) {
  const { dayAnalytics, setDayAnalytics, title } = props;

  const handleChange = (event) => {
    setDayAnalytics(event.target.value);
  };

  return (
    <div className="dayAnalytics">
      <Box>
        <FormControl>
          <InputLabel id="dayAnalytics">{title}</InputLabel>
          <Select
            labelId="dayAnalytics"
            id="dayAnalytics-select"
            value={dayAnalytics}
            label={title}
            onChange={handleChange}
          >
            <MenuItem value={"today"}>Today</MenuItem>
            <MenuItem value={"yesterDay"}>YesterDay</MenuItem>
            <MenuItem value={"week"}>Week</MenuItem>
            <MenuItem value={"month"}>Month</MenuItem>
            <MenuItem value={"year"}>Year</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
