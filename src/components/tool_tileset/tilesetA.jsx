import React, {useState} from "react";
import { connect } from 'dva';
import { getTilemapConfig } from "./utils";

const TilesetA = (props) => {
  const render_tilemaps = [];
  const filename1 = props.tool_tileset.tileset_filenames[0];
  const filename2 = props.tool_tileset.tileset_filenames[1];
  const filename3 = props.tool_tileset.tileset_filenames[2];
  const filename4 = props.tool_tileset.tileset_filenames[3];
  const filename5 = props.tool_tileset.tileset_filenames[4];
  const is_show = props.tool_tileset.current_tab === 'A';

  const createTilemapGrids = () => {
    if (filename1 !== "") createTilemapA1();
    if (filename2 !== "") createTilemapA2();
    if (filename3 !== "") createTilemapA3();
    if (filename4 !== "") createTilemapA4();
    if (filename5 !== "") createTilemapA5();
  }

  const onClickHandle = (tile_id) => {
    props.dispatch({
      type: 'tool_tileset/changeTile',
      tile_id: tile_id
    });
  };

  const createTileEle = (image_config, x, y, key, scale = 1.5) => {
    const width = image_config.config.width / scale;
    const height = image_config.config.height / scale;
    const tile_id = props.tool_tileset.selected_tile_id;

    const style = {
      backgroundImage: `url(${image_config.image})`,
      backgroundPosition: tile_id === key ? `-${x+3}px -${y+3}px` : `-${x}px -${y}px`,
      backgroundSize: `${width}px ${height}px`,

      border: tile_id === key ? "3px solid black" : "none",
      width: tile_id === key ? "26px" : "32px",
      height: tile_id === key ? "26px" : "32px",
      lineHeight: tile_id === key ? "26px" : "32px"

    };
    return(
      <div onClick={onClickHandle.bind(this,key)} key={key} className="tilemap-grid" style={style}></div>
    );
  }

  const createTilemapA1 = () => {
    const image_config = getTilemapConfig(filename1);

    // 分组 (8 index 一组)
    let groups = [];
    const tile_name_units = image_config.config.units;

    tile_name_units.forEach((tile_name,index) => {
      if (index % 8 === 0){
        groups[groups.length] = [];
      }
      groups[groups.length-1].push(tile_name);
    });

    groups.forEach((arr,index) => {
      arr.forEach((tile_name,tilename_index) => {

        // RAMARK A1 tilemap 第一行的 index 1和2 需要交换位置
        let draw_index = tilename_index;
        if (index === 0){
          if (draw_index === 1) {
            draw_index = 2;
          } else if( draw_index === 2 ) {
            draw_index = 1;
          }
        }

        let x = 0;
        let y = index * 6 * 32;
        if ([0,2].includes(draw_index)) x = 0;
        if ([1,3].includes(draw_index)) x = 6 * 32;
        if ([4,6].includes(draw_index)) x = 8 * 32;
        if ([5,7].includes(draw_index)) x = 14 * 32;
        if ([2,3,6,7].includes(draw_index)) y += 96;

        const key = `A1|${filename1}|${index}|${tilename_index}|${x}|${y}`
        render_tilemaps.push(createTileEle(image_config,x,y,key));
      });
    });
  }

  const createTilemapA2 = () => {
    const image_config = getTilemapConfig(filename2);
    const tile_name_units = image_config.config.units;

    tile_name_units.forEach((tile_name,index) => {
      const x = (index % 8) * (2 * 32);
      const y = parseInt(index / 8) * (3 * 32);
      const key = `A2|${filename2}|${index}|${x}|${y}`;
      render_tilemaps.push(createTileEle(image_config,x,y,key));
    });
  }

  const createTilemapA3 = () => {
    const image_config = getTilemapConfig(filename3)
    const tile_name_units = image_config.config.units;

    tile_name_units.forEach((tile_name,index) => {
      const x = (index % 8) * (1 * 32);
      const y = parseInt(index / 8) * (2 * 32);
      const key = `A3|${filename3}|${index}|${x}|${y}`
      const scale = 3;
      render_tilemaps.push(createTileEle(image_config,x,y,key,scale));
    });
  }

  const createTilemapA4 = () => {
    const image_config = getTilemapConfig(filename4);
    const tile_name_units = image_config.config.units;

    tile_name_units.forEach((tile_name,index) => {
      let x = (index % 8) * (2 * 32);
      const index_y = parseInt(index / 8);
      let y = parseInt((index_y) / 2) * 160 + (index_y % 2) * 96;

      let scale = 1.5;
      if (index_y % 2 === 1){
        x = (index % 8) * (1 * 32);
        y = y / 2;
        scale = 3;
      }

      const key = `A4|${filename4}|${index}|${x}|${y}`
      render_tilemaps.push(createTileEle(image_config,x,y,key,scale));
    });
  }

  const createTilemapA5 = () => {
    const image_config = getTilemapConfig(filename5)
    const tile_name_units = image_config.config.units;

    tile_name_units.forEach((tile_name,index) => {
      const x = (index % 8) * (1 * 32);
      const y = parseInt(index / 8) * (1 * 32);
      const key = `A5|${filename5}|${index}|${x}|${y}`
      render_tilemaps.push(createTileEle(image_config,x,y,key));
    });
  }

  createTilemapGrids();

  return (
    <div className="tilemap-grids-wrapper flex flex-row flex-wrap" style={{display: is_show ? 'flex' : 'none'}}>
      {render_tilemaps.map(div => div)}
    </div>
  );
}

export default connect(({ tool_tileset }) => ({ tool_tileset }))(TilesetA);