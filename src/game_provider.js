// @flow

import Promise from "bluebird";
import React from "react";
import type { Node } from "react";
// types
import type { State, Action, ActionDispatcherPromise, ValidationError } from "./actions";
// helpers
import { createGame } from "./models";
import { reduce, validate, getMoveToRefillPhaseAction } from "./actions";

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
  animationSpeed: number,
  log?: boolean,
  hasExternalAPI?: boolean,
  children?: Node
};

/***********************************************************/

export default class GameProvider extends React.Component<Props, State> {
  state = GameProvider.getDerivedStateFromProps({ players: 0, seed: 0, animationSpeed: 1 });

  static getDerivedStateFromProps(nextProps: Props) {
    const { players, seed, animationSpeed } = nextProps;
    return {
      game: createGame(players, seed),
      ui: { selectedFactory: undefined, selectedTile: undefined, currentScoring: undefined, animationSpeed }
    };
  }

  componentDidMount() {
    this.dispatch(getMoveToRefillPhaseAction());
    if (this.props.hasExternalAPI) {
      window.setState = this.setState.bind(this);
      window.getState = () => this.state;
      window.saveState = () => localStorage.setItem("state", JSON.stringify(this.state));
      window.loadState = () => {
        const json = localStorage.getItem("state");
        if (json != null) this.setState(JSON.parse(json));
      };
    }
  }

  dispatch(actionPromiser: ActionDispatcherPromise) {
    return actionPromiser(this.internalDispatch.bind(this), this.dispatch.bind(this), this.state).catch(
      this.handleValidationError.bind(this)
    );
  }

  internalDispatch(action: Action) {
    return new Promise((resolve, reject) => {
      this.setState(prevState => {
        let validationError = validate(prevState, action);
        if (validationError) {
          reject(validationError);
          return;
        }
        return { ...reduce(prevState, action), resolver: action.manualResolve ? resolve : undefined };
      }, action.manualResolve ? undefined : () => resolve({ action, state: this.state }));
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
