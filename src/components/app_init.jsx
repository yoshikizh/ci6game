import React from "react";

export class AppHeaderInit extends React.Component {
  constructor(props) {
    super(props);
  }

  

  render() {
    return (
      <>
      <div id="header-proj"></div>
      <div id="header-toolbar"></div>
      <div id="header-user"></div>
      </>
    )
  }
}

export class AppBodyInit extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>Body</div>
    )
  }
}

export class AppFooterInit extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>Footer</div>
    )
  }
}

