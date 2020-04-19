import React, { useEffect } from "react";
import { connect } from 'dva';

const MapEditorControlLayer = (props) => {

  const resetMapEditorGridLayer = function(){
    const map_id = props.project.current_map_id;
    const interface_size = App.config.app.interface_size;
    const dom_map_editor_control_layer = document.getElementById("rmmv-map-editor-control-layer");

    console.log("map_id",map_id);

    const data_map = App.game_data.maps[map_id];
    const map_width_pix = data_map.width * 48;
    const map_height_pix = data_map.height * 48;
    dom_map_editor_control_layer.style.width = `${map_width_pix}px`;
    dom_map_editor_control_layer.style.height = `${map_height_pix}px`;
  };


  useEffect(() => {
    resetMapEditorGridLayer();
    window.addEventListener('scroll', handleScroll,true);
    return function(){
      window.removeEventListener('scroll',handleScroll)
    };
  });

  return (
    <div id="rmmv-map-editor-grid-layer">

    </div>
  )
}

export default connect(({ project }) => ({ project }))(MapEditorControlLayer);
