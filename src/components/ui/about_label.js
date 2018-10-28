// @flow

import React from "react";
import { css } from "glamor";

/***********************************************************/

type Props = {
  /* ... */
};

type State = {
  /* ... */
};

/***********************************************************/

const $baseStyle = css({
  fontSize: "0.75em",
  marginTop: 10
});

/***********************************************************/

export default class AboutLabel extends React.Component<Props, State> {
  render() {
    return (
      <div className={$baseStyle}>
        Created by Shay Davidson (<a href="mailto:shay.h.davidson@gmail.com">shay.h.davidson@gmail.com</a>,
        <a rel="noopener noreferrer" target="_blank" href="https://twitter.com/ShayHDavidson">
          @ShayHDavidson
        </a>).
        <br />
        Azul was creaetd by Michael Kiesling and published by Plan B Games.
      </div>
    );
  }
}
