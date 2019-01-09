// @flow

import mixpanel from "mixpanel-browser";

mixpanel.init("df8155fbd663fcf03a7fcba484cbc46e");

export function trackPage(options: any) {
  mixpanel.track("game:loaded", options);
}

export function trackAction(action: string) {
  mixpanel.track(`action:${action}`);
}
