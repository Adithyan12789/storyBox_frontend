import React, { useState } from "react";
import Button from "../extra/Button";
import Logo from "../assets/images/mainLogo.png";
import Input from "../extra/Input";
import { useDispatch } from "react-redux";
import { projectName } from "../util/config";
import Image from "next/image";
import { sendEmail } from "../store/adminSlice";
import bgImage from "../assets/images/forgetpassword.png";
// import bgImage from "../assets/images/bg.png";


function ForgotPassword(props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    email: "",
  });

  const dispatch = useDispatch();

  const isEmail = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val);
    return validNumber;
  };

  const handleSubmit = () => {
    const validEmail = isEmail(email);
    if (!email || !validEmail) {
      let error = {};
      if (!email) {
        error.email = "Email Is Required !";
      } else if (!validEmail) {
        error.email = "Email Is Invalid !";
      }
      return setError({ ...error });
    } else {
      let forgotPasswordData = {
        email: email,
      };

      dispatch(sendEmail(forgotPasswordData));
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
   <div className="reset-password" 
    style={{ 
      backgroundImage: `url(${bgImage.src})`,
      width: "100%",
      height: "100vh",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
    > 
      <div className="dashboardHeader primeHeader mb-3 p-0">
        <div className="login-page" style={{backgroundImage : 'url("/forgetpassword.png")'}}>
          <div className="bg-login"></div>
          <div className="row">
            <div className="col-12 d-flex justify-content-center align-items-center">
              <div className="login-page-box ">
                <div className="login-box-img">
                  <img src={Logo.src} alt="logo" width={40} height={40}/>
                  <h3
                    className="custom-shortie-color"
                    style={{
                      fontWeight: 900,
                      fontSize: "30px",
                      paddingLeft: "15px",
                    }}
                  >
                    {projectName}
                  </h3>
                </div>
                <div className="login-form">
                  <h6>Forgot Password</h6>
                  <Input
                    label={`Email`}
                    id={`loginEmail`}
                    placeholder="Enter Email"
                    type={`email`}
                    value={email}
                    errorMessage={error.email && error.email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          email: `Email Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          email: "",
                        });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                  />
                  <div
                    className="d-flex justify-content-center"
                    style={{ width: "100%", }}
                  >
                    <Button
                      btnName={"Send Email"}
                      onClick={handleSubmit}
                     newClass={"login-btn mt-2 p-2 rounded-1 text-center themeBtn w-100"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
