// @flow

import React from "react";
import ReactDOM from "react-dom";
import { applyGlobalStyles } from "./styles.js";

/***********************************************************/

import GameProvider, { GameContext } from "./components/game_provider";
import PlayerZone from "./components/ui/player_zone";

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
      <GameProvider players={1} seed={6070}>
        <GameContext.Consumer>
          {gameState => {
            return gameState.players.map((player, index) => <PlayerZone player={player} key={index} />);
          }}
        </GameContext.Consumer>
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
