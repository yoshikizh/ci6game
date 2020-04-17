const _ = require('lodash');

const getCurrentMapInfo = () => {
  const game_data = App.game_data;
  const map_info = game_data.map_infos[1];
  const map_id = map_info.id;
  const game_map = game_data.maps[map_id];

  return {
    id: map_id,
    name: map_info.name,
    width: game_map.width,
    height: game_map.height
  }
}

export default {
  namespace: "status_bar",
  state: {
    tilename: "",
    zoom: 100,
    cursor_pos: [0,0],
    map_status: getCurrentMapInfo()
  },
  reducers: {
    zoomIn: (state,params) => {
      state.zoom += params.n;
      return _.clone(state);
    },
    zoomOut: (state,params) => {
      state.zoom -= params.n;
      return _.clone(state);
    },
    setTilename: (state, params) => {
      state.tilename = params.tilename;
      return _.clone(state);
    },
    setCurrentCursorPos: (state,params) => {
      state.cursor_pos = params.pos;
      return _.clone(state);
    },
    setMapInfo: (state, params) => {
      state.map_status = params.info;
      return _.clone(state);
    }
  }
}
