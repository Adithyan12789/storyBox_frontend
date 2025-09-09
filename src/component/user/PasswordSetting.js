import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import Input from "../../extra/Input";
import { connect, useSelector } from "react-redux";
import { userPasswordChange } from "../../store/userSlice"; // Assuming you have a passwordSlice with the passwordChange Action

const PasswordSetting = ({
  userProfileData,
}) => {
  const dispatch = useAppDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [isChannel, setIsChannel] = useState("");
  const [error, setError] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { dialogueData } = useSelector((state) => state.dialogue);

  useEffect(() => {
    setUserId(userProfileData?._id);
    setIsChannel(userProfileData?.isChannel);
    setCurrentPassword(userProfileData?.password);
  }, [userProfileData]);

  const handleSubmit = () => {
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword ||
      newPassword !== confirmPassword
    ) {
      let newError = {
        currentPassword: !currentPassword
          ? "Current Password Is Required !"
          : "",
        newPassword: !newPassword ? "New Password Is Required !" : "",
        confirmPassword: !confirmPassword
          ? "Confirm Password Is Required !"
          : newPassword !== confirmPassword
            ? "Confirm Password Is Not Same !"
            : "",
      };
      setError({ ...newError });
    } else {
      let passwordChangeData = {
        oldPass: currentPassword,
        newPass: newPassword,
        confirmPass: confirmPassword,
        userId: userId,
      };
      const payload = {
        id: dialogueData?._id,
        data: passwordChangeData,
      };
      dispatch(userPasswordChange(payload));
    }
  };

  return (
    <div className="password-setting">
      <div className="userSettingBox">
        <div className="row d-flex align-items-center mt-3">
          <div className="col-6">
            <h5>Password Setting</h5>
          </div>
          <form>
            <div className="col-12 d-flex justify-content-end align-items-center">
              <Button
                newClass={"submit-btn"}
                type={"button"}
                btnName={"Submit"}
                onClick={handleSubmit}
              />
            </div>
            <div className="row flex-column mt-3">
              <div className="col-12 mt-2">
                <Input
                  label={"Current Password"}
                  name={"currentPassword"}
                  placeholder={"Enter Details..."}
                  value={currentPassword}
                  errorMessage={error.currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (!e.target.value) {
                      setError((prevError) => ({
                        ...prevError,
                        currentPassword: "Current Password Is Required",
                      }));
                    } else {
                      setError((prevError) => ({
                        ...prevError,
                        currentPassword: "",
                      }));
                    }
                  }}
                />
              </div>
              <div className="col-12 mt-2">
                <Input
                  label={"New Password"}
                  name={"newPassword"}
                  placeholder={"Enter Details..."}
                  value={newPassword}
                  errorMessage={error.newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (!e.target.value) {
                      setError((prevError) => ({
                        ...prevError,
                        newPassword: "New Password Is Required",
                      }));
                    } else {
                      setError((prevError) => ({
                        ...prevError,
                        newPassword: "",
                      }));
                    }
                  }}
                />
              </div>
              <div className="col-12 mt-2">
                <Input
                  label={"Confirm New Password"}
                  name={"confirmNewPassword"}
                  placeholder={"Enter Details..."}
                  value={confirmPassword}
                  errorMessage={error.confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (!e.target.value) {
                      setError((prevError) => ({
                        ...prevError,
                        confirmPassword: "Confirm New Password Is Required",
                      }));
                    } else {
                      setError((prevError) => ({
                        ...prevError,
                        confirmPassword: "",
                      }));
                    }
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordSetting;
