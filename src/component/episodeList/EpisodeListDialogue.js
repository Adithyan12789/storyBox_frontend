import { Box, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../extra/Input';
import Button from '../../extra/Button';
import { closeDialog, loaderOff } from '../../store/dialogueSlice';
import { getFilmList, getFilmListVideo } from '../../store/filmListSlice';
import { useEffect, useState } from 'react';
import {
  addVideoList,
  editVideoList,
  getEpisodeList,
  getEpisodeNumber,
  uploadMultipleImage,
} from '../../store/episodeListSlice';
import { useRouter } from 'next/router';
import Male from '../../assets/images/placeHolder.png';
import Image from 'next/image';
import { projectName } from '../../util/config';
import { getSetting } from '../../store/settingSlice';
import { setToast } from '../../util/toastServices';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  backgroundColor: 'background.paper',
  borderRadius: '5px',
  border: '1px solid #C9C9C9',
  boxShadow: '24px',
  // padding: '19px',
};

const EpisodeListDialogue = ({ page, size }) => {
  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const { setting } = useSelector((state) => state.setting);
  const [filmList, setFilmList] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [imagePath, setImagePath] = useState(null);
  const [videoPath, setVideoPath] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [videoDuration, setVideoDuration] = useState(null);
  const [coin, setCoin] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const { query } = useRouter();

  const userId = query.movieSeriesId;
  

  // useEffect(() => {
  //     dispatch(getFilmList({ page, size }));
  //     dispatch(getSetting());
  // }, [page]);

  useEffect(() => {
    if (dialogueData) {
      setFilmList(dialogueData?.movieSeries?.name);
      setEpisodeNumber(
        dialogueData?.episodeNumber === 0
          ? 0
          : dialogueData?.episodeNumber || dialogueData?.totalShortVideos
      );
      setImagePath(dialogueData?.videoImage);
      setVideoPath(dialogueData?.videoUrl);
      setCoin(dialogueData?.coin || 0);
    }
  }, [dialogueData]);

  const handleVideo = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        video: 'Please select a video!',
      }));
      return;
    }

    // Create preview URL for video
    const videoURL = URL.createObjectURL(file);

    setVideoPreviewUrl(videoURL);
    setSelectedVideo(file);

    // Get video duration and generate thumbnail preview
    const videoElement = document.createElement('video');
    videoElement.src = videoURL;

    videoElement.addEventListener('loadedmetadata', async () => {
      const durationInSeconds = videoElement.duration;
      setVideoDuration(durationInSeconds);

      const thumbnailBlob = await generateThumbnailBlob(file);
      if (thumbnailBlob) {
        const thumbnailURL = URL.createObjectURL(thumbnailBlob);
        setThumbnailPreviewUrl(thumbnailURL);
      }
    });

    setErrors({ ...errors, video: '' });
  };

  const generateThumbnailBlob = async (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        video.currentTime = 1;
      };

      video.onseeked = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg');
      };

      const objectURL = URL.createObjectURL(file);
      video.src = objectURL;
    });
  };

  const uploadVideo = async () => {
    if (!selectedVideo) return null;

    const thumbnailBlob = await generateThumbnailBlob(selectedVideo);
    if (!thumbnailBlob) return null;

    const videoFileName = selectedVideo.name;
    const thumbnailFileName = `${videoFileName.replace(/\.[^/.]+$/, '')}.jpeg`;
    const thumbnailFile = new File([thumbnailBlob], thumbnailFileName, {
      type: 'image/jpeg',
    });

    const formData = new FormData();
    formData.append('folderStructure', `${projectName}/admin/episodeImage`);
    formData.append('keyName', selectedVideo.name);
    formData.append('content', selectedVideo);
    formData.append('content', thumbnailFile);

    const response = await dispatch(uploadMultipleImage(formData));
    return response?.payload?.data;
  };

  const validation = () => {
    let error = {};
    let isValid = true;

    if (episodeNumber === '') {
      isValid = false;
      error['episodeNumber'] = 'Please enter episode number';
    }

    if (!videoPath && !selectedVideo) {
      isValid = false;
      error['video'] = 'Please enter video';
    }

    if (
      episodeNumber > setting?.freeEpisodesForNonVip &&
      (!coin || coin === null)
    ) {
      if (coin < 0) {
        isValid = false;
        error['coin'] = 'Please enter valid coin';
      } else if (coin === 0) {
        isValid = false;
        error['coin'] = 'Coins should not be zero';
      }
    }

    setErrors(error);
    return isValid;
  };

  const handleCloseAds = () => {
    // Cleanup preview URLs
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);

    setSelectedVideo(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    dispatch(closeDialog());
  };

  const handleEditSubmit = async () => {
    
    if (validation() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        let uploadedData = null;
        if (selectedVideo) {
          uploadedData = await uploadVideo();
          if (!uploadedData?.status) {
            throw new Error('Failed to upload video');
          }
        }
        const data = {
          movieSeriesId: filmList,
          episodeNumber:
            dialogueData?.episodeNumber || dialogueData?.totalShortVideos,
          duration: videoDuration,
          videoImage: uploadedData ? uploadedData.data.videoImage : imagePath,
          videoUrl: uploadedData ? uploadedData.data.videoUrl : videoPath,
          shortVideoId: dialogueData?._id,
          coin: coin,
        };
        // Uncomment these lines when ready to implement
        const res = await dispatch(editVideoList(data));
        if (res?.payload?.status) {
          // dispatch(
          //     getFilmListVideo({
          //         start: page,
          //         limit: size,
          //         movieSeriesId: dialogueData?._id,
          //     })
          // );
          setToast('success', res?.payload?.message);
          handleCloseAds();
          // dispatch(getEpisodeList({ page, size }));
        } else {
          setToast('error', res?.payload?.message);
        }
      } catch (error) {
        setErrors({ ...errors, submit: 'Failed to submit form' });
      } finally {
        setIsSubmitting(false);
        handleCloseAds();
        // setTimeout(() => {
        dispatch(getEpisodeList({ page, size }));
        dispatch(getFilmList({ page, size }));
        if (userId) {
          dispatch(
            getFilmListVideo({
              start: page,
              limit: size,
              movieSeriesId: userId,
            })
          );
        }
        // }, 1000);
      }
    }
  };

  const handleSubmit = async () => {
    
    if (validation() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        let uploadedData = null;
        if (selectedVideo) {
          uploadedData = await uploadVideo();
          if (!uploadedData?.status) {
            throw new Error('Failed to upload video');
          }
        }
        const data = {
          movieSeriesId: dialogueData?._id,
          episodeNumber:
            dialogueData?.episodeNumber || dialogueData?.totalShortVideos,
          duration: videoDuration,
          videoImage: uploadedData ? uploadedData.data.videoImage : imagePath,
          videoUrl: uploadedData ? uploadedData.data.videoUrl : videoPath,
          coin: coin,
        };
        // Uncomment these lines when ready to implement
        const res = await dispatch(addVideoList(data));
        if (res?.payload?.status) {
          setToast('success', res?.payload?.message);
          handleCloseAds();
          // dispatch(getEpisodeList({ page, size }));
        } else {
          setToast('error', res?.payload?.message);
        }
      } catch (error) {
        setErrors({ ...errors, submit: 'Failed to submit form' });
      } finally {
        setIsSubmitting(false);
        handleCloseAds();
        // setTimeout(() => {
        dispatch(getEpisodeList({ page, size }));
        dispatch(getFilmList({ page, size }));
        dispatch(
          getFilmListVideo({
            start: page,
            limit: size,
            movieSeriesId: dialogueData?._id,
          })
        );
        // }, 1000)
      }
    }
  };

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="">
          <div className="model-header">
            <p className="m-0">
             {router?.pathname === '/filmList'
              ? 'Add Episode List'
              : 'Edit Episode List'}
            </p>
          </div>
           <div className="model-body">

          <form>
            <div className="row sound-add-box" style={{ overflowX: 'hidden' }}>
              {dialogueData?.movieSeries && (
                <div className="mt-2">
                  <Input
                    type="text"
                    label="Film List"
                    disabled
                    value={
                      dialogueData?.name || dialogueData?.movieSeries?.name
                    }
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </div>
              )}
              <div className="mt-2">
                <Input
                  type="number"
                  label="Episode Number"
                  onChange={(e) => {
                    setEpisodeNumber(e.target.value);
                    setErrors({
                      ...errors,
                      episodeNumber: '',
                    });
                  }}
                  name="episodeNumber"
                  value={episodeNumber}
                  disabled
                  style={{ backgroundColor: '#f5f5f5' }}
                />
                {errors?.episodeNumber && (
                  <span
                    className="error mb-2"
                    style={{
                      fontSize: '15px',
                      color: 'red',
                    }}
                  >
                    {errors?.episodeNumber}
                  </span>
                )}
              </div>
              {episodeNumber > setting?.freeEpisodesForNonVip && (
                <div className="mt-2">
                  <Input
                    type="number"
                    label="Coin"
                    onChange={(e) => {
                      if (e.target.value < 0) {
                        setErrors({
                          ...errors,
                          coin: 'Please enter valid coin',
                        });
                      } else {
                        setCoin(e.target.value);
                        setErrors({
                          ...errors,
                          coin: '',
                        });
                      }
                    }}
                    name="coin"
                    value={coin}
                  />
                  {errors?.coin && (
                    <span
                      className="error mb-2"
                      style={{
                        fontSize: '15px',
                        color: 'red',
                      }}
                    >
                      {errors?.coin}
                    </span>
                  )}
                </div>
              )}
              <div className="mt-2">
                <Input
                  type="file"
                  label="video"
                  onChange={handleVideo}
                  accept="video/*"
                />
                <div className="col-12 d-flex justify-content-start">
                  {(videoPreviewUrl || videoPath) && (
                    <video
                      src={videoPreviewUrl || videoPath}
                      controls
                      className="mt-3 rounded float-left mb-2"
                      height="100px"
                      width="100px"
                    />
                  )}
                </div>
                {errors?.video && (
                  <span
                    className="error mb-2"
                    style={{
                      fontSize: '15px',
                      color: 'red',
                    }}
                  >
                    {errors?.video}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <div className="col-12 d-flex justify-content-start">
                  {imageError || (!thumbnailPreviewUrl && !imagePath) ? (
                    <img
                      src={Male.src}
                      width={100}
                      height={150}
                      alt="Fallback Image"
                    />
                  ) : (
                    <img
                      src={thumbnailPreviewUrl || imagePath}
                      width={100}
                      height={150}
                      alt="Thumbnail"
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>
              </div>

              
            </div>
          </form>
           </div>
            <div className="model-footer">
                  <div className="m-3 d-flex justify-content-end">
                <Button
                  onClick={handleCloseAds}
                  btnName="Close"
                  newClass="close-model-btn"
                  disabled={isSubmitting}
                />
                <Button
                  onClick={
                    router?.pathname === '/filmList'
                      ? handleSubmit
                      : handleEditSubmit
                  }
                  btnName={isSubmitting ? 'Submitting...' : 'Submit'}
                  type="button"
                  newClass="submit-btn"
                  disabled={isSubmitting}
                  style={{
                    borderRadius: '0.5rem',
                    width: '80px',
                    marginLeft: '10px',
                  }}
                />
              </div>
              {errors?.submit && (
                <span
                  className="error mb-2"
                  style={{ fontSize: '15px', color: 'red' }}
                >
                  {errors?.submit}
                </span>
              )}
            </div>
        </Box>
      </Modal>
    </div>
  );
};

export default EpisodeListDialogue;
