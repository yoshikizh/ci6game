var _ = require('lodash');

export default {
  namespace: "database",
  state: {
    show_database_window: false,
    current_tab: "actor"
  },

  reducers: {
    showDatabaseWindow: (state) => {
      state.show_database_window = true;
      return _.clone(state);
    },
    hideDatabaseWindow: (state) => {
      state.show_database_window = false;
      return _.clone(state);
    },
    setCurrentTab: (state,params) => {
      state.current_tab = params.tab;
      return _.clone(state);
    }
  }
}