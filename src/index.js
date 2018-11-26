// @flow

import React from "react";
import ReactDOM from "react-dom";
import { css } from "glamor";
// components
import GameProvider, { GameContext } from "./game_provider";
import PlayerBoard from "./ui/player_board";
import FactoryZone from "./ui/factory_zone";
import Separator from "./ui/separator";
import InfoZone from "./ui/info_zone";
import AboutLabel from "./ui/about_label";
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

class Azul extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }

  render() {
    const params = new URL(window.location).searchParams;
    const seed = params.get("seed");
    const players = params.get("players");
    const animationSpeed = params.get("animationSpeed");

    return (
      <div>
        <div className={$titleStyle}>Azulay - The Online Azul AI</div>
        <GameProvider
          players={players ? parseInt(players) : 4}
          seed={seed ? parseInt(seed) : 1000}
          animationSpeed={animationSpeed != null ? parseInt(animationSpeed) : 1}
          log={true}
          hasExternalAPI={true}
        >
          <GameContext.Consumer>
            {({ gameState }) => {
              if (gameState == undefined) return null;
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
                    <FactoryZone factories={gameState.factories} leftovers={gameState.leftovers} />
                  </div>
                  <InfoZone box={gameState.box} bag={gameState.bag} />
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
