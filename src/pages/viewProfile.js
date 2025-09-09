import { useDispatch, useSelector } from "react-redux";
import RootLayout from "../component/layout/Layout";
import Input from "../extra/Input";
import Selector from "../extra/Selector";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getUserInfo } from "../store/userSlice";
import Image from "next/image";
import defaultImage from "../assets/images/defaultImage.png";
import NewTitle from "../extra/Title";
import Button from "../extra/Button";
import { IconChevronCompactLeft } from "@tabler/icons-react";

const viewProfile = () => {
  const { userInfo } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const { query } = useRouter();
  const userId = query.userId;

  useEffect(() => {
    if (userId) {
      dispatch(getUserInfo(userId));
    }
  }, [userId]);
  const router = useRouter();
  const handleClose = () => {
    // if (dialogueData) {
    //     dispatch(closeDialog());
    // } else {
    router.back();
    // }
  };
  return (
    <div className="userPage">
      <div className="card1">
       
        
        <div className="cardHeader p-3 ">
          <div className="align-items-center d-flex justify-content-between">
           
              <h5 className="mb-0">Profile</h5>
              
          <Button
            btnName={"Back"}
            newClass={"back-btn"}
             btnIcon={<IconChevronCompactLeft />}
            onClick={handleClose}
          />
            </div>
          </div>
        
        <div
         
        >
          <div
            className="row px-3 py-2"
            style={{
              borderRadius: "5px",
            }}
          >
            <div className="avatar-setting col-sm-12 col-xl-3">
              <div className="mb-4 text-center">
                <div className="image-avatar-box">
                  <div className="cover-img-user"></div>
                  <div
                    className="avatar-img-user"
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="profile-img"
                      //  style={{ padding: "34px" }}
                    >
                      <img
                        src={
                          userInfo?.profilePic === ""
                            ? defaultImage
                            : userInfo?.profilePic
                        }
                        alt="profile"
                        width={100}
                        height={100}
                        onError={(e) => {
                          e.currentTarget.src = defaultImage.src;
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* retriveUserProfile   userId */}
            <div className="general-setting fake-user col-sm-12 col-xl-9">
              <div className=" userSettingBox">
                <form>
                  <div className="row mt-3">
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                      <Input
                        type={"text"}
                        label={"Name"}
                        name={"name"}
                        placeholder={"Enter Details..."}
                        value={userInfo?.name || "-"}
                        readOnly
                        // readOnly={postData?.isFake === false}
                        // errorMessage={error.name && error.name}
                        // onChange={(e) => {
                        //     setName(e.target.value);
                        //     if (!e.target.value) {
                        //         return setError({
                        //             ...error,
                        //             name: `Name Is Required`,
                        //         });
                        //     } else {
                        //         return setError({
                        //             ...error,
                        //             name: "",
                        //         });
                        //     }
                        // }}
                      />
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                      <Input
                        label={"User name"}
                        name={"username"}
                        value={userInfo?.username || "-"}
                        readOnly
                        placeholder={"Enter Details..."}
                      />
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                      <Input
                        label={"E-mail"}
                        name={"email"}
                        value={userInfo?.email}
                        readOnly
                      />
                    </div>

                    {/* <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                      <Input
                        label={"Gender"}
                        value={userInfo?.gender}
                        readOnly
                        // data={postData}
                      />
                    </div> */}
                    {/* <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                      <Input
                        label={"Age"}
                        name={"age"}
                        value={userInfo?.age}
                        placeholder={"Select Age"}
                        readOnly
                        // data={postData}
                      />
                    </div> */}
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                      <Input
                        label={"Login Type"}
                        name={"loginType"}
                        //     MOBILE_NUMBER: 1,
                        // GOOGLE: 2,
                        // QUICK: 3,
                        // APPLE: 4,
                        value={
                          userInfo?.loginType === 1
                            ? "MOBILE_NUMBER"
                            : userInfo?.loginType === 2
                            ? "GOOGLE"
                            : userInfo?.loginType === 3
                            ? "QUICK"
                            : "APPLE"
                        }
                        readOnly
                        // data={postData}
                      />
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                      <Input
                        label={"Coin"}
                        name={"coin"}
                        value={userInfo?.coin}
                        readOnly
                        // data={postData}
                      />
                    </div>
                    {/* <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                      <Input
                        label={"Mobile Number"}
                        name={"mobileNumber "}
                        value={userInfo?.mobileNumber || "-"}
                        readOnly
                        // data={postData}
                      />
                    </div> */}
                    {/* <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                        <Input
                                            label={"Login Type"}
                                            name={"email"}
                                            value={
                                                postData?.loginType === 1
                                                    ? "Mobile Number "
                                                    : postData?.loginType === 2
                                                        ? "Google "
                                                        : "Quick"
                                            }
                                            readOnly={postData?.isFake === false}
                                        />
                                    </div> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
viewProfile.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
export default viewProfile;
