import Dva, { connect } from 'dva';
import "@babel/polyfill";


// 初始化配置
function initializeConfig(){

  // 初始化 app 配置
  const app_config = require("../config/app.config.json5");
  app_config.interface_size.window_width = window.innerWidth;
  app_config.interface_size.window_height = window.innerHeight;
  app_config.interface_size.body_height = window.innerHeight - app_config.interface_size.header_height - app_config.interface_size.footer_height;

  // 初始化 多语言 配置
  const default_lang = app_config.default_lang;
  const i18n_config = require(`../config/i18n/${default_lang}.config.json5`);
  const tileset_names = require("../config/tileset_name.json5");

  // 配置全局Config
  window.App.config = {
    app: app_config,
    i18n: i18n_config,
    tileset_names: tileset_names
  }

  // 配置全局调用的 dva props
  window.App.props = {};
}

// // 初始化全局对象
// function initializeGlobalObject(){
//   window.UtilsEditor = require('./utils_editor.js').default;
// }

// 初始化 dva
function initializeDva(){

  // 载入 dva model
  const ModelProject = require('./models/project').default;
  const ModelStatusBar = require('./models/status_bar').default;
  const ModelToolTileset = require('./models/tool_tileset').default;
  const ModelToolbar = require('./models/toolbar').default;
  const ModelMapTree = require('./models/map_tree').default;
  const ModelEvent = require('./models/event').default;

  // 初始化 dva app
  const dva_app = Dva();
  dva_app.model(ModelProject);
  dva_app.model(ModelStatusBar);
  dva_app.model(ModelToolTileset);
  dva_app.model(ModelToolbar);
  dva_app.model(ModelMapTree);
  dva_app.model(ModelEvent);
  window.App.dva = dva_app;
}

// 初始化游戏数据
function initializeGameData(){
  const data_actors = require('../data/Actors.json5');               // 角色数据
  const data_classes = require('../data/Classes.json5');             // 职业数据
  const data_weapons = require('../data/Weapons.json5');             // 武器数据
  const data_armors = require('../data/Armors.json5');               // 防具数据
  const data_skills = require('../data/Skills.json5');               // 技能数据
  const data_items = require('../data/Items.json5');                 // 物品数据
  const data_animations = require('../data/Animations.json5');       // 动画数据
  const data_enemies = require('../data/Enemies.json5');             // 敌人数据
  const data_troops = require('../data/Troops.json5');               // 敌人队伍数据
  const data_states = require('../data/States.json5');               // 状态数据
  const data_tilesets = require('../data/Tilesets.json5');           // 图块数据
  const data_system = require('../data/System.json5');               // 系统设置数据
  const data_common_events = require('../data/CommonEvents.json5');  // 公共事件数据
  const data_map_infos = require('../data/MapInfos.json5');          // 地图信息数据
  const data_map001 = require('../data/Map001.json5');               // 初始地图数据
  const data_map002 = require('../data/Map002.json5');               // 初始地图数据
  const data_map003 = require('../data/Map003.json5');               // 初始地图数据
  const data_map004 = require('../data/Map004.json5');               // 初始地图数据
  const data_map005 = require('../data/Map005.json5');               // 初始地图数据
  const data_map006 = require('../data/Map006.json5');               // 初始地图数据
  const data_map007 = require('../data/Map007.json5');               // 初始地图数据

  window.App.game_data = {
    actors: data_actors,
    classes: data_classes,
    weapons: data_weapons,
    armors: data_armors,
    skills: data_skills,
    items: data_items,
    animations: data_animations,
    enemies: data_enemies,
    troops: data_troops,
    states: data_states,
    tilesets: data_tilesets,
    system: data_system,
    common_events: data_common_events,
    map_infos: data_map_infos,
    maps: [null, data_map001,data_map002,data_map003,data_map004,data_map005,data_map006,data_map007]
  };
}

// 初始化管理器(单例管理器)
function initializeManagement(){

  // 初始化 Cache 管理器
  window.CacheManager = require('./managements/cache_management').default;

  // 初始化 主题 管理器
  window.ThemeManager = {};

  // 初始化 Api 管理器
  window.ApiManager = {};

  // 初始化 Temp 管理器
  window.TempManager = require('./managements/temp_management').default;

}

// 初始化主题样式
function initThemeStyle(){
  const theme = App.config.app.default_theme;
  require(`./assets/styles/scss/theme/${theme}.scss`);
}

// 初始化 React 组件
function initializeReactComponent(){

  // 初始化 index 组件
  require("./components/index");

}

// 初始化 Assets
function initializeAssets(){
  require("./assets/styles/app.css");
  require("./assets/styles/scss/app.scss");
}

// 初始化 PIXI 模块
function initGameCore(){
  require("./models/game/index");
}

// 初始化 Hack
function initializeHack(){
  require("./hack/rpg/_index");
}

function initMapEditorArea(){
  SceneManager.gameStart("editor","rmmv-map-editor",App.game_data.map_infos[1].id);
}

function initAppApi(){
  require("./app_api");
}

function initializeUtils(){
  require("./utils");
}

// 入口函数
function main(){
  window.App = new Object();
  initializeUtils();
  initializeHack();
  initializeConfig();
  initializeGameData();
  initializeManagement();
  initializeAssets();
  initializeDva();
  initThemeStyle();
  initializeReactComponent();
  initGameCore();
  initAppApi();
  initMapEditorArea();
}

window.addEventListener('load', function () {
  main();
});