import React from "react";
import ReactDOM from "react-dom";

// dva init
import { connect } from 'dva';

import AppHeaderInit from './header';
import AppBodyInit from './body';
import AppFooterInit from './footer';

function calcWrapperSizeStyle(){
  const dom_header = document.getElementById("header-wrapper");
  const dom_container = document.getElementById("container-wrapper");
  const dom_footer = document.getElementById("footer-wrapper");
  const dom_container_map_area = document.getElementById("container-map-area");
  const container_tool_tileset_wrapper = document.getElementById("container-tool-tileset-wrapper");
  const container_tool_maptree_wrapper = document.getElementById("container-tool-maptree-wrapper");

  const interface_size = App.config.app.interface_size;
  const area_margin = interface_size.area_margin;

  dom_header.style.height = `${interface_size.header_height}px`;
  dom_container.style.height = `${interface_size.body_height}px`;
  dom_footer.style.height = `${interface_size.footer_height}px`;

  const map_area_width = interface_size.window_width - 257 - area_margin - 2;
  dom_container_map_area.style.width = `${map_area_width}px`;
  dom_container_map_area.style.marginLeft = `${area_margin}px`;

  // 22 是区域按钮bar 高度
  const tool_tileset_wrapper_heihgt = interface_size.body_height * 0.6 + 22;
  // 2 是border width
  const tool_maptree_wrapper_height = interface_size.body_height - tool_tileset_wrapper_heihgt - area_margin - 2;

  container_tool_tileset_wrapper.style.height = `${tool_tileset_wrapper_heihgt}px`;
  container_tool_maptree_wrapper.style.height = `${tool_maptree_wrapper_height}px`;
  container_tool_maptree_wrapper.style.marginTop = `${area_margin}px`;

  const tool_tileset_layer_tabs_height = 30;
  const container_tool_tileset = document.getElementById("container-tool-tileset");
  container_tool_tileset.style.height = `${tool_tileset_wrapper_heihgt - tool_tileset_layer_tabs_height}px`;

  interface_size.player_width = map_area_width;
  interface_size.player_height = interface_size.body_height - 2;
}

// render 组件初始化入口函数
function initComponentsEntry() {
  const ComponentsIndex = (props) => {
    return (
      <>
        <AppHeaderInit />
        <AppBodyInit />
        <AppFooterInit />
      </>
    )
  }

  // const DvaAppInit = connect(({ toolbar }) => ({
  //   toolbar
  // }))(
  //   ComponentsIndex
  // );

  App.dva.router(ComponentsIndex);
  // App.dva.router(() => <DvaAppInit />);
  App.dva.start("#dva-app");
};

initComponentsEntry();
calcWrapperSizeStyle();
