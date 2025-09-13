import { Box, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../../store/dialogueSlice";
import { getFilmActiveCategory } from "../../store/filmSlice";
import { toast } from "react-toastify";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import Selector from "../../extra/Selector";
import Male from "../../assets/images/placeHolder.png";
import {
  addFilmList,
  editFilmList,
  getFilmList,
  uploadImage,
} from "../../store/filmListSlice";
import { style } from "../../util/commonData";


const FilmListDialogue = ({ page, size }) => {
  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  console.log(dialogueData ? true : false, "dialogueData");
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [maxAdsForFreeView, setMaxAdsForFreeView] = useState(0);
  // Separate state for poster and banner
  const [posterImagePath, setPosterImagePath] = useState(null);
  const [posterSelectedFile, setPosterSelectedFile] = useState(null);
  const [posterImagePreviewUrl, setPosterImagePreviewUrl] = useState(null);
  const [posterImageError, setPosterImageError] = useState(false);

  const [bannerImagePath, setBannerImagePath] = useState(null);
  const [bannerSelectedFile, setBannerSelectedFile] = useState(null);
  const [bannerImagePreviewUrl, setBannerImagePreviewUrl] = useState(null);
  const [bannerImageError, setBannerImageError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const handleCloseAds = () => {
    dispatch(closeDialog());
  };

  useEffect(() => {
    dispatch(getFilmActiveCategory());
  }, []);

  const { filmsActiveCategory } = useSelector((state) => state.films);

  const [errors, setErrors] = useState({});
  const [type, setType] = useState("");

  const validation = () => {
    let error = {};
    let isValid = true;
    if (!name) {
      isValid = false;
      error["name"] = "Please enter name";
    }
    if (!description) {
      isValid = false;
      error["description"] = "Please enter description";
    }
    if (!posterImagePath && !posterSelectedFile) {
      isValid = false;
      error["posterImage"] = "Please select a poster image";
    }
    if (!bannerImagePath && !bannerSelectedFile) {
      isValid = false;
      error["bannerImage"] = "Please select a banner image";
    }
    if (!category) {
      isValid = false;
      error["category"] = "Please enter category";
    }
    if (!maxAdsForFreeView) {
      isValid = false;
      error["maxAdsForFreeView"] = "Please enter max ads for free view";
    }
    if (!type) {
      isValid = false;
      error["type"] = "Please select a type";
    }
    setErrors(error);
    return isValid;
  };

  useEffect(() => {
    if (dialogueData) {
      setName(dialogueData?.name);
      setDescription(dialogueData?.description);
      setPosterImagePath(dialogueData?.thumbnail);
      setBannerImagePath(dialogueData?.banner); // Assuming banner is added to dialogueData
      setCategory(dialogueData?.categoryId);
      setType(dialogueData?.type === 1 ? "MOVIE" : "WEB_SERIES");
      setMaxAdsForFreeView(dialogueData?.maxAdsForFreeView);
    }
  }, [dialogueData]);

  // Separate file selection handlers for poster and banner
  const handlePosterFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPosterSelectedFile(file);
      setErrors({ ...errors, posterImage: "" });

      const localPreviewUrl = URL.createObjectURL(file);
      setPosterImagePreviewUrl(localPreviewUrl);
      setPosterImageError(false);
    }
  };

  const handleBannerFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBannerSelectedFile(file);
      setErrors({ ...errors, bannerImage: "" });

      const localPreviewUrl = URL.createObjectURL(file);
      setBannerImagePreviewUrl(localPreviewUrl);
      setBannerImageError(false);
    }
  };

  // Updated submit handler to upload both poster and banner
  const handleSubmit = async () => {
    
    if (!validation()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let finalPosterImagePath = posterImagePath;
      let finalBannerImagePath = bannerImagePath;

      // Upload poster image if a new file is selected
      if (posterSelectedFile) {
        const folderStructure = `admin/FilmPoster`;

        const formData = new FormData();
        formData.append("folderStructure", folderStructure);
        formData.append("keyName", posterSelectedFile.name);
        formData.append("content", posterSelectedFile);

        const uploadResponse = await dispatch(uploadImage(formData)).unwrap();
        console.log("uploadResponse", uploadResponse);

        if (!uploadResponse?.data?.status) {
          toast.error("Failed to upload poster image");
          setIsSubmitting(false);
          return;
        }

        finalPosterImagePath = uploadResponse.data.url;
        console.log("finalPosterImagePath", finalPosterImagePath);
      }

      // Upload banner image if a new file is selected
      if (bannerSelectedFile) {
        const folderStructure = `admin/FilmBanner`; 
        const formData = new FormData();
        formData.append("folderStructure", folderStructure);
        formData.append("keyName", bannerSelectedFile.name);
        formData.append("content", bannerSelectedFile);

        const uploadResponse = await dispatch(uploadImage(formData)).unwrap();

        if (!uploadResponse?.data?.status) {
          toast.error("Failed to upload banner image");
          setIsSubmitting(false);
          return;
        }

        finalBannerImagePath = uploadResponse.data.url;
      }

      // Prepare data with both poster and banner URLs
      const data = {
        name: name,
        description: description,
        category: category,
        thumbnail: finalPosterImagePath,
        banner: finalBannerImagePath, // Added banner URL
        type: type === "MOVIE" ? 1 : 2,
        ...(dialogueData && { movieWebseriesId: dialogueData?._id }),
        maxAdsForFreeView: +maxAdsForFreeView,
      };

      const action = dialogueData ? editFilmList(data) : addFilmList(data);
      const response = await dispatch(action).unwrap();

      if (response?.status) {
        toast.success(response.message);
        handleCloseAds();
        dispatch(getFilmList({ page, size }));
      } else {
        toast.error(response?.message || "An error occurred");
      }
    } catch (error) {
      toast.error("An error occurred while processing your request");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
    handleCloseAds();
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (posterImagePreviewUrl) {
        URL.revokeObjectURL(posterImagePreviewUrl);
      }
      if (bannerImagePreviewUrl) {
        URL.revokeObjectURL(bannerImagePreviewUrl);
      }
    };
  }, [posterImagePreviewUrl, bannerImagePreviewUrl]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleCloseAds}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="model-header">
            <p className="m-0">
              {dialogueData ? "Edit Film List" : "Add Film List"}
            </p>
          </div>
          <div className="model-body">
            <form>
              <div
                className="row sound-add-box"
                style={{ overflowX: "hidden" }}
              >
                <div className="mt-3">
                  <label className="form-label type-label">Type</label>
                  <div className="type-radio-group gap-3 d-flex">
                    <div>
                      <input
                        type="radio"
                        id="web_series"
                        name="type"
                        value="WEB_SERIES"
                        checked={type === "WEB_SERIES"}
                        disabled={dialogueData ? true : false}
                        onChange={(e) => {
                          setType(e.target.value);
                          setErrors({ ...errors, type: "" });
                        }}
                      />
                      <label htmlFor="web_series" className="type-label ms-2">
                        WEB SERIES
                      </label>
                    </div>
                    <div className="ms-3">
                      <input
                        type="radio"
                        id="movie"
                        name="type"
                        value="MOVIE"
                        checked={type === "MOVIE"}
                        disabled={dialogueData ? true : false}
                        onChange={(e) => {
                          setType(e.target.value);
                          setErrors({ ...errors, type: "" });
                        }}
                      />
                      <label htmlFor="movie" className="type-label ms-2">
                        MOVIE
                      </label>
                    </div>
                  </div>
                  {errors?.type && (
                    <span className="type-error">{errors.type}</span>
                  )}
                </div>
                <div className="mt-2">
                  <Selector
                    label={"Category"}
                    name={"category"}
                    placeholder={"Select Category..."}
                    className={"mb-2"}
                    selectValue={category}
                    type={"number"}
                    selectData={
                      filmsActiveCategory?.map((category) => ({
                        value: category._id,
                        label: category.name,
                      })) || []
                    }
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setErrors({ ...errors, category: "" });
                    }}
                  />
                  {errors?.category && (
                    <span
                      className="error mb-2"
                      style={{ fontSize: "15px", color: "red" }}
                    >
                      {errors?.category}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <Input
                    type={"text"}
                    label={"Name"}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors({ ...errors, name: "" });
                    }}
                    name={"name"}
                    value={name}
                  />
                  {errors?.name && (
                    <span
                      className="error mb-2"
                      style={{ fontSize: "15px", color: "red" }}
                    >
                      {errors?.name}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <Input
                    type={"text"}
                    label={"Description"}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors({ ...errors, description: "" });
                    }}
                    name={"description"}
                    value={description}
                  />
                  {errors?.description && (
                    <span
                      className="error mb-2"
                      style={{ fontSize: "15px", color: "red" }}
                    >
                      {errors?.description}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <Input
                    type={"number"}
                    label={"Max Ads For Free View"}
                    onChange={(e) => {
                      setMaxAdsForFreeView(e.target.value);
                      setErrors({ ...errors, maxAdsForFreeView: "" });
                    }}
                    name={"maxAdsForFreeView"}
                    value={maxAdsForFreeView}
                  />
                  {errors?.maxAdsForFreeView && (
                    <span
                      className="error mb-2"
                      style={{ fontSize: "15px", color: "red" }}
                    >
                      {errors?.maxAdsForFreeView}
                    </span>
                  )}
                </div>
                <div className="row">
                  <div className="mt-2 col-6">
                    <Input
                      type={"file"}
                      label={"Poster"}
                      accept={"image/*"}
                      onChange={handlePosterFileSelect}
                    />
                    <div className="col-12 d-flex justify-content-start">
                      {posterImageError ||
                      (!posterImagePath && !posterImagePreviewUrl) ? (
                        <img
                          src={Male.src}
                          width={100}
                          height={150}
                          alt="Fallback Poster Image"
                        />
                      ) : (
                        <img
                          src={posterImagePreviewUrl || posterImagePath}
                          width={100}
                          height={150}
                          alt="Poster Thumbnail"
                          onError={() => setPosterImageError(true)}
                        />
                      )}
                    </div>
                    {errors?.posterImage && (
                      <span
                        className="error mb-2"
                        style={{ fontSize: "15px", color: "red" }}
                      >
                        {errors?.posterImage}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 col-6">
                    <Input
                      type={"file"}
                      label={"Banner"}
                      accept={"image/*"}
                      onChange={handleBannerFileSelect}
                    />
                    <div className="col-12 d-flex justify-content-start">
                      {bannerImageError ||
                      (!bannerImagePath && !bannerImagePreviewUrl) ? (
                        <img
                          src={Male.src}
                          width={100}
                          height={150}
                          alt="Fallback Banner Image"
                        />
                      ) : (
                        <img
                          src={bannerImagePreviewUrl || bannerImagePath}
                          width={100}
                          height={150}
                          alt="Banner Thumbnail"
                          onError={() => setBannerImageError(true)}
                        />
                      )}
                    </div>
                    {errors?.bannerImage && (
                      <span
                        className="error mb-2"
                        style={{ fontSize: "15px", color: "red" }}
                      >
                        {errors?.bannerImage}
                      </span>
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
                btnName={"Close"}
                newClass={"close-model-btn"}
                disabled={isSubmitting}
              />
              <Button
                onClick={handleSubmit}
                btnName={isSubmitting ? "Submitting..." : "Submit"}
                type={"button"}
                newClass={"submit-btn"}
                disabled={isSubmitting}
                style={{
                  borderRadius: "0.5rem",
                  width: isSubmitting ? "120px" : "80px",
                  marginLeft: "10px",
                }}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default FilmListDialogue;
