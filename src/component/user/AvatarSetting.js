import React, { useEffect, useState } from "react";
import $ from "jquery";
import CoverImg from "../../assets/images/userSettingCover.png";
import { useSelector } from "react-redux";
import { updateFakeUser } from "../../store/userSlice";
import { baseURL } from "@/util/config";
import useClearSessionStorageOnPopState from "../../extra/ClearStorage";

const AvatarSetting = (props) => {
  $("input[type='image']").click(function () {
    $("input[id='my_file']").click();
  });
  useClearSessionStorageOnPopState("multiButton");

  const { userProfileData } = props;
  const [imageShow, setImageShow] = useState("");
  const [userId, setUserId] = useState("");
  const [isChannel, setIsChannel] = useState(false); // Adjust according to your data type
  const { getUserProfileData, countryData } = useSelector((state) => state.user);

  const [data, setData] = useState();

  const dispatch = useAppDispatch();

  useEffect(() => {
    setData(getUserProfileData);
  }, [userProfileData, getUserProfileData]);

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const getFile = e.target.files[0];
      const imageURL = URL.createObjectURL(getFile);

      if (imageURL) {
        setImageShow(imageURL);
        const formData = new FormData();
        formData.append("image", getFile);

        let payload = {
          id: userProfileData?._id,
          data: formData,
        };

        dispatch(updateFakeUser(payload));
        dispatch(closeDialog());
      }
    }
  };

  useEffect(() => {
    setUserId(userProfileData?._id || "");
    setIsChannel(userProfileData?.isChannel || false);
    setImageShow(baseURL + userProfileData?.image || "");
  }, [userProfileData, getUserProfileData]);

  return (
    <div className="avatar-setting">
      <div className="userSettingBox">
        <div className="row d-flex align-items-center mt-3">
          <div className="col-12">
            <h5>Avatar & Cover</h5>
          </div>
        </div>
        <div className="image-avatar-box">
          <div className="cover-img-user">
            <img src={CoverImg.src} alt="Cover" />
          </div>
          <div className="avatar-img-user" style={{ cursor: "pointer" }}>
            <label htmlFor="image" onChange={(e) => handleFileUpload(e)}>
              {userProfileData?.isFake == true && (
                <input
                  type="file"
                  name="image"
                  id="image"
                  style={{ display: "none" }}
                />
              )}
              {imageShow && (
                <img
                  src={imageShow}
                  height={0}
                  width={0}
                  alt="Avatar"
                  style={{ cursor: "pointer" }}
                />
              )}
              <div
                className="avatar-img-icon "
                style={{ cursor: "pointer", display: "none" }}
              >
                {userProfileData?.isFake == true && (
                  <svg
                    className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv"
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    data-testid="EditIcon"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path>
                  </svg>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSetting;
