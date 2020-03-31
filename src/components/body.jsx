import React from "react";

const AppBodyInit = (props) => {
  return (
    <div id="container-wrapper" class="main-background-gradient flex flex-row">
      <div id="container-tool-area">
        <div id="container-tool-tileset-wrapper" class="area-border-color">
          <div id="container-tool-tileset">

          </div>
          <div id="container-tool-tileset-layer-tabs" class="inline-flex flex-row flex-row-center">
            <a>A</a>
            <a>B</a>
            <a>C</a>
            <a>R</a>
          </div>
        </div>
        <div id="container-tool-maptree-wrapper" class="area-border-color">
        </div>
      </div>
      <div id="container-map-area" class="area-border-color"></div>
    </div>
  )
}

export default AppBodyInit;