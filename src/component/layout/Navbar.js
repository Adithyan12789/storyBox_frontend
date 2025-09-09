"use client";
import { useEffect, useState } from "react";
import Logo from "../../assets/images/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { adminProfileGet } from "../../store/adminSlice";
import MenuIcon from "@mui/icons-material/Menu";
import { projectName } from "@/util/config";
import Male from "@/assets/images/defaultImage.png";
import { usePathname } from "next/navigation";
import NotificationLinear from "@/assets/icons/NotificationLinear";
import NotificationDialogue from "@/component/notification/NotificationDialogue";
import { openDialog } from "@/store/dialogueSlice";

const Navbar = () => {
  const [showImage, setShowImage] = useState();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const getAdminData =
    typeof window !== "undefined" &&
    JSON.parse(sessionStorage.getItem("admin_"));

  const { admin } = useSelector((state) => state.admin);
  const { dialogueType } = useSelector((state) => state.dialogue);
  const getAdminIn =
    typeof window !== "undefined" &&
    JSON.parse(sessionStorage.getItem("admin_"));
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    if (getAdminIn) {
      setAdminData(getAdminIn);
    }
  }, []);

  useEffect(() => {
    dispatch(adminProfileGet());
  }, [pathname]);

  useEffect(() => {
    const payload = {
      adminId: getAdminData?._id,
    };
    dispatch(adminProfileGet(payload));
  }, []);

  return (
    <>
      {dialogueType === "notification" && <NotificationDialogue />}
      {/* <div className="mainNavbar webNav me-4">
                <div className="row">
                    <div
                        className="navBox "
                        style={{ paddingTop: "3px", backgroundColor: "white" }}
                    >
                        <div
                            className="navBar boxBetween px-4 "
                            style={{ padding: "22px 0px" }}
                        >
                            <div>
                                <span className="navToggle" id={"toggle"}>
                                    <MenuIcon />
                                </span>
                                <span>Welcome Admin!</span>
                            </div>
                            <div className="col-4 logo-show-nav">
                                <div className="sideBarLogo boxCenter">
                                    <Link
                                        href={"/dashboard"}
                                        className="d-flex align-items-center"
                                    >
                                        <img
                                            src={Logo.src}
                                            alt="logo"
                                            width={40}
                                            height={40}
                                        />
                                        <span className="fs-3 fw-bold">
                                            {projectName}
                                        </span>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-7">
                                <div className="navIcons d-flex align-items-center justify-content-end">
                                    <button
                                        style={{
                                            backgroundColor: "inherit",
                                            border: "none",
                                        }}
                                        onClick={() =>
                                            dispatch(
                                                openDialog({
                                                    type: "notification",
                                                })
                                            )
                                        }
                                    >
                                        <NotificationLinear />
                                    </button>
                                    <div
                                        className="pe-4 cursor"
                                        style={{
                                            backgroundColor: "inherit",
                                            position: "relative",
                                        }}
                                    ></div>
                                    <div className="cursor">
                                        <Link
                                            href="/profile"
                                            style={{
                                                backgroundColor: "inherit",
                                            }}
                                        >
                                            {admin?.image?.length > 0 && (
                                                <img
                                                    src={admin?.image}
                                                    alt="Image"
                                                    width={27}
                                                    height={27}
                                                    style={{
                                                        borderRadius: "15px",
                                                        border: "1px solid white",
                                                        objectFit: "cover",
                                                    }}
                                                    className="cursor"
                                                    onError={(e) =>
                                                        (e.currentTarget.src =
                                                            Male.src)
                                                    }
                                                />
                                            )}
                                        </Link>
                                    </div>
                                    <Link
                                        href="/profile"
                                        style={{ backgroundColor: "inherit" }}
                                    >
                                        <div
                                            className="pe-4 ml-1"
                                            style={{
                                                backgroundColor: "inherit",
                                                marginLeft: "10px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    cursor: "pointer",
                                                    fontSize: "16px",
                                                    textTransform: "capitalize",
                                                    color: "black",
                                                }}
                                            >
                                                {adminData
                                                    ? adminData?.name
                                                    : "admin"}
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

      <div className="mainNavbar webNav me-4">
        <div className="row">
          <div className="navBox ">
            <div style={{ padding: "0px 20px" }}>
              <div
                className="navBar boxBetween px-4 "
                style={{ padding: "10px 0px" }}
              >
                <div className="navToggle " id={"toggle"}>
                  <MenuIcon />
                </div>
                <div className=""></div>
                <div className="col-4 logo-show-nav">
                  <div className="sideBarLogo boxCenter">
                    <Link
                      href={"/admin/dashboard"}
                      className="d-flex align-items-center"
                    >
                      <Image src={Logo} alt="logo" width={40} height={40} />
                      <span className="fs-3 fw-bold">{projectName}</span>
                    </Link>
                  </div>
                </div>
                <div className="col-7">
                  <div className="navIcons d-flex align-items-center justify-content-end">
                    <div
                      className="pe-4 cursor"
                      style={{
                        backgroundColor: "inherit",
                        position: "relative",
                      }}
                    ></div>
                    <div
                      className="pe-4 ml-1"
                      style={{ backgroundColor: "inherit", marginLeft: "10px" }}
                    >
                      <span
                        style={{
                          cursor: "pointer",
                          fontSize: "16px",
                          textTransform: "capitalize",
                        }}
                      >
                        {adminData ? adminData?.name : "admin"}
                      </span>
                    </div>
                    <div className="cursor">
                      <Link
                        href="/profile"
                        style={{ backgroundColor: "inherit" }}
                      >
                        {admin?.image?.length > 0 && (
                          <img
                            src={admin?.image}
                            alt="Image"
                            width={40}
                            height={40}
                            style={{
                              borderRadius: "5px",
                              border: "1px solid white",
                              objectFit: "cover",
                            }}
                            className="cursor"
                          />
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
