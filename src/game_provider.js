// @flow

import Promise from "bluebird";
import React from "react";
import type { Node } from "react";
// types
import type {
  State,
  Action,
  ActionDispatcherPromise,
  ActionPromiseDispatcher,
  ValidationError,
  Resolver
} from "./actions";
import type { Game } from "./models";
import type { UI, Presentation, Config } from "./ui_models";
// helpers
import { createGame } from "./models";
import { reduce, validate, getMoveToRefillPhaseAction } from "./actions";

/***********************************************************/

export type Context = {|
  gameState: Game,
  uiState: UI,
  presentationState: Presentation,
  configState: Config,
  resolver?: ?Resolver,
  dispatch: ActionPromiseDispatcher
|} | void;

export const GameContext = React.createContext<Context>(undefined); // prettier-ignore

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
      ui: { selectedFactory: undefined, selectedTile: undefined },
      presentation: { currentScoring: undefined },
      config: { animationSpeed },
      ai: undefined,
      resolver: undefined
    };
  }

  componentDidMount() {
    this.dispatch(getMoveToRefillPhaseAction());
    if (this.props.hasExternalAPI) {
      window.setState = this.setState.bind(this);
      window.getState = () => this.state;
      window.saveState = () => localStorage.setItem("state", JSON.stringify({ ...this.state, ui: {} }));
      window.loadState = () => {
        const json = localStorage.getItem("state");
        if (json != null) this.setState(JSON.parse(json));
      };
    }
  }

  getState() {
    return this.state;
  }

  dispatch(actionPromiser: ActionDispatcherPromise) {
    return actionPromiser(this.internalDispatch.bind(this), this.dispatch.bind(this), this.getState.bind(this)).catch(
      this.handleValidationError.bind(this)
    );
  }

  internalDispatch(action: Action) {
    return new Promise((resolve, reject) => {
      const resolver = () => resolve({ action, state: this.state });
      this.setState(
        prevState => {
          let validationError = validate(prevState, action);
          if (validationError) {
            reject(validationError);
            return;
          }
          const state = reduce(prevState, action);
          return action.manualResolve ? { ...state, resolver } : { ...state, resolver: undefined };
        },
        action.manualResolve ? undefined : resolver
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
    const { game, ui, presentation, config, resolver } = this.state;
    return (
      <GameContext.Provider
        value={{
          gameState: game,
          uiState: ui,
          presentationState: presentation,
          configState: config,
          resolver: resolver,
          dispatch: this.dispatch.bind(this)
        }}
      >
        {this.props.children}
      </GameContext.Provider>
    );
  }
}
