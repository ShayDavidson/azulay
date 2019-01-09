export function trackPage() {
  if (!window.ga) return;
  window.ga("send", "pageview");
}

export function trackAction(action) {
  if (!window.ga) return;
  window.ga("send", "event", "action", action);
}
