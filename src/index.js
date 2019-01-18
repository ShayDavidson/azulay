// @flow

import React from "react";
import ReactDOM from "react-dom";
import { css } from "glamor";
// components
import GameProvider, { GameContext } from "./game_provider";
import PlayerBoardAnimator from "./ui/player_board_animator";
import PlayerBoard from "./ui/player_board";
import FactoryZone from "./ui/factory_zone";
import Separator from "./ui/separator";
import InfoZone from "./ui/info_zone";
import AboutLabel from "./ui/about_label";
// helpers
import { applyGlobalStyles, GLOBAL_PADDING } from "./styles.js";
import { winningPlayers } from "./models.js";
import { trackPage } from "./tracking.js";

/***********************************************************/

type Props = {
  /* ... */
};

type State = {
  /* ... */
};

/***********************************************************/

const $titleStyle = css({
  fontSize: "0.5em",
  marginBottom: 5
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

/***********************************************************/

const params = new URL(window.location).searchParams;

const seed = params.get("seed") ? params.get("seed") : 1000;
const players = params.get("players") ? params.get("players") : 4;
const animationSpeed = params.get("animationSpeed") ? params.get("animationSpeed") : 1;

/***********************************************************/

class Azul extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className={$titleStyle}>Azulay - The Online Azul AI</div>
        <GameProvider
          players={parseInt(players)}
          seed={parseInt(seed)}
          animationSpeed={parseInt(animationSpeed)}
          log={true}
          hasExternalAPI={true}
        >
          <GameContext.Consumer>
            {({ gameState, presentationState, resolver }) => {
              if (gameState == undefined) return null;
              const numberOfPlayers = gameState.players.length;
              const $boardsGridStyle = { gridTemplateColumns: `repeat(${numberOfPlayers > 2 ? 2 : 1}, 1fr)` };
              return (
                <div>
                  <div className={$gameStyle}>
                    <div className={$boardsStyle} style={$boardsGridStyle}>
                      {gameState.players.map((player, index) => {
                        const currentPlayer = gameState.currentPlayer == index;
                        return (
                          <PlayerBoardAnimator
                            key={index}
                            player={player}
                            scoring={currentPlayer ? presentationState.currentScoring : undefined}
                            resolver={currentPlayer ? resolver : undefined}
                          >
                            {(player, highlights) => (
                              <PlayerBoard
                                player={player}
                                highlights={highlights}
                                current={currentPlayer}
                                label={
                                  gameState.phase == "end"
                                    ? winningPlayers(gameState).includes(player) ? "Won!" : "Lost"
                                    : undefined
                                }
                              />
                            )}
                          </PlayerBoardAnimator>
                        );
                      })}
                    </div>
                    <FactoryZone factories={gameState.factories} leftovers={gameState.leftovers} />
                  </div>
                  <InfoZone box={gameState.box} bag={gameState.bag} turn={gameState.turn} />
                </div>
              );
            }}
          </GameContext.Consumer>
        </GameProvider>
        <Separator type="horizontal" />
        <AboutLabel />
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

trackPage({ seed, players, animationSpeed });
