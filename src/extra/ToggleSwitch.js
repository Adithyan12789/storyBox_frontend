import * as React from "react";
import Switch from "@mui/material/Switch";

export default function ToggleSwitch(props) {
  return (
    <>
      <label className="switch me-2">
        <Switch
          checked={props.value}
          onChange={props.onChange}
          inputProps={{ "aria-label": "controlled" }}
          onClick={props.onClick}
          style={{
            cursor: "pointer",
            color:
              "#fff",
          }}
          disabled={props.disabled}
        />
      </label>
    </>
  );
}
