import React from "react";
import { connect } from 'dva';

const ToolTileset = (props) => {

  const tileset_filenames = props.tool_tileset.tileset_filenames;

  let render_tilemaps = {"A": [], "B": [], "C": [], "D": [], "E": [], "R": [] };

  function createTileEle(image_config, x, y, key){
    const width = image_config.config.width / 1.5;
    const height = image_config.config.height / 1.5;
    const style = {
      backgroundImage: `url(${image_config.image})`,
      backgroundPosition: `-${x}px -${y}px`,
      backgroundSize: `${width}px ${height}px`
    };
    return(
      <div key={key} className="tilemap-grid" style={style}></div>
    );
  }

  function getTilemapConfig(filename){
    const image_config = App.config.tileset_names[filename];
    const image = require(`../assets/rtp/tilesets/${filename}.png`).default;
    return { image: image, config: image_config };
  }

  function createTilemapA1(){
    const filename = tileset_filenames[0];
    if ( filename === "") return;

    const image_config = getTilemapConfig(filename)

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
        let x = 0;
        let y = index * 6 * 32;
        if ([0,2].includes(tilename_index)) x = 0;
        if ([1,3].includes(tilename_index)) x = 6 * 32;
        if ([4,6].includes(tilename_index)) x = 8 * 32;
        if ([5,7].includes(tilename_index)) x = 14 * 32;
        if ([2,3,6,7].includes(tilename_index)) y += 96;
        const key = `A1_${index}_${tilename_index}_${x}_${y}`
        render_tilemaps["A"].push(createTileEle(image_config,x,y,key))
      });
    });
  }

  function createTilemapA2(){
    const filename = tileset_filenames[1];
    if ( filename === "") return;

    const image_config = getTilemapConfig(filename)
    const tile_name_units = image_config.config.units;

    tile_name_units.forEach((tile_name,index) => {
      const x = (index % 8) * (2 * 32);
      const y = parseInt(index / 8) * (3 * 32);
      const key = `A2_${index}_${x}_${y}`
      render_tilemaps["A"].push(createTileEle(image_config,x,y,key))
    });
  }
  function createTilemapA3(){
    const filename = tileset_filenames[2];
    if ( filename === "") return;

    const image_config = getTilemapConfig(filename)
    const tile_name_units = image_config.config.units;

    tile_name_units.forEach((tile_name,index) => {
      const x = (index % 8) * (2 * 32);
      const y = parseInt(index / 8) * (2 * 32);
      const key = `A3_${index}_${x}_${y}`
      render_tilemaps["A"].push(createTileEle(image_config,x,y,key))
    });
  }
  function createTilemapA4(){
    const filename = tileset_filenames[3];
    if ( filename === "") return;

    const image_config = getTilemapConfig(filename)
    const tile_name_units = image_config.config.units;

    tile_name_units.forEach((tile_name,index) => {
      const x = (index % 8) * (2 * 32);
      const index_y = parseInt(index / 8);
      const y = index_y % 2 === 0 ? (96 + 64) * index_y : (96 + 64) * index_y - 64;
      const key = `A4_${index}_${x}_${y}`
      render_tilemaps["A"].push(createTileEle(image_config,x,y,key))
    });
  }
  function createTilemapA5(){
    const filename = tileset_filenames[4];
    if ( filename === "") return;

    const image_config = getTilemapConfig(filename)
    const tile_name_units = image_config.config.units;

    tile_name_units.forEach((tile_name,index) => {
      const x = (index % 8) * (1 * 32);
      const y = parseInt(index / 8) * (1 * 32);
      const key = `A5_${index}_${x}_${y}`
      render_tilemaps["A"].push(createTileEle(image_config,x,y,key))
    });
  }
  function createTilemapB(){
    
  }
  function createTilemapC(){
    
  }
  function createTilemapD(){
    
  }
  function createTilemapE(){
    
  }
  function createTilemapR(){
    
  }

  function createTilemap(index){

    const background_image = require(`../assets/rtp/tilesets/${tileset_filenames[0]}.png`).default;
    const style = {
      backgroundImage: `url(${background_image})`,
      backgroundPosition: "-0px -" + (index * 32).toString() + "px"
    };

    return(
      <div key={index} className="tilemap-grid" style={style}></div>
    );
  }

  function createTilemapGrids(){
    createTilemapA1();
    createTilemapA2();
    createTilemapA3();
    createTilemapA4();
    createTilemapA5();
  }

  function getCurrentTilemapSets(){
    return render_tilemaps[props.tool_tileset.current_tab];
  }

  function handleClick(tab){
    props.dispatch({
      type: 'tool_tileset/setTab',
      tab: tab
    })
  }

  createTilemapGrids();

  return (
    <div id="container-tool-tileset-wrapper" className="area-border-color">
      <div id="container-tool-tileset">

        <div className="tilemap-grids-wrapper flex flex-row flex-wrap" style={{display: props.tool_tileset.current_tab === 'A' ? 'flex' : 'none'}}>
          {getCurrentTilemapSets().map(div => div)}
        </div>

        <div className="tilemap-grids-wrapper flex flex-row flex-wrap" style={{display: props.tool_tileset.current_tab === 'B' ? 'flex' : 'none'}}>
          <div>B-placeholder</div>
        </div>

        <div className="tilemap-grids-wrapper flex flex-row flex-wrap" style={{display: props.tool_tileset.current_tab === 'C' ? 'flex' : 'none'}}>
          <div>C-placeholder</div>
        </div>

        <div className="tilemap-grids-wrapper flex flex-row flex-wrap" style={{display: props.tool_tileset.current_tab === 'D' ? 'flex' : 'none'}}>
          <div>D-placeholder</div>
        </div>

      </div>
      <div id="container-tool-tileset-layer-tabs" className="inline-flex flex-row flex-row-center">
        <a onClick={handleClick.bind(this,'A')} className={props.tool_tileset.current_tab === 'A' ? 'active' : ''}>A</a>
        <a onClick={handleClick.bind(this,'B')} className={props.tool_tileset.current_tab === 'B' ? 'active' : ''}>B</a>
        <a onClick={handleClick.bind(this,'C')} className={props.tool_tileset.current_tab === 'C' ? 'active' : ''}>C</a>
        <a onClick={handleClick.bind(this,'R')} className={props.tool_tileset.current_tab === 'R' ? 'active' : ''}>R</a>
      </div>
    </div>
  );
};

export default connect(({ tool_tileset }) => ({ tool_tileset }))(ToolTileset);