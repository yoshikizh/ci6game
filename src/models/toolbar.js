const _ = require('lodash');

export default {
  namespace: "toolbar",
  state: {
    proj_name: App.config.app.default_proj_name,
    current_mode: "event",
    current_manager: "map",
    current_draw: null
  },
  reducers: {
    setCurrentModeToEvent: (state) => {
      state.current_mode = "event";
      return _.clone(state);
    },
    setCurrentModeToMap: (map) => {
      state.current_mode = "map";
      return _.clone(state);
    }
  }
}
