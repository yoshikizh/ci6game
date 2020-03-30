import React from "react";
import ReactDOM from "react-dom";

// dva init
import { connect } from 'dva';

import AppHeaderInit from './header';
import AppBodyInit from './body';
import AppFooterInit from './footer';

function calcWrapperSizeStyle(){
  let dom_header = document.getElementById("header-wrapper");
  let dom_container = document.getElementById("container-wrapper");
  let dom_footer = document.getElementById("footer-wrapper");

  dom_header.style.height = `${App.config.app.interface_size.header_height}px`;
  dom_container.style.height = `${App.config.app.interface_size.body_height}px`;
  dom_footer.style.height = `${App.config.app.interface_size.footer_height}px`;
}

// render 组件初始化入口函数
function initComponentsEntry() {

  const ComponentsIndex = (props) => {
    App.dprops = props;

    return (
      <>
        <AppHeaderInit />
        <AppBodyInit />
        <AppFooterInit />
      </>
    )
  }

  const DvaAppInit = connect(({ project }) => ({
    project,
  }))(
    ComponentsIndex
  );

  App.dva.router(() => <DvaAppInit />);
  App.dva.start("#dva-app");
};

initComponentsEntry();
calcWrapperSizeStyle();
