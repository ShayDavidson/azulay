# TODO

## Prioritized

* Stop drawing if wrong state (load state).
* Cascading step in sound
* Audio delay in mobile?
* Game end.
* Solve performance issue (z-index thing?).
* Organize tiles in factories and groups.
* Cursor pointer on whole stagingrow/floor rather than placements.
* Extra validations and TODOs.
* Manual resolve - right API? probably need to have a promise that says "waiting for" and provides a thing.
* Start game / end / restart UI.
* Followup dispatch is weird. Get rid of it?
* Ornament for first tile.

## Delight

* Tiles out of placement / factory animation.
* Better bonus scoring effect.
* Animation speed for scoring as well.
* Cascading floor scoring.
* Better noise reduction on sounds.

## Refactors

* Add `immer`.
* Separate game provider from dispatcher.
* Have a config sub-state.
* Flowtype for actions hard-typed.
* Can't be wrong in floor placement - always for current player.
* Error fallback flow type crap (Because of & misuse)
* Flow type checking better for context.
* Generic game provider.
* Organizer actions, models, index, provider etc.
* Player Board animator children flowtype.
* Log action if it's valid, but before it's committed.

## Next Phase

* Make it an SDK.
* UI for picking seed / players.
* Responsive design - mobile.
* AI.
* Tile transition from places in the window.
