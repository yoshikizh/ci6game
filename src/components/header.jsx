import React from "react";
import Toolbar from "./toolbar";

// import { connect } from 'dva';

const AppHeaderInit = (props) => {
  return (
    <div id="header-wrapper" class="flex flex-row flex-row-between flex-col-center">
      <div class="flex flex-row flex-col-center">
        <div id="header-proj">{App.dprops.project.session.proj_name}</div>
        <Toolbar cc="123"/>
      </div>
      <div id="header-user">Guest</div>
    </div>
  )
}

// const DvaHeader = connect(({ project }) => ({
//   project,
// }))(
//   AppHeaderInit
// );
// App.dva.router(() => <DvaHeader />);


export default AppHeaderInit;