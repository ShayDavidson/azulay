// @flow

import React, { Fragment, Component } from "react";
import ReactDOM from "react-dom";
import { applyGlobalStyles } from "./styles.js";

/***********************************************************/

import Wall from "./components/wall";

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
