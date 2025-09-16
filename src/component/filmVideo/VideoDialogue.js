import { Box, Modal, Typography } from "@mui/material";
import Button from "../../extra/Button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { closeDialog } from "../../store/dialogueSlice";
import { baseURL } from "../../util/config";
import { getVideoDetails } from "../../store/episodeListSlice";
import { setToast } from "../../util/toastServices";
import Hls from "hls.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: "13px",
  border: "1px solid #C9C9C9",
  boxShadow: 24,
  p: "19px",
};

const VideoDialogue = () => {
  const { dialogue, dialogueData } = useSelector((state) => state.dialogue);
  const { getVideo } = useSelector((state) => state.episodeList);
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [addPostOpen, setAddPostOpen] = useState(false);
  const videoRef = useRef(null);
  // const { videoData } = useSelector((state) => state?.video);

  useEffect(() => {
    dispatch(getVideoDetails(dialogueData?._id));
  }, []);

  useEffect(() => {
    console.log("dialogue: ", dialogue);
    setAddPostOpen(dialogue);
  }, [dialogue]);

  useEffect(() => {
    console.log("getVideo details:", getVideo);
  }, [getVideo]);

  useEffect(() => {
    if (getVideo?.videoUrl && videoRef.current) {
      const url = getVideo.videoUrl;
      console.log("Final video URL:", url);

      let hls;

      if (url.endsWith(".m3u8") && Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS manifest loaded");
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
          setVideoError(true);
        });
      } else {
        // For mp4 or Safari native HLS
        videoRef.current.src = url;
      }

      // ✅ cleanup on unmount/change
      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [getVideo]);

  console.log("dialogueData:", dialogueData);
  console.log("getVideo:", getVideo);

  const handleCloseAddCategory = () => {
    setAddPostOpen(false);
    dispatch(closeDialog());
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const maxLength = 10; // Number of characters to show initially
  const caption = dialogueData?.caption || "";
  return (
    <>
      <div>
        <Modal
          open={addPostOpen}
          onClose={handleCloseAddCategory}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="create-channel-model">
            <Typography
              id="modal-modal-title"
              style={{ borderBottom: "1px solid #000" }}
              variant="h6"
              component="h2"
            >
              View Video
            </Typography>

            <div className="col-12 mt-2">
              {/* <span className="fw-bold ">
                                {caption ? "Video Description" : ""}
                            </span> */}
              {/* <p className="mt-2" style={{
                                overflow: `${isExpanded ? "scroll" : ""}`,
                                height: `${isExpanded ? "200px" : ""} `,
                            }}>
                                {isExpanded
                                    ? caption
                                    : `${caption.substring(0, maxLength)}${caption.length > maxLength ? "..." : ""
                                    }`}
                            </p> */}
              {/* {caption.length > maxLength && (
                                <span className="button" onClick={toggleReadMore}>
                                    {isExpanded ? "Read Less" : "Read More"}
                                </span>
                            )} */}
            </div>

            <div className="row mt-3">
              {!videoError ? (
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  height={350}
                  style={{ objectFit: "contain", width: "100%" }}
                  onError={() => setVideoError(true)}
                />
              ) : (
                <div
                  style={{
                    height: "350px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <span>Video Not Found</span>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 d-flex justify-content-end">
              <Button
                onClick={handleCloseAddCategory}
                btnName={"Close"}
                newClass={"close-model-btn"}
              />
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};
export default VideoDialogue;
