import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export default function SmallLoader(props) {
  const { uploadFilePercent } = useSelector((state) => state.dialogue);

  return (
    <div>
      {props.loaderType === "percentLoader" ? (
        <div className="loader-box-video">
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
            }}
          >
            <CircularProgress />
            {props.percentShow && (
              <Box
                sx={{
                  top: "4px",
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                >
                  {`${Math.round(uploadFilePercent)}%`}
                </Typography>
              </Box>
            )}
          </Box>
        </div>
      ) : (
        <div className="loader-box-video">
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
            }}
          >
            <CircularProgress />
          </Box>
        </div>
      )}
    </div>
  );
}
