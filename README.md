# Test: Writing a multiple choice exercise in Lexical

This is a test repository for adding support for multiple choice exercises in Lexical. Natively Lexical does not supprt object types as nodes in the document tree. However one can model such node as a tuple (e.g. `exercise = [question, answer]`) and add appropriate node transformations that this structure is always kept.

## Findings

- No other way than using node transformations to enforce the structure seems to
  be possible, see
  [this discussion](https://github.com/facebook/lexical/discussions/7750)

## Limitations

- Implementing all necessary normalizations / node transformations is complex,
  especially for nested structures (see
  [those code lines](https://github.com/kulla/2025-11-08-lexical-with-multiple-choice-exercise/blob/a265396fc171ecd5078cff2b5a9de9c337df4276/src/plugins/exercise.tsx#L339-L589)).
  Helpers are needed to simplify this task. It does not seem feasable to add all necessary node transformations.
- I miss the possibility to overwrite behavior of nodes (like how a node is split).
- Uneditable content is hard to implement in Lexical (currently CSS with
  `:before` and `content: "xyz"` is used as a workaround)

## Setup

1. Clone the repository
2. Install the dependencies via `bun install`

## Get started

Start the dev server:

```bash
bun dev
```

Build the app for production:

```bash
bun run build
```

Preview the production build locally:

```bash
bun preview
```

## Maintenance

Update dependencies:

```bash
bun update
```
