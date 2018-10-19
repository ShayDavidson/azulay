// @flow

import React, { Fragment, Component } from "react";
import ReactDOM from "react-dom";
import { applyGlobalStyles } from "./styles.js";

/***********************************************************/

import Wall from "./components/wall";
import Factory from "./components/factory";

/***********************************************************/

type Props = {
  /* ... */
};

type State = {
  /* ... */
};

class Azul extends Component<Props, State> {
  render() {
    return (
      <Fragment>
        <Wall />
        <Factory />
        <Factory />
        <Factory />
        <Factory />
      </Fragment>
    );
  }
}

/***********************************************************/

applyGlobalStyles();

const container: ?HTMLElement = document.getElementById("container");
if (container != null) {
  ReactDOM.render(<Azul />, container);
}
