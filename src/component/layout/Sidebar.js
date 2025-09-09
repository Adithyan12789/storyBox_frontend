"use client";
import Logo from "../../assets/images/mainLogo.png";

import { warning } from "@/util/Alert";
import { projectName } from "@/util/config";
import axios from "axios";
import $ from "jquery";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaListUl, FaRegUser } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { MdOutlineMovieFilter } from "react-icons/md";
import {
  RiHistoryFill,
  RiLogoutBoxRLine,
  RiVipCrownLine,
} from "react-icons/ri";
import { TbAward, TbClipboardList, TbCoinRupee, TbMovie } from "react-icons/tb";
import DownArrow from "../../assets/icons/DownArrow.svg";
import "../../assets/js/custom";
import Navigator from "../../extra/Navigator";
import {
  IconAward,
  IconClipboardData,
  IconCoinRupee,
  IconDeviceTvOld,
  IconHistory,
  IconLayoutDashboard,
  IconLogout,
  IconLogout2,
  IconMovie,
  IconSettings,
  IconSlideshow,
  IconUserCircle,
  IconUsers,
  IconVideo,
  IconVip,
} from "@tabler/icons-react";

const Sidebar = ({ children }) => {
  const router = useRouter();

  const handleLogout = () => {
    handleCloseFunction();
    const data = warning();
    data
      .then((logout) => {
        if (logout) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("admin");
          sessionStorage.removeItem("key");
          sessionStorage.removeItem("isAuth");
          axios.defaults.headers.common["Authorization"] = "";
          router.push("/", { scroll: true });
        }
      })
      .catch((err) => console.log(err));
  };

  const handleCloseFunction = () => {
    let dialogueData_ = {
      dialogue: false,
    };
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
    localStorage.removeItem("multiButton");
  };

  const navBarArray = [
    {
      name: "Dashboard",
      path: "/dashboard",
      navSVG: <IconLayoutDashboard className="cursorPointer" />,
      onClick: handleCloseFunction,
    },
    {
      name: "User",
      path: ["/user", "/viewProfile", "/viewProfileHistory"],
      navSVG: <IconUsers className="cursorPointer" />,
      onClick: handleCloseFunction,
    },
  ];

  const generalArray = [
    {
      name: "Reward",
      path: "/reward",
      navSVG: <IconAward className="cursorPointer" />,
      onClick: handleCloseFunction,
    },
    {
      name: "Setting",
      path: "/setting",
      navSVG: <IconSettings />,

      onClick: handleCloseFunction,
    },
    {
      name: "Profile",
      path: "/profile",
      navSVG: <IconUserCircle className="cursorPointer" />,
      onClick: handleCloseFunction,
    },
    {
      name: "Log Out",
      navSVG: <IconLogout2 />,
      onClick: handleLogout,
    },
  ];
  const filmArray = [
    {
      name: "Film Category",
      path: "/filmCategory",
      navSVG: <IconMovie className="cursorPointer" />,
      onClick: handleCloseFunction,
    },
    {
      name: "Film List",
      path: ["/filmList", "/ViewShortVideo"],
      navSVG: <IconClipboardData className="cursorPointer" />,
      onClick: handleCloseFunction,
    },
    {
      name: "Episode List",
      path: "/episodeList",
      navSVG: <IconVideo className="cursorPointer" />,
      onClick: handleCloseFunction,
    },
  ];
  const packageArray = [
    {
      name: "Coin Plan",
      path: "/coinPlan",
      navSVG: <IconCoinRupee className="cursorPointer" />,
      onClick: handleCloseFunction,
    },
    {
      name: "VIP Plan",
      path: "/vipPlan",
      navSVG: <IconVip className="cursorPointer" />,
      onClick: handleCloseFunction,
    },
    {
      name: "Order History",
      path: ["/orderHistory", "/coinPlanHistory"],
      navSVG: <IconHistory className="cursorPointer" />,
      onClick: handleCloseFunction,
    },
  ];

  const [totalPage, setTotalPage] = useState(20);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    if (mediaQuery?.matches) {
      $(".sideBar.mobSidebar").removeClass("mobSidebar");
      $(".sideBar").addClass("webSidebar");
    }
    $(".mobSidebar-bg").removeClass("responsive-bg");
  }, []);

  return (
    <>
      <Script totalPage={totalPage} />
      <div className="mainSidebar">
        <div className="sideBar webSidebar">
          <div className="sideBarLogo">
            <Link
              href="/dashboard"
              className="d-flex align-items-center cursor-pointer"
            >
              <Image src={Logo.src} alt="logo" width={35} height={35} />
              <span className="fs-3 fw-bold" style={{ color: "#e83a57" }}>
                {projectName}
              </span>
            </Link>
          </div>
          {/* ======= Navigation ======= */}
          <div className="navigation">
            <p
              // style={{
              //     fontSize: "16px",
              //     paddingLeft: "20px",
              //     fontWeight: "700",
              // }}
              className="sideBarTitle"
            >
              Menu
            </p>
            {/* <nav style={{ backgroundColor: "#f0f0f0" }}> */}
            <nav
              style={{
                borderRadius: "10px",
                color: "#997CFA",
              }}
            >
              {/* About */}
              {navBarArray?.length > 0 &&
                navBarArray.map((res) => {
                  return (
                    <Navigator
                      key={res.name} // unique key here
                      name={res?.name}
                      path={res?.path}
                      navSVG={res?.navSVG}
                      onClick={res?.onClick}
                    >
                      {res?.subMenu &&
                        res?.subMenu.map((subMenu) => {
                          return (
                            <Navigator
                              key={subMenu.subName} // unique key for submenu
                              subName={subMenu.subName}
                              subPath={subMenu.subPath}
                              onClick={subMenu.onClick}
                            />
                          );
                        })}
                    </Navigator>
                  );
                })}
            </nav>
            <p
              // style={{
              //     marginTop: "10px",
              //     fontSize: "16px",
              //     paddingLeft: "20px",
              //     fontWeight: "700",
              // }}
              className="sideBarTitle"
            >
              Film Management
            </p>
            <nav
              style={{
                borderRadius: "10px",
                color: "#997CFA",
              }}
            >
              {/* About */}
              {filmArray?.length > 0 &&
                filmArray.map((res) => (
                  <Navigator
                    key={res.name}
                    name={res?.name}
                    path={res?.path}
                    navSVG={res?.navSVG}
                    onClick={res?.onClick}
                  >
                    {res?.subMenu &&
                      res?.subMenu.map((subMenu) => (
                        <Navigator
                          key={subMenu.subName}
                          subName={subMenu.subName}
                          subPath={subMenu.subPath}
                          onClick={subMenu.onClick}
                        />
                      ))}
                  </Navigator>
                ))}
            </nav>
            <p
              // style={{
              //     marginTop: "10px",
              //     fontSize: "16px",
              //     paddingLeft: "20px",
              //     fontWeight: "700",
              // }}
              className="sideBarTitle"
            >
              Package
            </p>
            <nav
              style={{
                borderRadius: "10px",
                color: "#997CFA",
              }}
            >
              {/* About */}
              {packageArray?.length > 0 &&
                packageArray.map((res) => (
                  <Navigator
                    key={res.name}
                    name={res.name}
                    path={res.path}
                    navSVG={res.navSVG}
                    onClick={res.onClick}
                  >
                    {res.subMenu &&
                      res.subMenu.map((subMenu) => (
                        <Navigator
                          key={subMenu.subName}
                          subName={subMenu.subName}
                          subPath={subMenu.subPath}
                          onClick={subMenu.onClick}
                        />
                      ))}
                  </Navigator>
                ))}
            </nav>
            <p
              // style={{
              //     marginTop: "10px",
              //     fontSize: "16px",
              //     paddingLeft: "20px",
              //     fontWeight: "700",
              // }}
              className="sideBarTitle"
            >
              General
            </p>
            <nav
              style={{
                borderRadius: "10px",
                color: "#997CFA",
              }}
            >
              {/* About */}
              {generalArray?.length > 0 &&
                (totalPage > 0
                  ? generalArray.slice(0, totalPage)
                  : generalArray
                ).map((res) => (
                  <Navigator
                    key={res.name} // unique key for parent
                    name={res.name}
                    path={res.path}
                    path2={res.path2}
                    navIcon={res.navIcon}
                    navIconImg={res.navIconImg}
                    navSVG={res.navSVG}
                    onClick={res.onClick && res.onClick}
                  >
                    {res.subMenu &&
                      res.subMenu.map((subMenu) => (
                        <Navigator
                          key={subMenu.subName} // unique key for submenu
                          subName={subMenu.subName}
                          subPath={subMenu.subPath}
                          subPath2={subMenu.subPath2}
                          onClick={subMenu.onClick}
                        />
                      ))}
                  </Navigator>
                ))}
            </nav>

            <div
              className="boxCenter mt-2"
              onClick={() => setTotalPage(navBarArray.length)}
            >
              <img
                src={DownArrow.src}
                alt="DownArrow"
                style={{ transition: "0.5s" }}
                className={`text-center mx-auto cursor ${
                  totalPage === navBarArray.length && "d-none"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
      <div>{children}</div>
    </>
  );
};

export default Sidebar;

export const Script = (props) => {
  useEffect(() => {
    const handleClick = (event) => {
      const target = $(event.currentTarget);
      const submenu = target.next(".subMenu");

      $(".subMenu").not(submenu).slideUp();
      submenu.slideToggle();

      // Toggle rotation class on the clicked icon
      target.children("i").toggleClass("rotate90");

      // Remove rotation class from other icons
      $(".mainMenu > li > a > i")
        .not(target.children("i"))
        .removeClass("rotate90");
    };

    const handleToggle = () => {
      $(".mainNavbar").toggleClass("mobNav webNav");
      $(".sideBar").toggleClass("mobSidebar webSidebar");
      $(".comShow").toggleClass("mobCom webCom");
      $(".sideBarTitle").toggleClass("hidden");
      $(".sideBarLogo a").toggleClass("justify-content-center");

      $(".sideBar").toggleClass("collapsed");

      // $(".mobSidebar-bg").toggleClass("responsive-bg ");
      $(".mainAdmin").toggleClass("mobAdmin");
      $(".fa-angle-right").toggleClass("rotated toggleIcon");

      var checkClass = $(".sideBar").hasClass("mobSidebar");
      if (checkClass) {
        var mobSidebarBg = document.querySelector(".mobSidebar-bg");
        mobSidebarBg && mobSidebarBg.classList.add("responsive-bg");
      } else {
        $(".mobSidebar-bg").removeClass("responsive-bg");
      }
    };
    $(".subMenu").hide();
    $(".mainMenu > li > a").on("click", handleClick);
    $(".navToggle").on("click", handleToggle);

    return () => {
      $(".mainMenu > li > a").off("click", handleClick);
      $(".navToggle").off("click", handleToggle);
    };
  }, [props.totalPage]);

  return null;
};
