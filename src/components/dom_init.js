function createHeader(){
  return document.createElement("header");
}

function createContainer(){
  let div = document.createElement("div");
  div.id = "container";
  return div;
}

function createFooter(){
  return document.createElement("footer");
}

function createRootTags(){
  let dom_body = document.getElementsByTagName("body")[0];
  let script = document.getElementsByTagName("script")[0];
  dom_body.insertBefore(createHeader(),script);
  dom_body.insertBefore(createContainer(),script);
  dom_body.insertBefore(createFooter(),script);
}

createRootTags();

