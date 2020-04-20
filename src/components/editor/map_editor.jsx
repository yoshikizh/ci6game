import React from "react";
import { connect } from 'dva';

const MapEditor = (props) => {
  // const map_id = props.project.current_map_id;
  // const data_map = App.game_data.maps[map_id];
  // const interface_size = App.config.app.interface_size;

  // const player_width = interface_size.player_width;
  // const player_height = interface_size.player_height;

  // const map_width = data_map.width * 48;
  // const map_height = data_map.width * 48;

  // let style = {};
  // if (player_width > map_width) {
  //   style["width"] = `${map_width}px`;
  // }

  // const canvas = document.getElementById("GameCanvas");
  // if (canvas){
  //   canvas
  // }

  const style = {};
  return (
    <div id="rmmv-map-editor" style={style}></div>
  )
}

export default connect(({ project }) => ({ project }))(MapEditor);
