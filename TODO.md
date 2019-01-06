# TODO

## Actions

* Game end - show winner.
* Check what happens if a player doesn't score.
* Check all tiles from staging rows are put into box.

## Prioritized

* Floating number when socring tiles.
* Highlight tiles in play.
* Game end.

## Delight

* Better noise reduction on sounds.
* Organize tiles in factories and groups.
* Tile transition from places in the window.
* Random rotations for tiles.
* Cursor pointer on whole stagingrow/floor rather than placements.

## Refactors

* Add `immer`.
* Separate game provider from dispatcher.
* Have a config sub-state.
* Flowtype for actions hard-typed.
* Can't be wrong in floor placement - always for current player.
* Followup dispatch is weird. Get rid of it?
* Error fallback flow type crap (Because of & misuse)
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
