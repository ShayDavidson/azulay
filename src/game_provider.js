// @flow

import Promise from "bluebird";
import React from "react";
import type { Node } from "react";
// types
import type { State, Action, ActionDispatcherPromise, ValidationError } from "./actions";
// helpers
import { createGame } from "./models";
import { createResetUI } from "./ui_models";
import { reduce, validate, getDrawTileFromBagIntoFactoriesAction } from "./actions";

/***********************************************************/

export const GameContext: Object = React.createContext();

/***********************************************************/

type ActionResult = {|
  action: Action,
  state: State
|};

type Props = {
  players: number,
  seed: number,
  log?: boolean,
  children?: Node
};

/***********************************************************/

export default class GameProvider extends React.Component<Props, State> {
  state = GameProvider.getDerivedStateFromProps({ players: 0, seed: 0 });

  static getDerivedStateFromProps(nextProps: Props) {
    const { players, seed } = nextProps;
    return {
      game: createGame(players, seed),
      ui: createResetUI()
    };
  }

  componentDidMount() {
    this.dispatch(getDrawTileFromBagIntoFactoriesAction());
  }

  dispatch(actionPromiser: ActionDispatcherPromise) {
    return actionPromiser(this.internalDispatch.bind(this), this.dispatch.bind(this)).catch(
      this.handleValidationError.bind(this)
    );
  }

  internalDispatch(action: Action) {
    return new Promise((resolve, reject) => {
      this.setState(
        prevState => {
          let validationError = validate(prevState, action);
          if (validationError) {
            reject(validationError);
            return;
          }
          return reduce(prevState, action);
        },
        () => resolve({ action, state: this.state })
      );
    }).then(this.logActionResult.bind(this));
  }

  logActionResult(result: ActionResult) {
    if (this.props.log) console.log(result.action.type, result);
  }

  handleValidationError(error: ValidationError) {
    this.logValidationError(error);
    if (error.fallbackAction != undefined) {
      return this.dispatch(error.fallbackAction);
    }
  }

  logValidationError(error: ValidationError) {
    if (this.props.log) console.warn(error.message, error.action, error.state);
  }

  render() {
    return (
      <GameContext.Provider
        value={{
          gameState: this.state.game,
          uiState: this.state.ui,
          dispatch: this.dispatch.bind(this)
        }}
      >
        {this.props.children}
      </GameContext.Provider>
    );
  }
}
