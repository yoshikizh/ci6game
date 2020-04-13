import React from "react";
import ToolTileset from "./tool_tileset/index";
import MapTree from "./map_tree";

const AppBodyInit = (props) => {
  return (
    <div id="container-wrapper" className="main-background-gradient flex flex-row">
      <div id="container-tool-area">

        <ToolTileset />
        <MapTree />

      </div>
      <div id="container-map-area" className="area-border-color">

      	<div id="rmmv-map-editor"></div>
      	<div id="rmmv-player"></div>
      </div>
    </div>
  )
}

export default AppBodyInit;
