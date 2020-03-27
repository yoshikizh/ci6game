// 初始化配置
function initializeConfig(){

  // 初始化 app 配置
  const app_config = require("../config/app.config.json5");
  const default_lang = app_config.default_lang;

  // 初始化 多语言 配置
  const i18n_config = require(`../config/i18n/${default_lang}.config.json5`);

  // 配置全局Config
  window.App.config = {
    app: app_config,
    i18n: i18n_config
  }
}

// 初始化游戏数据
function initializeGameData(){

  // 角色数据

  // 敌人数据

  // 地图数据

  // ...
}

// 初始化管理器(单例管理器)
function initializeManagement(){

  // 初始化 Cache 管理器

  // 初始化 主题 管理器

  // 初始化 Api 管理器

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

// 入口函数
function main(){
  window.App = new Object();
  initializeConfig();
  initializeGameData();
  initializeManagement();
  initializeAssets();
  initializeReactComponent();
}

window.addEventListener('load', function () {
  main();
});