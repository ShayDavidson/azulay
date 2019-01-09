// @flow

import ga from "ga-browser";

const client = ga();

client("create", "UA-57428971-3", "auto");

export function trackPage() {
  client("send", "pageview", { page: "index" });
}

export function trackAction(action: string) {
  client("send", {
    hitType: "event",
    eventCategory: "action",
    eventAction: action
  });
}
