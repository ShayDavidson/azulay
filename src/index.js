// @flow

import React from "react";
import ReactDOM from "react-dom";
import { css } from "glamor";
// components
import GameProvider, { GameContext } from "./components/game_provider";
import PlayerBoard from "./components/ui/player_board";
import FactoryZone from "./components/ui/factory_zone";
import Separator from "./components/ui/separator";
// helpers
import { applyGlobalStyles, GLOBAL_PADDING } from "./styles.js";
import { getTilesInColorCounter } from "./models.js";

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
  gridTemplateRows: `repeat(1, 1fr)`,
  gridGap: GLOBAL_PADDING,
  width: "max-content",
  marginRight: GLOBAL_PADDING
});

const $gameStyle = css({
  display: "flex"
});

const $infoStyle = css({
  marginTop: GLOBAL_PADDING,
  marginBottom: GLOBAL_PADDING
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
              const numberOfPlayers = gameState.players.length;
              const $boardsGridStyle = { gridTemplateColumns: `repeat(${numberOfPlayers > 2 ? 2 : 1}, 1fr)` };
              return (
                <div>
                  <div className={$gameStyle}>
                    <div className={$boardsStyle} style={$boardsGridStyle}>
                      {gameState.players.map((player, index) => {
                        return <PlayerBoard player={player} current={gameState.currentPlayer == index} key={index} />;
                      })}
                    </div>
                    <FactoryZone players={numberOfPlayers} factories={gameState.factories} />
                  </div>
                  <div className={$infoStyle}>
                    <div>Tiles in bag: {getTilesInColorCounter(gameState.bag)}</div>
                    <div>Discarded tiles: {getTilesInColorCounter(gameState.box)}</div>
                  </div>
                </div>
              );
            }}
          </GameContext.Consumer>
        </GameProvider>
        <Separator type="horizontal" />
        <div className={$aboutStyle}>
          Created by Shay Davidson (<a href="mailto:shay.h.davidson@gmail.com">shay.h.davidson@gmail.com</a>,
          <a rel="noopener noreferrer" target="_blank" href="https://twitter.com/ShayHDavidson">
            @ShayHDavidson
          </a>).
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
