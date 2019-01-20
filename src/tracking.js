// @flow

import mixpanel from "mixpanel-browser";
import type { Game } from "./models";

mixpanel.init("df8155fbd663fcf03a7fcba484cbc46e");

export function trackPage(payload: {} = {}) {
  mixpanel.track("game:loaded", payload);
}

export function trackAction(action: string, game: Game) {
  mixpanel.track(`action:${action}`, {
    turn: game.turn,
    scores: game.players.map(player => player.score)
  });
}
