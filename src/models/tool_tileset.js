const _ = require('lodash');

const getCurrentMapTilesetNames = (map_id) => {
  const game_data = App.game_data;


  // const map_info = game_data.map_infos[current_map_id];
  // const map_id = map_info.id;
  // const game_map = game_data.maps[map_id];

  const tileset_id = game_data.maps[map_id].tilesetId;
  const tileset = game_data.tilesets[tileset_id];
  const tileset_filenames = tileset.tilesetNames;

  return tileset_filenames;
}


export default {
  namespace: "tool_tileset",
  state: {
    current_map_id: App.game_data.map_infos[1].id,
    current_tab: 'A',
    selected_tile_id: null,
    tileset_filenames: getCurrentMapTilesetNames(App.game_data.map_infos[1].id)
  },

  effects: {
    * changeTile ({ params }, { call, put, select }) {
      const tile_id = params.tile_id;
      const tile_arr = tile_id.split("|");
      const tile_type = tile_arr[0];
      const tilesetname = tile_arr[1];
      let tilename;
      let tile_index;
      if (tile_type === "A1") {
        tile_index = parseInt(tile_arr[2]) * 8 + parseInt(tile_arr[3]);
      }
      if (["A2","A3","A4","A5","B","C","D","E"].includes(tile_type)) {
        tile_index = parseInt(tile_arr[2]);
      }
      tilename = App.config.tileset_names[tilesetname].units[tile_index] || "";
      yield put({ type: 'selectTile', tile_id: tile_id });
      yield put({ type: 'status_bar/setTilename', tilename: tilename.split("|")[0] });
    }
  },

  reducers: {
    setCurrentTilesetNames: (state, params) => {
      state.tileset_filenames = getCurrentMapTilesetNames(params.map_id);
      return _.clone(state);
    },
    setTab: (state,params) => {
      state.current_tab = params.tab;
      return _.clone(state);
    },
    selectTile: (state, params) => {
      state.selected_tile_id = params.tile_id;
      return _.clone(state);
    }
  }
}