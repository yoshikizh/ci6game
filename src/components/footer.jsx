import React from "react";
import { connect } from 'dva';

const AppFooterInit = (props) => {
  const current_map = props.status_bar.map_status;
  return (
    <div id="footer-wrapper" className="main-background-gradient flex flex-row flex-col-center">

      <div id="map-tilename">{props.status_bar.tilename}</div>
      <div className="split-vertical-line"></div>
      <div id="map-status">
        ID:{current_map.id}:{current_map.name} ({current_map.width}x{current_map.height})
      </div>
      <div className="split-vertical-line"></div>
      <div id="map-pos">{props.status_bar.cursor_pos.join(",")}</div>
      <div className="split-vertical-line"></div>
      <div id="map-zoom">{props.status_bar.zoom}%</div>
    </div>
  )
}

export default connect(({ status_bar }) => ({ status_bar }))(AppFooterInit);

