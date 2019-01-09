// @flow

import ua from "universal-analytics";

export const client = ua("UA-57428971-3");

export function trackPage() {
  client.pageview("/").send();
}

export function trackAction(action: string) {
  client.event("action", action).send();
}
