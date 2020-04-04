import React from "react";

const AppBodyInit = (props) => {

  const tileset_filenames = App.dprops.project.current_map.tileset_filenames;
  let render_tilemaps = [];

  function createTileEle(image_config, x,y){
    const width = image_config.config.width / 1.5;
    const height = image_config.config.height / 1.5;
    const style = {
      backgroundImage: `url(${image_config.image})`,
      backgroundPosition: `-${x}px -${y}px`,
      backgroundSize: `${width}px ${height}px`
    };
    const key = `${x}_${y}`;
    return(
      <div key={key} class="tilemap-grid" style={style}></div>
    );
  }

  function getTilemapConfig(filename){
    const image_config = App.config.app.rtp.tileset[filename];
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
    const background_image = image_config.image;

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
        render_tilemaps.push(createTileEle(image_config,x,y))
      });
    });
    return render_tilemaps;
  }

  function createTilemapA2(){
    
  }
  function createTilemapA3(){
    
  }
  function createTilemapA4(){
    
  }
  function createTilemapA5(){
    
  }
  function createTilemapB(){
    
  }
  function createTilemapC(){
    
  }
  function createTilemapD(){
    
  }
  function createTilemapE(){
    
  }

  function createTilemap(index){

    const background_image = require(`../assets/rtp/tilesets/${tileset_filenames[0]}.png`).default;
    const style = {
      backgroundImage: `url(${background_image})`,
      backgroundPosition: "-0px -" + (index * 32).toString() + "px"
    };

    return(
      <div key={index} class="tilemap-grid" style={style}></div>
    );
  }

  function createTilemapGrids(callback){
    return createTilemapA1();
  }

  return (
    <div id="container-wrapper" class="main-background-gradient flex flex-row">
      <div id="container-tool-area">
        <div id="container-tool-tileset-wrapper" class="area-border-color">
          <div id="container-tool-tileset">
            <div id="tilemap-grids-wrapper" class="flex flex-row flex-wrap">
              {createTilemapGrids().map(div => div)}
            </div>
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