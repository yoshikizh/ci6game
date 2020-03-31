import React from "react";
import Toolbar from "./toolbar";

const AppHeaderInit = (props) => {
  return (
    <div id="header-wrapper" class="main-background-gradient flex flex-row flex-row-between flex-col-center">
      <div class="flex flex-row flex-col-center">
        <div id="header-proj">{App.dprops.project.session.proj_name}</div>
        <Toolbar cc="123"/>
      </div>
      <div id="header-user">Guest</div>
    </div>
  )
}

export default AppHeaderInit;