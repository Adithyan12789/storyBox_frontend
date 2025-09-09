import { Tooltip } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export default function Navigator(props) {
  const pathname = usePathname();

  const { name, path, navIcon, onClick, navIconImg, navSVG, liClass } = props;

  const isPathActive = Array.isArray(path)
    ? path.includes(pathname) // Check if pathname is in the array
    : pathname === path;

  const handleOnChange = (e) => {
    console.log("handleOnChange", e.target.value);
  };
  const linkHref = Array.isArray(path) ? path[0] : path || "#";
  return (
    <ul className="mainMenu">
      <li
        onClick={onClick}
        className={liClass}
        onChange={handleOnChange}
        value={name}
      >
        {/* <Tooltip title={name} placement="bottom"> */}
          <Link
            href={linkHref} // Use the first path as the main link
            className={`${isPathActive && "activeMenu"}`}
          >
            <div>
              {navIconImg ? (
                <>
                  <img src={navIconImg} />
                </>
              ) : navIcon ? (
                <>
                  <i className={navIcon}></i>
                </>
              ) : (
                <>{navSVG}</>
              )}
              <span className="text-capitalize">{name}</span>
            </div>
            {props?.children && <KeyboardArrowRightIcon />}
          </Link>
        {/* </Tooltip> */}
        {/* If Submenu */}
        <ul className={`subMenu transform0`}>
          {props.children?.map((res) => {
            const { subName, subPath, onClick } = res?.props;
            return (
              <>
                <Tooltip title={subName} placement="right">
                  <li>
                    <Link
                      href={subPath}
                      className={`${pathname === subPath && "activeMenu"}`}
                      onClick={onClick}
                    >
                      <FiberManualRecordIcon style={{ fontSize: "10px" }} />
                      <span style={{ fontSize: "14px" }}>{subName}</span>
                    </Link>
                  </li>
                </Tooltip>
              </>
            );
          })}
        </ul>
      </li>
    </ul>
  );
}
