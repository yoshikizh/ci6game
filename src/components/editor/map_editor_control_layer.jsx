import React, { useEffect } from "react";
import { connect } from 'dva';
import MapEditorSelectGridLayer from "./map_editor_select_grid_layer";

const MapEditorControlLayer = (props) => {

  const map_id = props.project.current_map_id;
  const data_map = App.game_data.maps[map_id];
  const interface_size = App.config.app.interface_size;

  const getStyle = function(){
    const dom_map_editor_control_layer = document.getElementById("rmmv-map-editor-control-layer");
    
    const map_width_pix = data_map.width * 48;
    const map_height_pix = data_map.height * 48;
    return {width: `${map_width_pix}px`, height: `${map_height_pix}px`}
  };

  const handleScroll = (e) => {
    const scroll_x = e.target.scrollLeft;
    const scroll_y = e.target.scrollTop;
    const map_width = data_map.width;
    const map_height = data_map.height;

    const player_width = interface_size.player_width;
    const player_height = interface_size.player_height;

    const _x = parseInt((player_width * 0.5 + scroll_x) / 48);
    const _y = parseInt((player_height * 0.5 + scroll_y) / 48);

    $gamePlayer.locate(_x,_y);
  }

  const handleClick = (e) => {
    const native_event = e.nativeEvent;
    const _x = native_event.offsetX;
    const _y = native_event.offsetY;

  }

  const getRowLinesArray = () => {

    const arr = [];
    const getStyle = (index) => {
      return {
        width: `${data_map.width * 48}px`,
        height: "0px",
        borderTop: "1px solid black",
        left: 0,
        top: index * 48
      };
    };
    for(let i = 0; i < data_map.height; i++){
      arr.push(
        <div key={`row_${i}`} className="line" style={getStyle(i)}></div>
      )
    }
    return arr;
  }

  const getColLinesArray = () => {
    const map_id = props.project.current_map_id;
    const data_map = App.game_data.maps[map_id];
    const arr = [];
    const getStyle = (index) => {
      return {
        width: "0px",
        height: `${data_map.height * 48}px`,
        borderLeft: "1px solid black",
        left: index * 48,
        top: 0
      };
    };
    for(let i = 0; i < data_map.width; i++){
      arr.push(
        <div key={`col_${i}`} className="line" style={getStyle(i)}></div>
      )
    }
    return arr;
  }

  
  useEffect(() => {
    const parent_ele = document.getElementById("rmmv-map-editor-control-layer-wrapper");
    parent_ele.addEventListener('scroll', handleScroll,true);
    return function(){
      parent_ele.removeEventListener('scroll',handleScroll)
    };
  });

  return (
    <div id="rmmv-map-editor-control-layer" style={getStyle()} onClick={handleClick}>
      {/*<MapEditorSelectGridLayer />*/}
{/*      {getRowLinesArray().map(obj => obj)}
      {getColLinesArray().map(obj => obj)}*/}
    </div>
  )
}

export default connect(({ project }) => ({ project }))(MapEditorControlLayer);

