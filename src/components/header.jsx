import React from "react";
import { connect } from 'dva';
import Toolbar from "./toolbar";

const AppHeaderInit = (props) => {

  App.props.Header = props;

  return (
    <div id="header-wrapper" className="main-background-gradient flex flex-row flex-row-between flex-col-center">
      <div className="flex flex-row flex-col-center">
        <div id="header-proj">{props.toolbar.proj_name}</div>
        <Toolbar />
      </div>
      <div id="header-user">Guest</div>
    </div>
  )
}

export default connect(({ toolbar }) => ({ toolbar }))(AppHeaderInit);
