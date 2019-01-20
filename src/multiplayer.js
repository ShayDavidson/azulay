// @flow

import Pusher from "pusher-js";

const params = new URL(window.location).searchParams;
const channelName: ?string = params.get("channel");
const multiplayerEnabled = channelName != null;

let channel;
let socket;

if (channelName != null) {
  socket = new Pusher("56d4390b3561d3bcec29", {
    cluster: "eu"
  });

  channel = socket.subscribe(`private-${channelName}`);

  channel.bind("action", data => {
    console.log(data.message);
  });
}

export function isMultiplayerEnabled(): boolean {
  return multiplayerEnabled;
}
