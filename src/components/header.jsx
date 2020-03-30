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

const AppHeaderInit = (props) => {
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

export default AppHeaderInit;