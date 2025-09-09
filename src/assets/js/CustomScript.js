// import React, { useEffect } from "react";
// import $ from "jquery";

// const CustomScript = (props) => {
//   useEffect(() => {
//     const handleClick = (event) => {
//       const target = event.currentTarget;
//       $(target).next(".subMenu").slideToggle();
//       $(target).children("i").toggleClass("rotate90");
//     };

//     const handleToggle = () => {
//       $(".mainNavbar").toggleClass("mobNav webNav");
//       $(".sideBar").toggleClass("mobSidebar webSidebar");
//       $(".mainAdmin").toggleClass("mobAdmin");
//       $(".fa-angle-right").toggleClass("rotated toggleIcon");
//       // $(".fa-angle-right").toggleClass("toggleIcon rotated", $(".sideBar").hasClass("mobSidebar"));
//     };
//     $(".subMenu").hide();
//     $(".mainMenu > li > a").on("click", handleClick);
//     $(".toggleBar").on("click", handleToggle);
//     $(".navToggle").on("click", handleToggle);

//     return () => {
//       $(".mainMenu > li > a").off("click", handleClick);
//       $(".navToggle").off("click", handleToggle);
//     };
//   }, []);

//   return null;
// };

// export default CustomScript;
