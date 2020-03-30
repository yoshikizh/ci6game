import React from "react";

const AppFooterInit = (props) => {
  const current_map = props.project.current_map;
  return (
    <div id="footer-wrapper" class="flex flex-row flex-col-center">
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

export default AppFooterInit;

