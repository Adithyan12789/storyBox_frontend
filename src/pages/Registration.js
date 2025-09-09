"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, signUpAdmin } from "../store/adminSlice";
import Input from "../extra/Input";
import Logo from "../assets/images/mainLogo.png";
import LogoBg from "../assets/images/bg.png";
// import LoginImg from "../assets/images/login.png";
import LoginImg from "../assets/images/login2.png";
import Image from "next/image";
import Button from "../extra/Button";
import { projectName } from "../util/config";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function Registration() {
  const dispatch = useDispatch();
  const { isAuth, admin } = useSelector((state) => state.admin);
  const router = useRouter();

  useEffect(() => {}, [isAuth, admin]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");

  const [error, setError] = useState({
    email: "",
    password: "",
    newPassword: "",
    code: "",
  });

  const handleSubmit = async () => {
    // Initialize error object
    let errorObj = {};

    // Validation
    if (!email) errorObj.email = "Email is required!";
    if (!password) errorObj.password = "Password is required!";
    if (!newPassword) errorObj.newPassword = "Confirm Password is required!";
    if (password && newPassword && password !== newPassword)
      errorObj.newPassword = "Password and Confirm Password must match!";

    // Only require code if your backend needs it; otherwise optional
    // Remove this if purchase code is optional
    if (!code) errorObj.code = "Purchase code is required!";

    // If there are validation errors, set them and stop
    if (Object.keys(errorObj).length > 0) {
      setError(errorObj);
      return;
    }

    // Payload for API
    const payload = { email, password, newPassword };
    if (code) payload.code = code; // add code only if provided

    try {
      const res = await dispatch(signUpAdmin(payload));

      const apiData = res?.payload?.data;
      toast.success(apiData.message);
      router.push("/");
    } catch (err) {
      console.error("CATCH ERROR:", err);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };
  const handleredirecttoForgotPassword = () => {
    router.push({
      pathname: "/forgotPassword",
    });
  };

  const [type, setType] = useState("text");
  const hideShow = () => {
    type === "password" ? setType("text") : setType("password");
  };

  return (
    // <>
    //   <div className="login-page-content">
    //     <div className="bg-login">
    //       <div className="bg-showLogin">
    //         <img
    //           src='/images/bg.webp'
    //           layout="fill"
    //           alt="bg"
    //           objectFit="cover"
    //           style={{
    //             position: "absolute",
    //             height: "100%",
    //             width: "100%",
    //             inset: "0px",
    //             objectFit: "cover",
    //             color: "transparent",
    //           }}
    //         />
    //       </div>
    //       <div
    //         className="login-page-box"
    //         style={{ backgroundColor: "#ffffff" }}
    //       >
    //         <div className="row">
    //           <div className="col-12 col-md-6 right-login-img d-flex align-items-center">
    //             <img src={LoginImg.src} alt="Login" className="w-100 h-100" />
    //           </div>
    //           <div className="col-12 col-md-6 text-login">
    //             <div className="heading-login">
    //               <img src={Logo.src} alt="Logo" />
    //               <h6 className="custom-shortie-color">{projectName}</h6>
    //             </div>
    //             <div className="login-left-form login-right-form">
    //               <span>Welcome back !!!</span>
    //               <h5>Sign Up</h5>
    //               <Input
    //                 label={`Email`}
    //                 id={`loginEmail`}
    //                 type={`email`}
    //                 value={email}
    //                 errorMessage={error.email && error.email}
    //                 onChange={(e) => {
    //                   setEmail(e.target.value);
    //                   if (!e.target.value) {
    //                     return setError({
    //                       ...error,
    //                       email: `Email Is Required`,
    //                     });
    //                   } else {
    //                     return setError({
    //                       ...error,
    //                       email: "",
    //                     });
    //                   }
    //                 }}
    //                 onKeyPress={handleKeyPress}
    //               />
    //               <Input
    //                 label={`Password`}
    //                 id={`loginPassword`}
    //                 type={`password`}
    //                 value={password}
    //                 className={`form-control`}
    //                 errorMessage={error.password && error.password}
    //                 onChange={(e) => {
    //                   setPassword(e.target.value);
    //                   if (!e.target.value) {
    //                     return setError({
    //                       ...error,
    //                       password: `Password Is Required`,
    //                     });
    //                   } else {
    //                     return setError({
    //                       ...error,
    //                       password: "",
    //                     });
    //                   }
    //                 }}
    //                 onKeyPress={handleKeyPress}
    //               />

    //               <Input
    //                 label={`Confirm Password`}
    //                 id={`loginPassword`}
    //                 type={`password`}
    //                 value={newPassword}
    //                 className={`form-control`}
    //                 errorMessage={error.newPassword && error.newPassword}
    //                 onChange={(e) => {
    //                   setNewPassword(e.target.value);
    //                   if (!e.target.value) {
    //                     return setError({
    //                       ...error,
    //                       newPassword: `Confirm Password Is Required`,
    //                     });
    //                   } else {
    //                     return setError({
    //                       ...error,
    //                       newPassword: "",
    //                     });
    //                   }
    //                 }}
    //                 onKeyPress={handleKeyPress}
    //               />

    //               <Input
    //                 label={`Purchase code`}
    //                 id={`purchasecode`}
    //                 type={`text`}
    //                 value={code}
    //                 className={`form-control`}
    //                 errorMessage={error.code && error.code}
    //                 onChange={(e) => {
    //                   setCode(e.target.value);
    //                   if (!e.target.value) {
    //                     return setError({
    //                       ...error,
    //                       code: `Purchase code Is Required`,
    //                     });
    //                   } else {
    //                     return setError({
    //                       ...error,
    //                       code: "",
    //                     });
    //                   }
    //                 }}
    //                 onKeyPress={handleKeyPress}
    //               />
    //               <div
    //                 className="w-100"
    //                 onClick={handleredirecttoForgotPassword}
    //               >
    //                 <h4 className="text-black" style={{ fontWeight: 700 }}>
    //                   Forgot Password ?
    //                 </h4>
    //               </div>
    //               <div
    //                 className="d-flex justify-content-center w-100"
    //                 style={{ width: "400px" }}
    //               >
    //                 <Button
    //                   btnName={"SIGN UP"}
    //                   newClass={"login-btn ms-2 login"}
    //                   onClick={handleSubmit}
    //                   // style={{ backgroundColor: "#FE0952" }}
    //                 />
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </>

    <div className=" d-flex " style={{ height: "100vh" }}>
      <div className=" d-md-block d-none  w-100">
        <Image src={LoginImg} alt="Login" priority />
      </div>
      <div className=" w-100">
        <div className="align-items-center d-flex h-100 justify-content-center w-100">
          <div className="w-50">
            <div>
              <Image
                src={Logo}
                alt="Logo"
                className="mb-2"
                height={75}
                width={75}
              />
            </div>
            <h2 className="fw-semibold">Sign Up to your account</h2>
            <p className="text-secondary">
              Let's connect, chat, and spark real connections. Enter your
              credentials to continue your journey on {projectName}.
            </p>
            <Input
              label={`Email`}
              placeholder={"Enter Email"}
              id={`loginEmail`}
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
            />
            <div className="custom-input">
              <label>Password</label>
              <div className="input-group">
                <input
                  type={type}
                  value={password}
                  className="form-control border border-end-0 password-input"
                  placeholder="Enter Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        password: `Password Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        password: "",
                      });
                    }
                  }}
                />
                <span
                  className="input-group-text border border-start-0"
                  id="basic-addon2"
                >
                  {type === "password" ? (
                    <IconEye
                      onClick={hideShow}
                      className="text-secondary cursor-pointer"
                    />
                  ) : (
                    <IconEyeOff
                      onClick={hideShow}
                      className="text-secondary cursor-pointer"
                    />
                  )}
                </span>
              </div>
              <p className="errorMessage">{error.password && error.password}</p>
            </div>
            <div className="custom-input">
              <label>Confirm Password</label>
              <div className="input-group">
                <input
                  type={type}
                  value={newPassword}
                  className="form-control border border-end-0 password-input"
                  placeholder="Enter Confirm Password"
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        newPassword: `Confirm Password Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        newPassword: "",
                      });
                    }
                  }}
                />
                <span
                  className="input-group-text border border-start-0"
                  id="basic-addon2"
                >
                  {type === "password" ? (
                    <IconEye
                      onClick={hideShow}
                      className="text-secondary cursor-pointer"
                    />
                  ) : (
                    <IconEyeOff
                      onClick={hideShow}
                      className="text-secondary cursor-pointer"
                    />
                  )}
                </span>
              </div>
              <p className="errorMessage">
                {error.newPassword && error.newPassword}
              </p>
            </div>

            <Input
              label={`Purachse Code`}
              id={`loginpurachse Code`}
              type={`text`}
              placeholder={"Enter purachse code"}
              value={code}
              errorMessage={error.code && error.code}
              onChange={(e) => {
                setCode(e.target.value);
                if (!e.target.value) {
                  return setError({
                    ...error,
                    code: `code Is Required`,
                  });
                } else {
                  return setError({
                    ...error,
                    code: "",
                  });
                }
              }}
            />
            <div className="d-flex flex-column justify-content-center w-100 gap-3 mt-4">
              <Button
                btnName={"Sign Up"}
                newClass={"login-btn  login w-100 py-2 fw-medium"}
                onClick={handleSubmit}
                style={{ backgroundColor: "#FE0952" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
