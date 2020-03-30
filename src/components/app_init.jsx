import React from "react";

function buildToolbarImages(){
  const arr = [];
  const toolbar_images = App.config.app.toolbar.images;
  const images_length = toolbar_images.length;
  App.config.app.toolbar.images.forEach((group,index) => {
    group.forEach((obj,_index) => {
      arr.push(<a key={"a"+index+_index}><img src={require("../"+obj.path).default} /></a>);
    })
    if (index < images_length - 1) {
      arr.push(<span class="split-vertical-line" key={"span"+index}></span>);
    }
  });
  return arr;
}

export const AppHeaderInit = (props) => {
  return (
    <div id="header-wrapper" class="flex flex-row flex-row-between flex-col-center">
      <div class="flex flex-row flex-col-center">
        <div id="header-proj">{props.project.session.proj_name}</div>
        <div id="header-toolbar" class="inline-flex flex-row flex-col-center">
          { buildToolbarImages().map(ele => ele )}
        </div>
      </div>
      <div id="header-user">Guest</div>
    </div>
  )
}

export const AppBodyInit = (props) => {
  return (
    <div>Body</div>
  )
}

export const AppFooterInit = (props) => {
  const current_map = props.project.current_map;
  return (
    <div id="footer-wrapper" class="flex flex-row flex-row-start flex-col-center">
      <div id="map-status">
        ID:{current_map.id}:{current_map.name} ({current_map.width}x{current_map.height})
      </div>
      <div class="split-vertical-line"></div>
      <div id="map-pos">{props.project.session.current_cursor_pos.join(",")}</div>
      <div class="split-vertical-line"></div>
      <div id="map-zoom">{props.project.session.current_zoom}%</div>
    </div>
  )
}


