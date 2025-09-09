import { Box, Modal, Typography } from '@mui/material';
import Button from '../../extra/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { closeDialog } from '../../store/dialogueSlice';
import { baseURL } from '../../util/config';
import { getVideoDetails } from '../../store/episodeListSlice';
import { setToast } from '../../util/toastServices';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: '13px',
  border: '1px solid #C9C9C9',
  boxShadow: 24,
  p: '19px',
};

const VideoDialogue = () => {
  const { dialogue, dialogueData } = useSelector((state) => state.dialogue);
  const { getVideo } = useSelector((state) => state.episodeList);
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [addPostOpen, setAddPostOpen] = useState(false);
  // const { videoData } = useSelector((state) => state?.video);

  useEffect(() => {
    dispatch(getVideoDetails(dialogueData?._id));
  }, []);

  useEffect(() => {
    setAddPostOpen(dialogue);
  }, [dialogue]);

  const handleCloseAddCategory = () => {
    setAddPostOpen(false);
    dispatch(closeDialog());
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const maxLength = 10; // Number of characters to show initially
  const caption = dialogueData?.caption || '';
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
              style={{ borderBottom: '1px solid #000' }}
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
                  controls
                  src={getVideo?.videoUrl}
                  width={0}
                  autoPlay
                  height={350}
                  style={{ objectFit: 'contain', width: 'full' }}
                  onError={() => setVideoError(true)}
                />
              ) : (
                <div
                  style={{
                    height: '350px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {' '}
                  <span>Video Not Found</span>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 d-flex justify-content-end">
              <Button
                onClick={handleCloseAddCategory}
                btnName={'Close'}
                newClass={'close-model-btn'}
              />
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};
export default VideoDialogue;
