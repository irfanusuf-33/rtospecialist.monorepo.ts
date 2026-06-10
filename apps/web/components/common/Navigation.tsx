// import { Outlet } from "react-router-dom";


import MainNav from "./nav/Main";

export default function Navigation () {

  return (<>
    <div className="main-navigation-bar">
      {/* <PageHeader /> */}
      <MainNav />
    </div>
    {/* <Outlet /> */}
  </>
  );
}
