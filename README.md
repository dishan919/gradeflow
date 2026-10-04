# GradeFlow

GPA Calculator & Academic Planner

A mobile-first, monochrome React application for tracking semesters, calculating credit-weighted GPA and CGPA, and planning academic goals. Everything runs in your browser. No backend, external database, API keys, or paid hosting is required.

## Features and screens

- Splash screen with automatic session routing.
- Register and login with validation, password visibility, salted PBKDF2 password hashes via Web Crypto, and separate data for each local account.
- Dashboard with personalized greeting, CGPA, credit count, and recent semesters.
- Calculator with editable subjects, credit inputs, grades, calculation preview, and semester saving.
- History with semester details, editing, and confirmed deletion.
- CGPA detail with semester performance bars.
- Target planner with credit-weighted required GPA and unreachable-target explanations.
- Profile with editable grading scale, confirmed academic-data clearing, and logout that preserves saved data.
- Installable PWA with local icons and a service worker for offline use after pages and assets have been loaded.

## Tech stack

React, Vite, JavaScript, CSS, React Router (HashRouter), Lucide React, LocalStorage, Web Crypto, and a native service worker. Fonts use the system stack; no remote font or image services.

## Installation

Use Node.js 22 or a compatible supported version, and npm.

```sh
npm install
npm run dev
```

Open the localhost address printed by Vite. Web Crypto requires localhost or HTTPS.

## Development commands

```sh
npm run dev      # development server
npm test         # calculation tests
npm run build    # production files in dist
npm run preview  # preview the production build
npm run test:browser # browser regression checks (after building)
```

## GPA formula

GPA = sum(course grade point ? course credits) / sum(course credits).

CGPA uses every saved course directly, without averaging or rounding semester GPAs first. Displayed GPAs are rounded to two decimals.

Required next GPA = (target CGPA ? (completed credits + next credits) ? current CGPA ? completed credits) / next credits.

The default scale is A+/A: 4.0, A?: 3.7, B+: 3.3, B: 3.0, B?: 2.7, C+: 2.3, C: 2.0, C?: 1.7, D: 1.0, F: 0. GPA grading scales differ between universities. Configure grade points in Profile within the supported 0?4 range. Saved subjects keep their original points; recalculating and saving an edited semester applies the current scale.

## GitHub Pages deployment

1. Create the repository `dishan919/gradeflow` and push this project to its `main` branch, including `package-lock.json`.
2. In repository Settings ? Pages ? Build and deployment, select **GitHub Actions**.
3. The included `.github/workflows/deploy.yml` checks out the repository, sets up Node 22, runs `npm ci`, tests, builds, uploads `dist`, and deploys it to Pages.
4. Review the Actions run for its deployment URL.

Vite uses `/` in development and `/gradeflow/` for production builds and previews. JSX uses the automatic React runtime, so components do not rely on a global `React` variable. HashRouter keeps direct routes and refreshes compatible with static Pages hosting. The manifest and service worker are scoped to the repository path.

Live demo (after you deploy): [GradeFlow](https://dishan919.github.io/gradeflow/). This is the intended deployment address, not a claim that the site has already been published.

## Project structure

```text
.github/workflows/deploy.yml
public/                     # manifest, service worker, local icons
src/
  components/               # layout and shared UI
  constants/                # default grade scale
  hooks/                    # academic state and persistence
  pages/                    # screen components
  services/                 # local account and storage functions
  utils/                    # GPA and planner math
  App.jsx                   # session and routes
  main.jsx
  styles.css
tests/                      # calculation verification
```

## Storage and limitations

**The login and registration functionality is a client-side demonstration using browser storage and should not be treated as secure production authentication.**

Passwords are salted and hashed with PBKDF2 SHA-256 (150,000 iterations), but local account records and sessions remain accessible to browser scripts and device users. No server verifies identity. This app has no password recovery, cross-device synchronization, or automatic backup.

Academic records are isolated by local user ID. Logout removes only the session. Clear Academic Data removes the current user's semesters after confirmation. Missing or malformed stored records fall back safely; unavailable or full storage produces save errors. Clearing browser storage removes all local accounts and grades. Private browsing can discard data.

PWA installation depends on browser support. Offline availability requires an initial online visit; assets are cached as they are requested. The website works normally without installation. The app does not automatically create example semesters: summaries reflect your actual saved courses.

## Browser regression checks

Run `npm run build` followed by `npm run test:browser`. The tests start isolated development and production-preview servers, then verify the manifest HTTP response, local icons, login, registration, all academic screens, saved data after logout and reload, and absence of browser runtime errors at mobile and desktop widths. They use an installed Google Chrome browser (`channel: chrome`). If Chrome is unavailable, install it or configure Playwright to use its bundled Chromium with `npx playwright install chromium` and remove the channel option.
