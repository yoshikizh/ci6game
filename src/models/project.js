var _ = require('lodash');

function getCurrentMapInfo(){
  const game_data = App.game_data;
  const map_info = game_data.map_infos[1];
  const map_id = map_info.id;
  const game_map = game_data.maps[map_id];

  const tileset_id = game_data.maps[map_id].tilesetId;
  const tileset = game_data.tilesets[tileset_id];
  const tileset_filenames = tileset.tilesetNames;

  return {
    id: map_id,
    name: map_info.name,
    width: game_map.width,
    height: game_map.height,
    tileset_filenames: tileset_filenames
  }
}

function getDefaultSession(){
  return {
    proj_name: App.config.app.default_proj_name,
    current_mode: "event",
    current_manager: "map",
    current_draw: null,
    current_zoom: 100,
    current_cursor_pos: [0,0],
    current_tile_set: "A"
  }
}

export default {
  namespace: "project",
  state: {
    session: getDefaultSession(),
    current_map: getCurrentMapInfo()
  },
  reducers: {
    setCurrentModeToEvent: (state) => {
      state.session.current_mode = "event";
      return _.clone(state);
    },
    setCurrentModeToMap: (map) => {
      state.session.current_mode = "map";
      return _.clone(state);
    },
    setCurrentMapZoom: (state,params) => {
      state.session.current_zoom += params.n;
      return _.clone(state);
    },
    setCurrentCursorPos: (pos) => {
      state.session.current_cursor_pos = pos;
      return _.clone(state);
    },

  }
}