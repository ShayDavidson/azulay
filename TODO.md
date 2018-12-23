# TODO

## Actions

* Game end - show winner.
* Check what happens if a player doesn't score.
* Check all tiles from staging rows are put into box.

## Delight

* When turn passes highlight the turn info.
* Organize tiles in factories and groups.
* Highlight/animate tile counters when they change.
* Tile transition from places in the window.
* Random rotations for tiles.
* Highlight more board when it's a player's turn (scale? flash?).
* Cursor pointer on whole stagingrow/floor rather than placements.

## Refactors

* Check silly re-renders when selecting tile/placement.
* Separate game provider from dispatcher.
* Have a config sub-state.
* Flowtype for actions hard-typed
* Can't be wrong in floor placement - always for current player.
* Followup dispatch is weird. Get rid of it?
* Error fallback flow type crap (Because of & misuse)
* More Immutable helpers.
* Flow type checking better for context.
* Generic game provider.
* Manual resolve - right API?
* Organizer actions, models, index, provider etc.
* Player Board animator children flowtype.

## Next Phase

* Make it an SDK.
* UI for picking seed / players.
* Responsive design - mobile.
* Multiplier.
* AI.
