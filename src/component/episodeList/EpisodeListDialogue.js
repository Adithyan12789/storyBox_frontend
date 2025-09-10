// frontend/EpisodeListDialogue.js

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
  uploadImage,
} from "../../store/episodeListSlice";
import { useRouter } from "next/router";
import Male from "../../assets/images/placeHolder.png";
import { projectName } from "../../util/config";
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
  boxShadow: "24",
};

const EpisodeListDialogue = ({ page, size }) => {
  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const { setting } = useSelector((state) => state.setting);

  const [filmList, setFilmList] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [imagePath, setImagePath] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [videoDuration, setVideoDuration] = useState(null);
  const [coin, setCoin] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoInputType, setVideoInputType] = useState("upload");
  const [videoLink, setVideoLink] = useState("");
  const [movieSeriesId, setMovieSeriesId] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = useRouter();
  const userId = query.movieSeriesId;

  useEffect(() => {
    if (dialogueData) {
      setFilmList(dialogueData?.movieSeries?.name);
      setMovieSeriesId(dialogueData?.movieSeries?._id || dialogueData?._id);
      setEpisodeNumber(
        dialogueData?.episodeNumber === 0
          ? 0
          : dialogueData?.episodeNumber || dialogueData?.totalShortVideos
      );
      setImagePath(dialogueData?.videoImage);

      if (
        dialogueData?.videoUrl &&
        !dialogueData?.videoUrl.includes("/uploads/")
      ) {
        setVideoInputType("link");
        setVideoLink(dialogueData.videoUrl);
      }
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
    setVideoLink("");

    const videoElement = document.createElement("video");
    videoElement.src = videoURL;

    videoElement.addEventListener("loadedmetadata", async () => {
      setVideoDuration(videoElement.duration);
    });

    setErrors({ ...errors, video: "" });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, image: "Please select a valid image file" });
      return;
    }

    setSelectedImage(file);
    setErrors({ ...errors, image: "" });

    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoLinkChange = (e) => {
    const link = e.target.value;
    setVideoLink(link);
    setSelectedVideo(null);
    setVideoPreviewUrl(null);

    if (link) {
      const videoElement = document.createElement("video");
      videoElement.src = link;
      videoElement.addEventListener("loadedmetadata", () => {
        setVideoDuration(videoElement.duration);
      });
      setErrors({ ...errors, video: "" });
    }
  };

  const uploadVideo = async () => {
    if (!selectedVideo) return null;
    return await uploadImageFile(selectedVideo, "episodeVideos");
  };

  const validation = () => {
    let error = {};
    let isValid = true;

    if (episodeNumber === "") {
      isValid = false;
      error["episodeNumber"] = "Please enter episode number";
    }

    // For new episodes, require video input
    if (!dialogueData && videoInputType === "upload" && !selectedVideo) {
      isValid = false;
      error["video"] = "Please upload a video";
    } else if (!dialogueData && videoInputType === "link" && !videoLink) {
      isValid = false;
      error["video"] = "Please enter a video link";
    } else if (
      videoInputType === "link" &&
      videoLink &&
      !isValidUrl(videoLink)
    ) {
      isValid = false;
      error["video"] = "Please enter a valid video URL";
    }

    // Image is required for both new and edit
    if (!selectedImage && !dialogueData?.videoImage) {
      isValid = false;
      error["image"] = "Please upload a thumbnail image";
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

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleCloseAds = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);

    setSelectedVideo(null);
    setSelectedImage(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    setVideoLink("");
    dispatch(closeDialog());
  };

  const uploadImageFile = async (file, folderName) => {
    try {
      console.log("Uploading file:", file.name, "to folder:", folderName);

      const formData = new FormData();
formData.append("folderStructure", `${projectName}/admin/${folderName}`);
  formData.append("keyName", file.name);
  formData.append("content", file);
  
      const response = await dispatch(uploadImage(formData));
      console.log("Upload response payload:", response.payload);

      // Debug: Log the entire response to see the actual structure
      console.log("Full upload response:", response);

      // Check different possible response structures
      let fileUrl;

      if (response.payload?.data?.fileUrl) {
        fileUrl = response.payload.data.fileUrl;
      } else if (response.payload?.fileUrl) {
        fileUrl = response.payload.fileUrl;
      } else if (response.payload?.data?.url) {
        fileUrl = response.payload.data.url;
      } else if (response.payload?.url) {
        fileUrl = response.payload.url;
      } else if (response.payload?.data?.imageUrl) {
        fileUrl = response.payload.data.imageUrl;
      } else if (response.payload?.imageUrl) {
        fileUrl = response.payload.imageUrl;
      }

      console.log("Extracted fileUrl:", fileUrl);

      if (response.payload && response.payload.status && fileUrl) {
        return {
          status: response.payload.status,
          fileUrl: fileUrl,
          message: response.payload.message,
        };
      }

      throw new Error(
        response.payload?.message || "Upload failed - no file URL received"
      );
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // handleProcessVideo - FIXED VERSION
  const handleProcessVideo = async () => {
    try {
      let finalVideoUrl = dialogueData?.videoUrl || "";
      let finalImage = dialogueData?.videoImage || "";

      console.log("Starting video processing...");
      console.log("Selected image:", selectedImage);
      console.log("Existing image:", dialogueData?.videoImage);

      // Process video
      if (videoInputType === "upload" && selectedVideo) {
        console.log("Uploading video...");
        const uploadedVideoData = await uploadVideo();
        if (!uploadedVideoData?.status)
          throw new Error("Failed to upload video");
        finalVideoUrl = uploadedVideoData.fileUrl;
        console.log("Video uploaded successfully:", finalVideoUrl);
      } else if (videoInputType === "link" && videoLink) {
        console.log("Using video link:", videoLink);
        finalVideoUrl = videoLink;
      }

      // Process image - REQUIRED for new episodes
      if (selectedImage) {
        console.log("Uploading image...");
        const uploadedImageData = await uploadImageFile(
          selectedImage,
          "episodeImages"
        );
        if (!uploadedImageData?.status)
          throw new Error("Failed to upload image");
        finalImage = uploadedImageData.fileUrl;
        console.log("Image uploaded successfully:", finalImage);
      } else if (!dialogueData) {
        // For new episodes, image is required
        throw new Error("Please upload a thumbnail image");
      }

      console.log("Final video URL:", finalVideoUrl);
      console.log("Final image URL:", finalImage);

      // Require both for Add mode
      if (!dialogueData) {
        if (!finalVideoUrl) throw new Error("Video is required");
        if (!finalImage) throw new Error("Image is required");
      }

      return { finalVideoUrl, finalImage };
    } catch (err) {
      console.error("Video processing error:", err);
      handleError("Video processing failed", err);
      throw err;
    }
  };

  const handleEditSubmit = async () => {
    if (validation() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const { finalVideoUrl, finalImage } = await handleProcessVideo();

        const data = {
          movieSeriesId: movieSeriesId,
          episodeNumber: episodeNumber,
          duration: videoDuration || dialogueData?.duration,
          videoImage: finalImage, // ✅ Use finalImage directly (it's already the fileUrl string)
          videoUrl: finalVideoUrl,
          shortVideoId: dialogueData?._id,
          coin: coin !== null ? coin : dialogueData?.coin,
        };

        console.log("Edit payload:", data); // Debug log

        const res = await dispatch(editVideoList(data));
        if (res?.payload?.status) {
          setToast("success", res?.payload?.message);
          handleCloseAds();
        } else {
          setToast(
            "error",
            res?.payload?.message || "Failed to update episode"
          );
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
        console.log("Starting submit process...");
        const { finalVideoUrl, finalImage } = await handleProcessVideo();

        console.log("Processed data - finalImage:", finalImage);
        console.log("Processed data - finalVideoUrl:", finalVideoUrl);

const data = {
  movieSeriesId,
  episodeNumber,
  duration: videoDuration ?? 0,
  videoImage: finalImage || "", // finalImage must be string path
  videoUrl: finalVideoUrl || "", // finalVideoUrl must be string path
  coin: coin ?? 0,
};


        console.log("Submitting payload:", data);

        const res = await dispatch(addVideoList(data));
        if (res?.payload?.status) {
          setToast("success", res?.payload?.message);
          handleCloseAds();
        } else {
          throw new Error(res?.payload?.message || "Add video failed");
        }
      } catch (err) {
        console.error("Submit error:", err);
        handleError("Failed to submit new episode", err);
      } finally {
        setIsSubmitting(false);
        dispatch(getEpisodeList({ page, size }));
        dispatch(getFilmList({ page, size }));
        dispatch(
          getFilmListVideo({
            start: page,
            limit: size,
            movieSeriesId,
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

                {/* Video Input Type Selection */}
                <div className="mt-2">
                  <label>Video Input Type</label>
                  <div className="d-flex">
                    <div className="form-check me-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="videoInputType"
                        id="uploadVideo"
                        value="upload"
                        checked={videoInputType === "upload"}
                        onChange={() => setVideoInputType("upload")}
                      />
                      <label className="form-check-label" htmlFor="uploadVideo">
                        Upload Video
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="videoInputType"
                        id="videoLink"
                        value="link"
                        checked={videoInputType === "link"}
                        onChange={() => setVideoInputType("link")}
                      />
                      <label className="form-check-label" htmlFor="videoLink">
                        Video Link
                      </label>
                    </div>
                  </div>
                </div>

                {/* Upload Video */}
                {videoInputType === "upload" && (
                  <div className="mt-2">
                    <Input
                      type="file"
                      label="Upload Video"
                      onChange={handleVideo}
                      accept="video/*"
                    />

                    <div className="col-12 d-flex justify-content-start">
                      {videoPreviewUrl && (
                        <video
                          src={videoPreviewUrl}
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
                )}

                {/* Video Link Input */}
                {videoInputType === "link" && (
                  <div className="mt-2">
                    <Input
                      type="text"
                      label="Video Link"
                      value={videoLink}
                      onChange={handleVideoLinkChange}
                      placeholder="Enter video URL (e.g., https://example.com/video.mp4)"
                    />

                    {errors?.video && (
                      <span className="error mb-2" style={{ color: "red" }}>
                        {errors?.video}
                      </span>
                    )}
                  </div>
                )}

                {/* Manual Image Upload - Required */}
                <div className="mt-2">
                  <Input
                    type="file"
                    label="Upload Thumbnail Image *"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />

                  {errors?.image && (
                    <span className="error mb-2" style={{ color: "red" }}>
                      {errors?.image}
                    </span>
                  )}
                </div>

                {/* Thumbnail Preview */}
                <div className="mt-2">
                  <label>Thumbnail Preview</label>
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
                  router?.pathname === "/filmList"
                    ? handleSubmit
                    : handleEditSubmit
                }
                btnName={isSubmitting ? "Submitting..." : "Submit"}
                type="button"
                newClass="submit-btn"
                style={{
                  borderRadius: "0.5rem",
                  width: "80px",
                  marginLeft: "10px",
                }}
                disabled={isSubmitting}
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
