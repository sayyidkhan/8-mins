# The Next 8 Minutes

**Draw your way home.** A playable storybook about helping Bob refuse pressure, find support, and get home safely. Built for the anti-drug hackathon with React, TypeScript, and Vite.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (port `3000` by default; Vite chooses another port if it is occupied).

```sh
npm run lint    # TypeScript checks
npm run build   # Production output in dist/
npm run preview
```

No API key or backend is required for this POC.

## Play

1. Choose the **8-second challenge** or **Untimed** on the cover.
2. Read a chapter, review the possible actions, and explicitly start the challenge.
3. Select an object, then hold and trace its dotted outline with a mouse, finger, or pen.
4. Watch the object appear in the scene and read the result of Bob's action.
5. Complete five chapters to fill the final sketchbook with your actual choices.

Selection and tracing share one eight-second window. Missing the timer offers a retry or untimed recovery. Earlier chapters are retained during the playthrough. Pause, help, and switching away from the tab stop the clock; returning from another tab requires an explicit resume.

Untimed mode also provides a keyboard-accessible **Bring drawing to life** button. There is no moral score or claim that a missed timer increases drug desire.

## Implementation

| File | Purpose |
| --- | --- |
| `src/App.tsx` | Game states, timer, chapter navigation, recovery, dialogs, and ending |
| `src/game/story.ts` | Five authored chapters, choices, consequences, and support links |
| `src/game/TraceCanvas.tsx` | SVG outline sampling and pointer-coverage tracing |
| `src/game/StoryWorld.tsx` | Original layered SVG scenery, characters, and materialised objects |
| `src/index.css` | Responsive storybook UI |
| `src/game/trace.css`, `src/game/world.css` | Tracing and scene styles |

Tracing measures distinct outline coverage, with generous distance tolerance. A stationary tap or unrelated stroke cannot complete an object. The POC uses local, deterministic interactions and authored outcomes; it does not call an AI service. Reference images in `research/` are inspiration, not artwork shipped in the game.

Progress is held in memory and resets on reload or replay. The existing starter components in `src/components/` are not used by this experience.

## Product context

- [Product requirements](docs/game-prd.md)
- [Hackathon brief](docs/hackathon-problem-statement.md)
- [Judging criteria](docs/hackathon-judging-criteria.md)
- [Storybook inspiration](docs/inspiration/the-tale-we-drew-linkedin.md)

The story is educational rehearsal, not medical advice. Emergency guidance is fixed and Singapore-specific: call **995**, stay with the person, and follow the operator. Educational wording should be reviewed with a hackathon facilitator before submission.
