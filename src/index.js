// @flow

import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { applyGlobalStyles } from "./styles.js";

/***********************************************************/

import GameProvider from "./components/game_provider";
import Wall from "./components/ui/wall";

/***********************************************************/

type Props = {
  /* ... */
};

type State = {
  /* ... */
};

/***********************************************************/

class Azul extends React.Component<Props, State> {
  render() {
    return (
      <GameProvider>
        <Fragment>
          <Wall />
        </Fragment>
      </GameProvider>
    );
  }
}

/***********************************************************/

applyGlobalStyles();

const container: ?HTMLElement = document.getElementById("container");
if (container != null) {
  ReactDOM.render(<Azul />, container);
}
