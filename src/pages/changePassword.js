import React, { useState } from "react";
import Logo from "../assets/images/mainLogo.png";
import { projectName } from "../util/config";
import Input from "../extra/Input";
import Button from "../extra/Button";
import Image from "next/image";
import { adminProfileUpdate } from "../store/adminSlice";
import { useRouter } from "next/router";

const changePassword = () => {
  const router = useRouter();

  const id = router?.query?.id;

  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const [error, setError] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = () => {
    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
      let error = {};
      if (!newPassword) error.newPassword = "New Password Is Required !";
      if (!confirmPassword)
        error.confirmPassword = "Confirm Password Is Required !";
      if (newPassword !== confirmPassword)
        error.confirmPassword = "Passwords do not match!";
      return setError({ ...error });
    } else {
      let payload = {
        adminId: id,
        data: {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
      };
      dispatch(adminProfileUpdate(payload));
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };
  return (
    <div>
      <div className="reset-password">
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <div className="login-page">
            <div className="row">
              <div className="col-12 d-flex justify-content-center align-items-center">
                <div className="login-page-box ">
                  <div className="login-box-img">
                    <img src={Logo.src} alt="logo" width={40} height={40} />
                    <h5>{projectName}</h5>
                  </div>
                  <div className="login-form">
                    <h6>Change Password</h6>
                    <Input
                      label={`New Password`}
                      id={`newPassword`}
                      type={`password`}
                      value={newPassword}
                      errorMessage={error.newPassword && error.newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            newPassword: `New Password Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            newPassword: "",
                          });
                        }
                      }}
                      onKeyPress={handleKeyPress}
                    />
                    <Input
                      label={`Confirm Password`}
                      id={`confirmPassword`}
                      type={`password`}
                      value={confirmPassword}
                      errorMessage={
                        error.confirmPassword && error.confirmPassword
                      }
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            confirmPassword: `Confirm Password Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            confirmPassword: "",
                          });
                        }
                      }}
                      onKeyPress={handleKeyPress}
                    />
                    <div
                      className="d-flex justify-content-center"
                      style={{ width: "400px" }}
                    >
                      <Button
                        btnName={"Change Password"}
                        onClick={handleSubmit}
                        newClass={"login-btn"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default changePassword;
