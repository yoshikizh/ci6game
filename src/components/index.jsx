import React from "react";

// dva init
import Dva, { connect } from 'dva';
import ModelProject from '../models/project'
import {AppHeaderInit, AppBodyInit, AppFooterInit} from "./app_init";

const dva_app = Dva();
dva_app.model(ModelProject);

// render 组件初始化入口函数
function renderComponentsEntry() {
  let dom_header = document.getElementsByTagName("header")[0];
  let dom_container = document.getElementById("container");
  let dom_footer = document.getElementsByTagName("footer")[0];

  dom_header.style.height = `${App.config.app.interface_size.header_height}px`;
  dom_container.style.height = `${App.config.app.interface_size.body_height}px`;
  dom_footer.style.height = `${App.config.app.interface_size.footer_height}px`;

  const DvaHeader = connect(({ project }) => ({
    project,
  }))(
    AppHeaderInit
  );
  dva_app.router(() => <DvaHeader />);
  dva_app.start('header');

  const DvaBody = connect(({ project }) => ({
    project,
  }))(
    AppBodyInit
  );
  dva_app.router(() => <DvaBody />);
  dva_app.start('#container');

  const DvaFooter = connect(({ project }) => ({
    project,
  }))(
    AppFooterInit
  );
  dva_app.router(() => <DvaFooter />);
  dva_app.start('footer');
};

renderComponentsEntry();
