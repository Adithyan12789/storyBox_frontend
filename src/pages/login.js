"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/adminSlice";
import Input from "../extra/Input";
import Logo from "../assets/images/mainLogo.png";
import LogoBg from "../assets/images/bg.png";
import LoginImg from "../assets/images/login2.png";
// import LoginImg from "../assets/images/login.png";
import Image from "next/image";
import Button from "../extra/Button";
import { projectName } from "../util/config";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function Login() {
  const dispatch = useDispatch();
  const { isAuth, admin } = useSelector((state) => state.admin);
  const router = useRouter();

  useEffect(() => {}, [isAuth, admin]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const handleredirecttoForgotPassword = () => {
    router.push({
      pathname: "/forgotPassword",
    });
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      let errorObj = {};
      if (!email) errorObj = { ...errorObj, email: "Email Is Required !" };
      if (!password)
        errorObj = { ...errorObj, password: "Password is required !" };
      return setError(errorObj);
    } else {
      let payload = {
        email,
        password,
      };

      const res = await dispatch(login(payload));

      console.log("res: ", res)

      if(res){

      }else{

      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  const [type, setType] = useState("text");
  const hideShow = () => {
    type === "password" ? setType("text") : setType("password");
  };

  return (
    <>
      <div className=" d-flex " style={{ height: "100vh" }}>
        <div className=" d-md-block d-none  w-100">
          <Image src={LoginImg} alt="Login" priority/>
        </div>
        <div className=" w-100">
          <div className="align-items-center d-flex h-100 justify-content-center w-100">
            <div className="w-50 w-md-100">
              <div>
                <Image
                  src={Logo}
                  alt="Logo"
                  className="mb-2"
                  height={75}
                  width={75}
                />
              </div>
              <h2 className="fw-semibold">Login to your account</h2>
              <p className="text-secondary">
                Let's connect, chat, and spark real connections. Enter your
                credentials to continue your journey on {projectName}.
              </p>
              <Input
                label={`Email`}
                id={`loginEmail`}
                placeholder={"Enter Email"}
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
                    onKeyPress={handleKeyPress}
                  />
                  <span
                    className="input-group-text border border-start-0 bg-white"
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
                  {error.password && error.password}
                </p>
              </div>

              <div className="w-100">
                <h4
                  className="cursor-pointer fs-6 text-end text-secondary"
                  style={{ fontWeight: 500, fontSize: "small" }}
                  onClick={handleredirecttoForgotPassword}
                >
                  Forgot Password ?
                </h4>
              </div>
              <div className="d-flex flex-column justify-content-center w-100 gap-3 mt-4">
                <Button
                  btnName={"Login"}
                  newClass={"login-btn  login w-100 py-2 fw-medium"}
                  onClick={handleSubmit}
                  // style={{ backgroundColor: "#FE0952" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
