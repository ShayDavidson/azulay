// @flow

import ga from "ga-browser";

ga("create", "UA-57428971-3", "auto");

export function trackPage() {
  ga("send", "pageview", { page: "index" });
}

export function trackAction(action: string) {
  ga("send", {
    hitType: "event",
    eventCategory: "action",
    eventAction: action
  });
}
