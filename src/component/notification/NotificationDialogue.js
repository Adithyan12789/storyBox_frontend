import React, { useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { closeDialog } from "@/store/dialogueSlice";
import CancelIcon from "@mui/icons-material/Cancel";
import Input from "@/extra/Input";
import Button from "@/extra/Button";
import { sendNotification, uploadImageNotification } from "@/store/adminSlice";
import { projectName } from "@/util/config";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  backgroundColor: "background.paper",
  borderRadius: "13px",
  border: "1px solid #C9C9C9",
  boxShadow: "24px",
  padding: "19px",
};

const NotificationDialogue = () => {
  const dispatch = useDispatch();
  const { dialogue: open } = useSelector((state) => state.dialogue);

  const [values, setValues] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePath, setImageFile] = useState(null);

  const handleCloseDialog = () => {
    dispatch(closeDialog());
  };

 
  const validation = () => {
  let error = {};
  let isValid = true;

  if (!values.title || values.title.trim() === "") {
    error.title = "Title is required";
    isValid = false;
  }

  if (!values.description || values.description.trim() === "") {
    error.description = "Description is required";
    isValid = false;
  }

  setErrors(error);
  return isValid;
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setValues({ ...values, image: file });

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValues({ ...values, image: null });
    setImagePreview(null);
  };



  const handleSubmit = async () => {
  if (!validation()) {
    return;
  }

  try {
    let finalImagePath = imagePreview; 

    if (imagePath) {  
      const folderStructure = `${projectName}/admin/notificationImage`;
      const formData = new FormData();
      formData.append("folderStructure", folderStructure);
      formData.append("keyName", imagePath.name);
      formData.append("content", imagePath);

      const uploadResponse = await dispatch(uploadImageNotification(formData)).unwrap();

      finalImagePath = uploadResponse.data.url; 
    }

    const payload = {
      title: values.title,
      description: values.description,
      image: finalImagePath || null,  
    };

    dispatch(sendNotification(payload));  
    handleCloseDialog();  
  } catch (error) {
    toast.error("An error occurred while processing your request");
    console.error("Submit error:", error);
  }
};

  return (
    <div>
      <Modal
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Box className="d-flex justify-content-between canclebtn">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Notification
            </Typography>
            <button onClick={handleCloseDialog} className="radius-50 canclebtn">
              <CancelIcon sx={{ fontSize: 30 }} className="cursor-pointer" />
            </button>
          </Box>
          <form>
            <div className="row sound-add-box" style={{ overflowX: "hidden" }}>
              <Input
                type="text"
                label="Title"
                onChange={handleInputChange}
                name="title"
                value={values.title || ""}
              />
              {errors?.title && (
                <span
                  className="error mb-2"
                  style={{ fontSize: "15px", color: "red" }}
                >
                  {errors.title}
                </span>
              )}

              <div className="form-group mt-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="1"
                  value={values.description || ""}
                  onChange={handleInputChange}
                  style={{ height: "100px" }}
                />
                {errors?.description && (
                  <span
                    className="error mb-2"
                    style={{
                      fontSize: "15px",
                      color: "red",
                    }}
                  >
                    {errors.description}
                  </span>
                )}
              </div>

              <div className="form-group mt-3">
                <label htmlFor="image" className="form-label">
                  Image (Optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {imagePreview && (
                <div className="mt-3 position-relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "8px",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute"
                    style={{ top: "5px", right: "5px" }}
                    onClick={removeImage}
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="mt-4 d-flex justify-content-end">
                <Button
                  onClick={handleCloseDialog}
                  btnName="Cancel"
                  newClass="close-model-btn"
                />
                <Button
                  onClick={handleSubmit}
                  btnName="Send"
                  type="button"
                  newClass="submit-btn"
                  style={{
                    borderRadius: "0.5rem",
                    width: "80px",
                    marginLeft: "10px",
                  }}
                />
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default NotificationDialogue;
