// import React, { useEffect, useRef, useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import Drawer from "react-modern-drawer";
// import "react-modern-drawer/dist/index.css";
// import Logo from "../images/logo/logo.svg";
// import SidebarLinkGroup from "components/SidebarLinkGroup";
// import IconRender from "components/IconRender";
// import { getBasePath } from "utils/helper";
// import { MdCancel } from "react-icons/md";

// const Skeleton = () => (
//   <div className="flex justify-evenly pr-3 gap-x-2 py-1">
//     <div className="animate-pulse bg-gray-100 bg-opacity-10 w-6 h-6 rounded"></div>
//     <div className="animate-pulse bg-gray-100 bg-opacity-10 h-6 w-full rounded"></div>
//   </div>
// );

// const Sidebar = ({ sidebarOpen, setSidebarOpen, moduleList, loading }) => {
//   const location = useLocation();
//   const { pathname } = location;
//   const trigger = useRef(null);
//   const sidebar = useRef(null);
//   const basePath = getBasePath(pathname);

//   const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
//   const [sidebarExpanded, setSidebarExpanded] = useState(
//     storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
//   );

//   // close on click outside
//   useEffect(() => {
//     const clickHandler = ({ target }) => {
//       if (!sidebar.current || !trigger.current) return;
//       if (
//         !sidebarOpen ||
//         sidebar.current.contains(target) ||
//         trigger.current.contains(target)
//       )
//         return;
//       setSidebarOpen(false);
//     };
//     document.addEventListener("click", clickHandler);
//     return () => document.removeEventListener("click", clickHandler);
//   });

//   // close if the esc key is pressed
//   useEffect(() => {
//     const keyHandler = ({ keyCode }) => {
//       if (!sidebarOpen || keyCode !== 27) return;
//       setSidebarOpen(false);
//     };
//     document.addEventListener("keydown", keyHandler);
//     return () => document.removeEventListener("keydown", keyHandler);
//   });

//   useEffect(() => {
//     localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
//     if (sidebarExpanded) {
//       document.querySelector("body")?.classList.add("sidebar-expanded");
//     } else {
//       document.querySelector("body")?.classList.remove("sidebar-expanded");
//     }
//   }, [sidebarExpanded]);

//   return (
//     <>
//       <aside
//         ref={sidebar}
//         className={`absolute left-0 top-0 z-[999999] flex min-h-screen w-1/5 min-w-[290px] flex-col overflow-y-hidden bg-[#1E1E1E] duration-300 ease-linear dark:bg-[#1E1E1E] lg:static lg:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <button
//           onClick={() => setSidebarOpen(false)}
//           className="absolute lg:hidden top-[10px] right-[10px] rounded-full flex items-center text-[20px] justify-center z-9999 text-[#A3AED0] hover:text-secondary-main"
//         >
//           <MdCancel />
//         </button>

//         <div className="flex items-center relative justify-center gap-2 px-6 py-5 lg:pb-5 lg:pt-[39px]">
//           <NavLink to="/" className={"w-[145px] h-auto"}>
//             <img src={Logo} className="w-full" alt="Logo" />
//           </NavLink>
//         </div>
//         <div className="w-full h-[1px] mt-[30px] bg-[#535353]" />
//         <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
//           <nav className="py-5 pl-5 pr-1">
//             <div>
//               <ul className="flex flex-col gap-y-[25px]">
//                 {loading &&
//                   Array.from(new Array(10)).map((_, index) => (
//                     <Skeleton key={index} />
//                   ))}

//                 {!loading &&
//                   moduleList
//                     ?.sort((a, b) => a.moduleRef.order - b.moduleRef.order)
//                     .map(({ moduleRef }, index) => {
//                       return (
//                         <SidebarLinkGroup
//                           key={index}
//                           activeCondition={basePath === moduleRef.name}
//                         >
//                           {(handleClick, open) => {
//                             return (
//                               <React.Fragment>
//                                 <NavLink
//                                   to={moduleRef.defaultScreen.url}
//                                   className={`group relative  flex items-center gap-2.5 text-roboto rounded-sm py-2 text-lg font-bold duration-75- ease-linear hover:text-secondary-main  ${
//                                     basePath === moduleRef.name
//                                       ? "text-secondary-main"
//                                       : "text-[#A3AED0] "
//                                   }`}
//                                   onClick={() => {
//                                     if (sidebarExpanded) {
//                                       handleClick();
//                                       setSidebarOpen(false);
//                                     } else {
//                                       setSidebarExpanded(true);
//                                     }
//                                   }}
//                                 >
//                                   <IconRender iconName={moduleRef.name} />
//                                   {moduleRef.label}

//                                   <div
//                                     className={`absolute right-0 w-[4px]  ${
//                                       basePath === moduleRef.name
//                                         ? "flex group-hover:flex"
//                                         : "hidden"
//                                     }  h-full rounded-[25px]   bg-secondary-main `}
//                                   ></div>
//                                 </NavLink>
//                               </React.Fragment>
//                             );
//                           }}
//                         </SidebarLinkGroup>
//                       );
//                     })}
//               </ul>
//             </div>
//           </nav>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;




// import React, { useState, useEffect } from 'react';
// import { NavLink, useLocation } from 'react-router-dom';
// import Logo from "../images/logo/logo.svg";
// import SidebarLinkGroup from "components/SidebarLinkGroup";
// import IconRender from "components/IconRender";
// import { getBasePath } from "utils/helper";
// import Drawer from 'react-modern-drawer';
// import 'react-modern-drawer/dist/index.css';

// const Skeleton = () => (
//   <div className="flex justify-evenly pr-3 gap-x-2 py-1">
//     <div className="animate-pulse bg-gray-100 bg-opacity-10 w-6 h-6 rounded"></div>
//     <div className="animate-pulse bg-gray-100 bg-opacity-10 h-6 w-full rounded"></div>
//   </div>
// );

// const Sidebar = ({ sidebarOpen, setSidebarOpen, moduleList, loading }) => {
//   const location = useLocation();
//   const { pathname } = location;
//   const basePath = getBasePath(pathname);
//   const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
//   const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === "true");

//   useEffect(() => {
//     localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
//     if (sidebarExpanded) {
//       document.querySelector("body")?.classList.add("sidebar-expanded");
//     } else {
//       document.querySelector("body")?.classList.remove("sidebar-expanded");
//     }
//   }, [sidebarExpanded]);

//   return (
//     <Drawer
//       open={sidebarOpen}
//       onClose={() => setSidebarOpen(false)}
//       direction='left'
//       zIndex={99999}
//       style={{ width: '20%', minWidth: '290px', backgroundColor: '#1E1E1E', zIndex: 999999 }}
//       className="flex flex-col bg-[#1E1E1E] min-h-screen"
//     >
//       <div className="flex items-center relative justify-center gap-2 px-6 py-5 lg:pb-5 lg:pt-[39px]">
//         <NavLink to="/" className={"w-[145px] h-auto"}>
//           <img src={Logo} className="w-full" alt="Logo" />
//         </NavLink>
//       </div>
//       <div className="w-full h-[1px] mt-[30px] bg-[#535353]" />
//       <div className="no-scrollbar flex flex-col overflow-y-auto">
//         <nav className="py-5 pl-5 pr-1">
//           <ul className="flex flex-col gap-y-[25px]">
//             {loading && Array.from(new Array(10)).map((_, index) => <Skeleton key={index} />)}
//             {!loading && moduleList?.sort((a, b) => a.moduleRef.order - b.moduleRef.order)
//               .map(({ moduleRef }, index) => (
//                 <SidebarLinkGroup key={index} activeCondition={basePath === moduleRef.name}>
//                   {(handleClick, open) => (
//                     <NavLink
//                       to={moduleRef.defaultScreen.url}
//                       className={`group relative flex items-center gap-2.5 text-roboto rounded-sm py-2 text-lg font-bold duration-75 ease-linear hover:text-secondary-main ${
//                         basePath === moduleRef.name ? "text-secondary-main" : "text-[#A3AED0]"
//                       }`}
//                       onClick={() => {
//                         if (sidebarExpanded) {
//                           handleClick();
//                           setSidebarOpen(false);
//                         } else {
//                           setSidebarExpanded(true);
//                         }
//                       }}
//                     >
//                       <IconRender iconName={moduleRef.name} />
//                       {moduleRef.label}
//                       <div className={`absolute right-0 w-[4px] ${
//                         basePath === moduleRef.name ? "flex group-hover:flex" : "hidden"
//                       } h-full rounded-[25px] bg-secondary-main`}
//                       ></div>
//                     </NavLink>
//                   )}
//                 </SidebarLinkGroup>
//               ))}
//           </ul>
//         </nav>
//       </div>
//     </Drawer>
//   );
// };

// export default Sidebar;





import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from "../images/logo/logo.svg";
import SidebarLinkGroup from "components/SidebarLinkGroup";
import IconRender from "components/IconRender";
import { getBasePath } from "utils/helper";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

const Skeleton = () => (
  <div className="flex justify-evenly pr-3 gap-x-2 py-1">
    <div className="animate-pulse bg-gray-100 bg-opacity-10 w-6 h-6 rounded"></div>
    <div className="animate-pulse bg-gray-100 bg-opacity-10 h-6 w-full rounded"></div>
  </div>
);

const SidebarContent = ({ loading, moduleList, basePath, sidebarExpanded, setSidebarExpanded }) => (
  <div className="flex flex-col">
    <div className="flex items-center justify-center gap-2 px-6 py-5 lg:pb-5 lg:pt-[39px]">
      <NavLink to="/" className="w-[145px] h-auto">
        <img src={Logo} alt="Logo" className="w-full" />
      </NavLink>
    </div>
    <div className="w-full h-[1px] mt-[30px] bg-[#535353]" />
    <nav className="py-5 pl-5 pr-1">
      <ul className="flex flex-col gap-y-[25px]">
        {loading && Array.from(new Array(10)).map((_, index) => <Skeleton key={index} />)}
        {!loading && moduleList?.sort((a, b) => a.moduleRef.order - b.moduleRef.order).map(({ moduleRef }, index) => (
          <SidebarLinkGroup key={index} activeCondition={basePath === moduleRef.name}>
            {(handleClick, open) => (
              <NavLink
                to={moduleRef.defaultScreen.url}
                className={`group relative flex items-center gap-2.5 text-roboto rounded-sm py-2 text-lg font-bold duration-75 ease-linear hover:text-secondary-main ${
                  basePath === moduleRef.name ? "text-secondary-main" : "text-[#A3AED0]"
                }`}
                onClick={() => {
                  if (sidebarExpanded) {
                    handleClick();
                    setSidebarExpanded(false);
                  } else {
                    setSidebarExpanded(true);
                  }
                }}
              >
                <IconRender iconName={moduleRef.name} />
                {moduleRef.label}
                <div className={`absolute right-0 w-[4px] ${
                  basePath === moduleRef.name ? "flex group-hover:flex" : "hidden"
                } h-full rounded-[25px] bg-secondary-main`}
                ></div>
              </NavLink>
            )}
          </SidebarLinkGroup>
        ))}
      </ul>
    </nav>
  </div>
);

const Sidebar = ({ sidebarOpen, setSidebarOpen, moduleList, loading }) => {
  const location = useLocation();
  const { pathname } = location;
  const basePath = getBasePath(pathname);
  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === "true");

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <>
      {/* Drawer for mobile */}
      <Drawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        direction='left'
        size="80%"
        zIndex={99999}
        style={{ zIndex: 999999, backgroundColor: '#1E1E1E' }}
        className="lg:hidden"
      >
        <SidebarContent
          loading={loading}
          moduleList={moduleList}
          basePath={basePath}
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
        />
      </Drawer>

      {/* Sidebar for desktop */}
      <aside
        className="hidden lg:flex flex-col bg-[#1E1E1E] min-h-screen w-1/5 min-w-[290px]"
        style={{ zIndex: 999999 }}
      >
        <SidebarContent
          loading={loading}
          moduleList={moduleList}
          basePath={basePath}
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
        />
      </aside>
    </>
  );
};

export default Sidebar;
