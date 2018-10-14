// @flow

import React, { Fragment, Component } from "react";
import ReactDOM from "react-dom";
import { applyGlobalStyles } from "./styles.js";

/***********************************************************/

import Tile from "./components/tile";

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
        <Tile color={0} />
        <Tile color={1} />
        <Tile color={2} />
        <Tile color={3} />
        <Tile color={4} />
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
