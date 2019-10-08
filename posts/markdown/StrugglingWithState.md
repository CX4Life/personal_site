# Strugling with State

Mostly has to do with the issue I've had working
on the Hydrants PWA, where I'm fighting between
Context Providers/Consumers, global state containers,
stateful components, and hooks.

Each thing was used for a reason, but untangling it
when trying to add functionality really slows down
development, and the temptation is to just roll your
own way of interacting with existing state. This
has lead to many variable names for the same
state-modifying function throughout the app, as that
function is passed around as props.

A solution is to keep the modifications to state very
simple. An idea is to create higher order components
which expose these functions, and perform common
updates in an optimized way, then forcing each
child component to do UI-based updates to state at
that component's level with a hook. This is similar to
the approach in V6, wherein we use a Redux store for
initial state, retreive that state, and perform
modifications with hooks.
