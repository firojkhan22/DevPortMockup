# Developer Portal — React + Bootstrap Prototype (multi-file)

This is the same mockup that used to live in one 23,000-line HTML file,
split into one file per screen/menu so different people can work on
different screens without fighting over the same file in git.

## Running it

No build step, no `npm install`. Exactly like before:

```
npx serve .
```

Then open the URL it prints. That's it — `index.html` pulls React,
ReactDOM, Babel Standalone, Bootstrap and Leaflet from CDNs, and loads
every screen file straight from `src/`.

## Why there's no build step

The original file used React + JSX transpiled *in the browser* by Babel
Standalone (`<script type="text/babel">`), not a bundler. This split
keeps that exact approach — each screen is its own
`<script type="text/babel" src="...">` tag in `index.html`, loaded in
order. Every top-level `function`/`const` in these files becomes a
shared global (same as before, when it was all one script tag), so a
screen file can use a component or helper defined in another file
without any `import`/`export` statements.

**This means load order in `index.html` matters.** Shared data and
components must appear before the screens that use them. If you add a
new file, add its `<script>` tag in a sensible spot (data/components
near the top, the screen itself lower down, always before
`src/shell/AppShell.jsx` and `src/App.jsx`, which tie everything
together, and before `src/main.jsx`, which must always load last).

## Folder layout

```
index.html                  Head/CSS, CDN <script> tags, and the ordered
                             list of every src/ file to load.
src/bootstrap/               React hooks bootstrap (must load first).
src/data/                    Mock/demo data + pure helper functions,
                             grouped by domain (projects, company, users,
                             auth, rera, leads, campaigns, disbursement...).
                             No JSX — plain .js.
src/components/common/       Shared UI building blocks used by several
                             screens: Modal, FormCard, FilterDropdown,
                             AccessLevelPicker, icons, etc.
src/shell/                   Sidebar, TopMasthead and AppShell — the
                             frame around every logged-in screen, plus
                             the screen-id -> component map and the
                             lifted state (leads, campaigns, queries...).
src/screens/auth/            Login, Registration, Forgot password.
src/screens/overview/        Home, Dashboard, My Profile, Access Revoked.
src/screens/company/         Company Listing/Entry, Builder Group
                             Profile, Company Users.
src/screens/users/           User Management, User form, Review panel,
                             Passkey Security.
src/screens/projects/        All Projects, Project Summary + its tabs,
                             New Project wizard, Queries.
src/screens/project-data/    Bank Accounts, RERA/OC/Construction
                             Finance/Inventory updates, Work Progress,
                             Unit Data Upload.
src/screens/business/        Customer Leads, My Campaigns, HDFC Bank
                             Campaigns.
src/screens/mis/             Disbursement Statement report.
src/screens/tools/           Project Disbursement, Calculators,
                             Coordinators, Issue Listing.
src/App.jsx                  Top-level mode switch (login/register/
                             forgot/app).
src/main.jsx                 The one line that mounts <App /> — always
                             loads last.
```

Each screen file is named after the screen it renders (matching the
sidebar's menu labels), so "who owns which file" maps directly onto
"who owns which menu item."

## Adding or changing a screen

1. Edit the screen's own file in `src/screens/...` — nothing else needs
   to change for a self-contained edit.
2. If you add a brand-new screen: create its file, add one
   `<script type="text/babel" src="...">` line for it in `index.html`
   (before `AppShell.jsx`), then wire it into the `screens` map inside
   `src/shell/AppShell.jsx` and into the menu list inside
   `src/shell/Sidebar.jsx`.
3. If a screen needs new shared mock data or a new shared component,
   add it to the relevant file under `src/data/` or
   `src/components/common/` rather than duplicating it inside the
   screen file.

## What didn't change

The behavior, styling, and every screen's markup are untouched — this
was a mechanical split (verified by scripting the cut points off the
original file's exact line ranges, then testing login + all 27 sidebar
menu items + the project map + the New Project wizard + the Add User
form in a headless browser with zero console errors). Nothing was
rewritten, renamed inside the code, or redesigned.
