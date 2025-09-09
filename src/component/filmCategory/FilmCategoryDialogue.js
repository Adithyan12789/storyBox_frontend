import { Box, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../../store/dialogueSlice";
import {
  addFilmCategory,
  editFilmCategory,
  getFilmCategory,
} from "../../store/filmSlice";
import { toast } from "react-toastify";
import Input from "../../extra/Input";
import Button from "../../extra/Button";

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
  // padding: '19px',
};
const FilmCategoryDialogue = ({ page, size }) => {
  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const [name, setName] = useState(dialogueData?.name || "");

  const dispatch = useDispatch();

  const handleCloseAds = () => {
    dispatch(closeDialog());
  };

  useEffect(() => {
    setName(dialogueData?.name || ""); // fallback to empty string
  }, [dialogueData]);

  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    if (!name) {
      setErrors({ name: "Please enter name" });
      return;
    }

    setErrors({}); // clear previous errors

    const action = dialogueData ? editFilmCategory : addFilmCategory;
    const payload = dialogueData
      ? { name, categoryId: dialogueData._id }
      : { name };

    try {
      dispatch(addFilmCategory({ name })).then((res) => {
        if (res?.payload?.status) {
          handleCloseAds();
          toast.success(res?.payload?.message);
          dispatch(getFilmCategory({ page, size })); // ✅ this triggers a refetch
        } else {
          toast.error(res?.payload?.message);
        }
      });
    } catch (err) {
      toast.error(err.message || "Failed to submit");
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleCloseAds}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="">
          <div className="model-header">
            <p className="m-0">
              {dialogueData ? "Edit Film Category" : "Add Film Category"}
            </p>
          </div>
          <div className="model-body">
            <form>
              <div
                className="row sound-add-box"
                style={{ overflowX: "hidden" }}
              >
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
            </form>
          </div>
          <div className="model-footer">
            <div className="m-3 d-flex justify-content-end">
              <Button
                onClick={handleCloseAds}
                btnName={"Close"}
                newClass={"close-model-btn"}
              />
              <Button
                onClick={handleSubmit}
                btnName={"Submit"}
                type={"button"}
                newClass={"submit-btn"}
                style={{
                  borderRadius: "0.5rem",
                  width: "80px",
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
export default FilmCategoryDialogue;
