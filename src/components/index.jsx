import React from "react";

// dva init
import { connect } from 'dva';
// import ModelProject from '../models/project'

import AppHeaderInit from './header';
import AppBodyInit from './body';
import AppFooterInit from './footer';

// const dva_app = Dva();
// dva_app.model(ModelProject);

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
  App.dva.router(() => <DvaHeader />);
  App.dva.start('header');

  const DvaBody = connect(({ project }) => ({
    project,
  }))(
    AppBodyInit
  );
  App.dva.router(() => <DvaBody />);
  App.dva.start('#container');

  const DvaFooter = connect(({ project }) => ({
    project,
  }))(
    AppFooterInit
  );
  App.dva.router(() => <DvaFooter />);
  App.dva.start('footer');
};

renderComponentsEntry();
