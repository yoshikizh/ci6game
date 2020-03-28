import React from "react";
import ReactDOM from "react-dom";
import {AppHeaderInit, AppBodyInit, AppFooterInit} from "./app_init";

// render 组件初始化入口函数
function renderComponentsEntry() {
  let dom_header = document.getElementsByTagName("header")[0];
  let dom_container = document.getElementById("container");
  let dom_footer = document.getElementsByTagName("footer")[0];
  
  dom_header.style.height = `${App.config.app.interface_size.header_height}px`;
  dom_container.style.height = `${App.config.app.interface_size.body_height}px`;
  dom_footer.style.height = `${App.config.app.interface_size.footer_height}px`;

  ReactDOM.render(React.createElement(AppHeaderInit), dom_header);
  ReactDOM.render(React.createElement(AppBodyInit), dom_container);
  ReactDOM.render(React.createElement(AppFooterInit), dom_footer);
};

renderComponentsEntry();