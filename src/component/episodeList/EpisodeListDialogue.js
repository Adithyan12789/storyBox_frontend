import { Box, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import { closeDialog } from "../../store/dialogueSlice";
import { getFilmList, getFilmListVideo } from "../../store/filmListSlice";
import { useEffect, useState } from "react";
import {
  addVideoList,
  editVideoList,
  getEpisodeList,
  uploadMultipleImage,
} from "../../store/episodeListSlice";
import { useRouter } from "next/router";
import Male from "../../assets/images/placeHolder.png";
import { projectName } from "../../util/config";
import { getSetting } from "../../store/settingSlice";
import { setToast } from "../../util/toastServices";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  backgroundColor: "background.paper",
  borderRadius: "5px",
  border: "1px solid #C9C9C9",
  boxShadow: "24px",
};

const EpisodeListDialogue = ({ page, size }) => {
  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const { setting } = useSelector((state) => state.setting);

  const [filmList, setFilmList] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [imagePath, setImagePath] = useState(null);
  const [videoPath, setVideoPath] = useState(""); // URL or uploaded
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [videoDuration, setVideoDuration] = useState(null);
  const [coin, setCoin] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = useRouter();
  const userId = query.movieSeriesId;

  useEffect(() => {
    if (dialogueData) {
      setFilmList(dialogueData?.movieSeries?.name);
      setEpisodeNumber(
        dialogueData?.episodeNumber === 0
          ? 0
          : dialogueData?.episodeNumber || dialogueData?.totalShortVideos
      );
      setImagePath(dialogueData?.videoImage);
      setVideoPath(dialogueData?.videoUrl || "");
      setCoin(dialogueData?.coin || 0);
    }
  }, [dialogueData]);

  const handleError = (msg, err = null) => {
    console.error(msg, err);
    setToast("error", msg);
    setErrors((prev) => ({ ...prev, submit: msg }));
    setIsSubmitting(false);
  };

  const handleVideo = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setErrors((prev) => ({ ...prev, video: "Please select a video!" }));
      return;
    }

    const videoURL = URL.createObjectURL(file);
    setVideoPreviewUrl(videoURL);
    setSelectedVideo(file);
    setVideoPath(""); // clear URL if uploading

    const videoElement = document.createElement("video");
    videoElement.src = videoURL;

    videoElement.addEventListener("loadedmetadata", async () => {
      setVideoDuration(videoElement.duration);

      const thumbnailBlob = await generateThumbnailBlob(file);
      if (thumbnailBlob) {
        const thumbnailURL = URL.createObjectURL(thumbnailBlob);
        setThumbnailPreviewUrl(thumbnailURL);
      }
    });

    setErrors({ ...errors, video: "" });
  };

  const generateThumbnailBlob = async (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        video.currentTime = 1;
      };

      video.onseeked = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      };

      const objectURL = URL.createObjectURL(file);
      video.src = objectURL;
    });
  };

  const generateThumbnailFromUrl = (url) => {
    return new Promise((resolve, reject) => {
      try {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.src = url;
        video.preload = "metadata";

        video.onloadedmetadata = () => {
          if (video.duration === Infinity || isNaN(video.duration)) {
            reject(new Error("Invalid or unsupported video URL"));
          } else {
            video.currentTime = 1;
          }
        };

        video.onseeked = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
              (blob) => {
                if (!blob) reject(new Error("Failed to generate thumbnail"));
                resolve(blob);
              },
              "image/jpeg",
              0.75
            );
          } catch (err) {
            reject(err);
          }
        };

        video.onerror = () =>
          reject(new Error("Failed to load video from URL"));
      } catch (err) {
        reject(err);
      }
    });
  };

  const uploadVideo = async () => {
    if (!selectedVideo) return null;

    const thumbnailBlob = await generateThumbnailBlob(selectedVideo);
    if (!thumbnailBlob) return null;

    const videoFileName = selectedVideo.name;
    const thumbnailFileName = `${videoFileName.replace(/\.[^/.]+$/, "")}.jpeg`;
    const thumbnailFile = new File([thumbnailBlob], thumbnailFileName, {
      type: "image/jpeg",
    });

    const formData = new FormData();
    formData.append("folderStructure", `${projectName}/admin/episodeImage`);
    formData.append("keyName", selectedVideo.name);
    formData.append("content", selectedVideo);
    formData.append("content", thumbnailFile);

    const response = await dispatch(uploadMultipleImage(formData));
    return response?.payload?.data;
  };

  const validation = () => {
    let error = {};
    let isValid = true;

    if (episodeNumber === "") {
      isValid = false;
      error["episodeNumber"] = "Please enter episode number";
    }

    if (!videoPath && !selectedVideo) {
      isValid = false;
      error["video"] = "Please upload a video or provide a link";
    }

    if (!imagePath) {
      isValid = false;
      error["image"] = "Thumbnail image is required"; // new validation
    }

    if (
      episodeNumber > setting?.freeEpisodesForNonVip &&
      (!coin || coin === null)
    ) {
      if (coin < 0) {
        isValid = false;
        error["coin"] = "Please enter valid coin";
      } else if (coin === 0) {
        isValid = false;
        error["coin"] = "Coins should not be zero";
      }
    }

    setErrors(error);
    return isValid;
  };

  const handleCloseAds = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);

    setSelectedVideo(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    dispatch(closeDialog());
  };

  const processVideoData = async () => {
    try {
      let uploadedData = null;
      let finalVideoUrl = videoPath || "";
      let finalImage = imagePath; // required now

      if (!finalImage) throw new Error("Thumbnail is required");

      // Upload video if selected
      if (selectedVideo) {
        uploadedData = await uploadVideo();
        if (!uploadedData?.status) throw new Error("Failed to upload video");
        finalVideoUrl = uploadedData.data.videoUrl;
      }

      // Upload the thumbnail image
      if (imagePath instanceof File) {
        const formData = new FormData();
        formData.append("folderStructure", `${projectName}/admin/episodeImage`);
        formData.append("keyName", imagePath.name);
        formData.append("content", imagePath);

        const resThumb = await dispatch(uploadMultipleImage(formData));
        if (resThumb?.payload?.status) {
          finalImage = resThumb.payload.data[0];
        } else {
          throw new Error("Thumbnail upload failed");
        }
      }

      if (!finalVideoUrl) throw new Error("Video URL is missing");
      if (!finalImage) throw new Error("Thumbnail is missing");
      if (!videoDuration) throw new Error("Video duration is missing");

      return { finalVideoUrl, finalImage };
    } catch (err) {
      handleError("Video processing failed", err);
      throw err;
    }
  };

  const handleEditSubmit = async () => {
    if (validation() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const { finalVideoUrl, finalImage } = await processVideoData();

        const data = {
          movieSeriesId: filmList,
          episodeNumber:
            dialogueData?.episodeNumber || dialogueData?.totalShortVideos,
          duration: videoDuration,
          videoImage: finalImage,
          videoUrl: finalVideoUrl,
          shortVideoId: dialogueData?._id,
          coin: coin,
        };

        const res = await dispatch(editVideoList(data));
        if (res?.payload?.status) {
          setToast("success", res?.payload?.message);
          handleCloseAds();
        } else {
          setToast("error", res?.payload?.message);
        }
      } catch (error) {
        setErrors({ ...errors, submit: "Failed to submit form" });
      } finally {
        setIsSubmitting(false);
        handleCloseAds();
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
      }
    }
  };
  const handleSubmit = async () => {
    if (validation() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const { finalVideoUrl, finalImage } = await processVideoData();

        if (!finalVideoUrl) throw new Error("Video URL is missing");

        const data = {
          movieSeriesId: dialogueData?._id,
          episodeNumber:
            dialogueData?.episodeNumber || dialogueData?.totalShortVideos,
          duration: videoDuration,
          videoImage: finalImage,
          videoUrl: finalVideoUrl,
          coin,
        };

        const res = await dispatch(addVideoList(data));
        if (res?.payload?.status) {
          setToast("success", res?.payload?.message);
          handleCloseAds();
        } else {
          throw new Error(res?.payload?.message || "Add video failed");
        }
      } catch (err) {
        handleError("Failed to submit new episode", err);
      } finally {
        setIsSubmitting(false);
        dispatch(getEpisodeList({ page, size }));
        dispatch(getFilmList({ page, size }));
        dispatch(
          getFilmListVideo({
            start: page,
            limit: size,
            movieSeriesId: dialogueData?._id,
          })
        );
      }
    }
  };

  return (
    <div>
      <Modal open={open}>
        <Box sx={style}>
          <div className="model-header">
            <p className="m-0">
              {router?.pathname === "/filmList"
                ? "Add Episode List"
                : "Edit Episode List"}
            </p>
          </div>
          <div className="model-body">
            <form>
              <div
                className="row sound-add-box"
                style={{ overflowX: "hidden" }}
              >
                {dialogueData?.movieSeries && (
                  <div className="mt-2">
                    <Input
                      type="text"
                      label="Film List"
                      disabled
                      value={
                        dialogueData?.name || dialogueData?.movieSeries?.name
                      }
                      style={{ backgroundColor: "#f5f5f5" }}
                    />
                  </div>
                )}
                <div className="mt-2">
                  <Input
                    type="number"
                    label="Episode Number"
                    value={episodeNumber}
                    disabled
                    style={{ backgroundColor: "#f5f5f5" }}
                  />
                  {errors?.episodeNumber && (
                    <span className="error mb-2" style={{ color: "red" }}>
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
                            coin: "Please enter valid coin",
                          });
                        } else {
                          setCoin(e.target.value);
                          setErrors({ ...errors, coin: "" });
                        }
                      }}
                      name="coin"
                      value={coin}
                    />
                    {errors?.coin && (
                      <span className="error mb-2" style={{ color: "red" }}>
                        {errors?.coin}
                      </span>
                    )}
                  </div>
                )}
                {/* Upload or Link */}
                <div className="mt-2">
                  <Input
                    type="file"
                    label="Upload Video"
                    onChange={handleVideo}
                    accept="video/*"
                  />

                  <div className="mt-3">
                    <Input
                      type="text"
                      label="Video Link (optional)"
                      placeholder="Paste video URL"
                      value={videoPath}
                      onChange={(e) => {
                        setVideoPath(e.target.value);
                        setSelectedVideo(null);
                        setVideoPreviewUrl(null);
                        setErrors({ ...errors, video: "" });
                      }}
                    />
                  </div>

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
                    <span className="error mb-2" style={{ color: "red" }}>
                      {errors?.video}
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <Input
                    type="file"
                    label="Thumbnail Image *" // mark as required
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const thumbURL = URL.createObjectURL(file);
                        setThumbnailPreviewUrl(thumbURL);
                        setImagePath(file); // mandatory now
                        setImageError(false);
                        setErrors({ ...errors, image: "" }); // clear error
                      }
                    }}
                    accept="image/*"
                  />
                  {errors?.image && (
                    <span className="error mb-2" style={{ color: "red" }}>
                      {errors?.image}
                    </span>
                  )}

                  <div className="col-12 d-flex justify-content-start mt-2">
                    {imageError || (!thumbnailPreviewUrl && !imagePath) ? (
                      <img
                        src={Male.src}
                        width={100}
                        height={150}
                        alt="Fallback Image"
                      />
                    ) : (
                      <img
                        src={
                          typeof imagePath === "string"
                            ? imagePath
                            : thumbnailPreviewUrl
                        }
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
                  router?.pathname === "/filmList"
                    ? handleSubmit
                    : handleEditSubmit
                }
                btnName={isSubmitting ? "Submitting..." : "Submit"}
                type="button"
                newClass="submit-btn"
                disabled={isSubmitting}
                style={{
                  borderRadius: "0.5rem",
                  width: "80px",
                  marginLeft: "10px",
                }}
              />
            </div>
            {errors?.submit && (
              <span className="error mb-2" style={{ color: "red" }}>
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
