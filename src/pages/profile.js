import { useDispatch, useSelector } from "react-redux";
import RootLayout from "../component/layout/Layout";
import Button from "../extra/Button";
import Input from "../extra/Input";
import NewTitle from "../extra/Title"
import { use, useEffect, useState } from "react";
import { adminProfileGet, adminProfileUpdate, updateAdminPassword } from "../store/adminSlice";
import Image from "next/image";
import Male from "../assets/images/defaultImage.png"
import { uploadImage } from "../store/episodeListSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import { projectName } from "../util/config";

const profile = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [oldEmail, setOldEmail] = useState();
    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [imageError, setImageError] = useState(false);
    const [imagePath, setImagePath] = useState(null);
    const { admin } = useSelector((state) => state.admin)
    
    const [error, setError] = useState({
        name: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    useEffect(() => {
        dispatch(adminProfileGet())
    }, [])
    useEffect(() => {
        setName(admin?.name);
        setEmail(admin?.email);
        setOldEmail(admin?.email);
        setOldPassword(admin?.password);
        setImagePath(admin?.image)
    }, [admin]);
    useEffect(() => {
        setData(admin)

    }, [admin])
    // console.log("adminadminadmin", admin);

    let folderStructure = `${projectName}/admin/adminImage`;
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("folderStructure", folderStructure);
        formData.append("keyName", file.name);
        formData.append("content", file);

        try {
            dispatch(uploadImage(formData))
                .then((res) => {
                    // console.log("ressss",res)
                    setImagePath(res?.payload?.data?.url)
                    if (res?.payload?.data?.status) {

                        dispatch(adminProfileUpdate({ image: res?.payload?.data?.url }))
                            .then((res) => {
                                // console.log("resss", res);
                                if (res?.payload?.status) {
                                    toast.success(res?.payload?.message);
                                    dispatch(adminProfileGet())
                                }
                            })
                    }
                })
        } catch (err) {
            console.error("Image Upload Failed:", err);
        }
    };
    const handleEditProfile = () => {
        
        if (!email || !name) {
            let error = {};
            if (!email) error.email = "Email Is Required !";
            if (!name) error.name = "Name Is Required !";
            return setError({ ...error });
        } else {
            let profileData = {
                name: name,
                email: email,
            };
            dispatch(adminProfileUpdate(profileData))
                .then((res) => {
                    // console.log("resss", res);
                    if (res?.payload?.status) {
                        toast.success(res?.payload?.message);
                        if (email !== oldEmail) {
                            navigate.push("/login");
                        }
                        dispatch(adminProfileGet())
                    }
                })
        }
    }
    const navigate = useRouter();

    const handlePassword = () => {
        
        if (!newPassword || !oldPassword || !confirmPassword) {
            let error = {};
            if (!newPassword) error.newPassword = "New Password Is Required !";
            if (!oldPassword) error.oldPassword = "Old Password Is Required !";
            if (!confirmPassword)
                error.confirmPassword = "Confirm Password Is Required !";
            return setError({ ...error });
        } else {
            if (newPassword !== confirmPassword) {
                setError({ confirmPassword: "Passwords do not match!" });
            }
            let passwordData = {
                oldPass: oldPassword,
                newPass: newPassword,
                confirmPass: confirmPassword,
            };
            dispatch(updateAdminPassword(passwordData))
                .then((res) => {
                    // console.log("resss", res);
                    if (res?.payload?.status) {
                        toast.success(res?.payload?.message);
                        navigate.push("/login");
                        dispatch(adminProfileGet())
                    }
                })
        }
    };

    return (
        <div className="userPage">
            <div className="profile-page payment-setting card1 p-0">
                <div className="cardHeader">
                  <div className=" align-items-center d-flex flex-wrap justify-content-between p-3">
                      <div>
                        <p className="m-0 fs-5 fw-medium">
                          Profile Details
                        </p>
                      </div>
                  </div>
                </div>
                <div className="payment-setting-box p-3">
                    <div className="row" >
                        <div className="col-lg-6 col-sm-12 ">
                            <div className="mb-4 ">
                                <div className="withdrawal-box  profile-img d-flex flex-column align-items-center">
                                    <h6 className="text-start">Profile Avatar</h6>
                                    <div style={{ paddingTop: "14px" }}>
                                        <label htmlFor="image" onChange={handleFileUpload}>
                                            <div className="avatar-img-icon">
                                                <i className="fa-solid fa-camera d-flex justify-content-center  rounded-circle  p-2 cursorPointer"></i>
                                            </div>
                                            <input
                                                type="file"
                                                name="image"
                                                id="image"
                                                style={{ display: "none" }}
                                            />
                                            {imageError || !imagePath ? (
                                                <img
                                                    src={Male.src} // Fallback image path
                                                    width={100}
                                                    height={150}
                                                    alt="Fallback Image"
                                                />
                                            ) : (
                                                <img
                                                    src={imagePath}
                                                    width={100}
                                                    height={150}
                                                    alt="Thumbnail"
                                                    onError={() => setImageError(true)}
                                                />
                                            )}
                                            {/* <img
                                                src={imagePath.src}
                                                width={100}
                                                height={150}
                                                alt="Thumbnail"
                                                // onError={() => setImageError(true)} // Set error state
                                            /> */}
                                        </label>
                                    </div>
                                    <h5 className="fw-semibold boxCenter mt-2 text-black">
                                        {admin?.name}
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-12">
                            <div className="mb-4">
                                <div className="withdrawal-box payment-box">
                                    <h6 className="mb-0">Edit Profile</h6>
                                    <div className="row">
                                        <form>
                                            <div className="row">
                                                <div className="col-12 withdrawal-input">
                                                    <Input
                                                        label={"Name"}
                                                        name={"name"}
                                                        type={"text"}
                                                        value={name}
                                                        errorMessage={error.name && error.name}
                                                        placeholder={"Enter Detail...."}
                                                        onChange={(e) => {
                                                            setName(e.target.value);
                                                            if (!e.target.value) {
                                                                return setError({
                                                                    ...error,
                                                                    name: `Name Is Required`,
                                                                });
                                                            } else {
                                                                return setError({
                                                                    ...error,
                                                                    name: "",
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-12 withdrawal-input border-0 mt-2">
                                                    <Input
                                                        label={"Email"}
                                                        name={"email"}
                                                        value={email}
                                                        type={"text"}
                                                        errorMessage={error.email && error.email}
                                                        placeholder={"Enter Detail...."}
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
                                                </div>
                                                <div className="col-12 d-flex mt-3 justify-content-end">
                                                    <Button
                                                        btnName={"Submit"}
                                                        type={"button"}
                                                        onClick={handleEditProfile}
                                                        newClass={"submit-btn"}
                                                        style={{
                                                            borderRadius: "0.5rem",
                                                            width: "88px",
                                                            marginLeft: "10px",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-12">
                            <div className="mb-4">
                                <div className="withdrawal-box payment-box">
                                    <h6 className="mb-0">Change Password</h6>
                                    <div className="row">
                                        <form>
                                            <div className="row">
                                                <div className="col-12 withdrawal-input">
                                                    <Input
                                                        label={"Old Password"}
                                                        name={"oldPassword"}
                                                        value={oldPassword}
                                                        type={"password"}
                                                        errorMessage={
                                                            error.oldPassword && error.oldPassword
                                                        }
                                                        placeholder={"Enter Old Password"}
                                                        onChange={(e) => {
                                                            setOldPassword(e.target.value);
                                                            if (!e.target.value) {
                                                                return setError({
                                                                    ...error,
                                                                    oldPassword: `OldPassword Is Required`,
                                                                });
                                                            } else {
                                                                return setError({
                                                                    ...error,
                                                                    oldPassword: "",
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 withdrawal-input border-0 mt-2">
                                                    <Input
                                                        label={"New Password"}
                                                        name={"newPassword"}
                                                        value={newPassword}
                                                        errorMessage={
                                                            error.newPassword && error.newPassword
                                                        }
                                                        type={"password"}
                                                        placeholder={"Enter New Password"}
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
                                                    />
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 withdrawal-input border-0 mt-2">
                                                    <Input
                                                        label={"Confirm Password"}
                                                        name={"confirmPassword"}
                                                        value={confirmPassword}
                                                        className={`form-control`}
                                                        type={"password"}
                                                        errorMessage={
                                                            error.confirmPassword && error.confirmPassword
                                                        }
                                                        placeholder={"Enter Confirm Password"}
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
                                                    />
                                                </div>
                                                <div className="col-12 d-flex mt-3 justify-content-end">
                                                    <Button
                                                        btnName={"Submit"}
                                                        type={"button"}
                                                        onClick={handlePassword}
                                                        newClass={"submit-btn"}
                                                        style={{
                                                            borderRadius: "0.5rem",
                                                            width: "88px",
                                                            marginLeft: "10px",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default profile
profile.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};