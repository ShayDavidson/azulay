// @flow

import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { css } from "glamor";
// components
import GameProvider, { GameContext } from "./components/game_provider";
import PlayerBoard from "./components/ui/player_board";
import FactoryZone from "./components/ui/factory_zone";
// helpers
import { applyGlobalStyles, GLOBAL_PADDING } from "./styles.js";

/***********************************************************/

type Props = {
  /* ... */
};

type State = {
  /* ... */
};

/***********************************************************/

const $titleStyle = css({
  fontSize: "1.5em",
  marginBottom: 5
});

const $aboutStyle = css({
  fontSize: "0.75em",
  marginTop: 10
});

const $boardsStyle = css({
  display: "grid",
  gridTemplateColumns: `repeat(2, 1fr)`,
  gridTemplateRows: `repeat(2, 1fr)`,
  gridAutoFlow: "column",
  gridGap: GLOBAL_PADDING,
  width: "max-content"
});

/***********************************************************/

class Azul extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <div className={$titleStyle}>Azulay - The Online Azul AI</div>
        <GameProvider players={4} seed={6070}>
          <GameContext.Consumer>
            {gameState => {
              return (
                <Fragment>
                  <div className={$boardsStyle}>
                    {gameState.players.map((player, index) => {
                      return <PlayerBoard player={player} current={gameState.currentPlayer == index} key={index} />;
                    })}
                  </div>
                  {/* <FactoryZone players={gameState.players.length} factories={gameState.factories} />; */}
                </Fragment>
              );
            }}
          </GameContext.Consumer>
        </GameProvider>
        <div className={$aboutStyle}>
          Created by Shay Davidson (shay.h.davidson@gmail.com, @ShayHDavidson).
          <br />
          Azul was creaetd by Michael Kiesling and published by Plan B Games.
        </div>
      </div>
    );
  }
}

/***********************************************************/

applyGlobalStyles();

const container: ?HTMLElement = document.getElementById("container");
if (container != null) {
  ReactDOM.render(<Azul />, container);
}
