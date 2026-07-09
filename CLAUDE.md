# CLAUDE.md

Guidance for Claude Code (or any AI agent) working in this repository.

## Working Principles

1. **Think before coding.** This is a small hobby project. Before changing anything, check
   whether the file you're about to touch is the file the app actually loads
   (`Scripts/src/api/components/...`, `hooks/` at the project root, `.csproj`'s `<Content
   Include>` list) — these were previously out of sync (see "Fixed in a past session" below) and
   could drift again if a folder gets moved without updating every reference.
2. **Simplicity first.** This is a student/portfolio full-stack app (ASP.NET MVC + embedded
   React), not production infrastructure. Prefer the smallest change that solves the request.
   Don't introduce a new framework, state manager, or build tool to fix a two-line bug.
3. **Surgical changes.** The C# backend (auth) and the React frontend (weather dashboard) are
   only loosely coupled — the backend just serves `Views/Home/Index.cshtml`, which mounts the
   React app into `<div id="root">`. Changes to one side rarely need to touch the other.
4. **Goal-driven execution.** After any change to the React app, verify by running
   `npm run build` inside `Weathering With You/` — it currently succeeds (440 KiB minified
   `Scripts/dist/index.js`). If it stops succeeding, treat that as a regression to fix before
   moving on, not something to work around.

## Project Overview

**Weathering With You** is a hobby full-stack web app combining:
- An **ASP.NET MVC 5 (.NET Framework 4.7.2)** backend that handles **user sign-up/sign-in**
  (session-based auth, SQL Server via Entity Framework 6).
- An embedded **React 18 weather dashboard** (bundled with Webpack, styled with
  styled-components) that is mounted onto the MVC "Home" page, pulling live data from the
  **OpenWeatherMap** and **Unsplash** APIs.

There is no relation to the anime film beyond the project's name — it's a weather app.

## Tech Stack

**Backend**
- ASP.NET MVC 5.2.7, .NET Framework 4.7.2 (`Weathering_with_You_.csproj`)
- Entity Framework 6.4.4, Database-First (`.edmx` model), SQL Server (`System.Data.SqlClient`)
- Session-based auth (`HttpContext.Session`), no ASP.NET Identity / cookies-auth / tokens
- NuGet: Newtonsoft.Json, Modernizr, jQuery + jQuery.Validation, Microsoft.AspNet.Web.Optimization
- Passwords are hashed with `Scrypt.NET` (`ScryptEncoder.Encode`/`Compare`, wrapped in
  `Models/Custom_Scrypt.cs`). The `SCrypt` (CryptSharp) package reference is still present but
  unused — safe to remove from `packages.config`/`.csproj` if you want to tidy up.

**Frontend (embedded SPA)**
- React 18.2, ReactDOM (classic `ReactDOM.render`, not the React 18 root API)
- styled-components 5.3 for theming (light/dark mode via `ThemeProvider`)
- Webpack 5 + babel-loader + `@babel/preset-react`, config at `Scripts/config/webpack.config.js`
  (`css-loader`/`style-loader`/`sass-loader` handle the `swiper/scss` imports; images use
  webpack 5's built-in `asset/resource`)
- `swiper` (carousel for the Today/Week forecast strip), `react-icons`, `country-data`
- Vanilla JS, no TypeScript, no test framework configured
- OpenWeatherMap/Unsplash keys are injected at build time from `.env` (gitignored) via
  `webpack.DefinePlugin` — see `.env.example`

**External APIs consumed by the frontend**
- OpenWeatherMap `/data/2.5/weather` and `/data/2.5/onecall` (current + forecast)
- Unsplash `/search/photos` (background image for the searched city)

## Architecture / Folder Structure

```
Weathering_With_You_/                  <- git repo root (open this in Claude Code)
├── Weathering With You.sln
└── Weathering With You/                <- actual MSBuild project root
    ├── Controllers/
    │   ├── HomeController.cs           Index/About/Contact (Index hosts the React app)
    │   └── User_sign_in_up_Controller.cs   Sign in / sign up / logout
    ├── Models/
    │   ├── UserSignIn.cs / UserSignUp.cs   MVC view models (validation attributes)
    │   ├── user_sign_in_up.edmx (+.cs/.Designer.cs/.Context.cs)  EF6 Database-First model
    │   └── Custom_Scrypt.cs            Thin wrapper around Scrypt.NET's ScryptEncoder
    ├── App_Start/
    │   ├── RouteConfig.cs              Default route → UserSinIn (login is the landing page)
    │   ├── BundleConfig.cs             CSS/JS bundling (bootstrap, jquery, modernizr)
    │   └── FilterConfig.cs             Global HandleErrorAttribute only
    ├── Views/
    │   ├── Shared/_Layout.cshtml       Navbar + session-aware brand link
    │   ├── Home/Index.cshtml           `<div id="root">` + loads Scripts/dist/index.js
    │   ├── Home/About.cshtml, Contact.cshtml   Boilerplate ASP.NET MVC template pages
    │   └── User_sign_in_up_/UserSinIn.cshtml, UserSinUp.cshtml   Login/Register forms
    ├── Scripts/
    │   ├── src/                        React app source (see below)
    │   ├── config/webpack.config.js    Entry Scripts/src/index.js → output Scripts/dist/index.js
    │   ├── jquery-*.js, modernizr-*.js, bootstrap.js   Vendor scripts (server-rendered pages only)
    │   └── dist/                       Build output (gitignored) — run `npm run build` to generate
    ├── hooks/                          Custom React hooks, imported by Scripts/src/api/components/Dashboard.js
    │   ├── useCoordinations.js         Browser geolocation
    │   ├── useWeatherFetch.js          Fetches current + one-call forecast from OpenWeatherMap
    │   ├── useImageFetch.js            Fetches a random Unsplash photo for the searched city
    │   ├── useNightMode.js             Dark/light theme, persisted to localStorage
    │   └── UseTempUnit.js              °C/°F toggle, persisted to localStorage
    ├── Contest/                        Bootstrap 3 CSS + CustomCss.css / Site.css (server pages)
    ├── fonts/                          Glyphicons webfont (Bootstrap 3)
    ├── Web.config / Web.Debug.config / Web.Release.config   App settings; connection string is
    │                                    externalized via configSource to ConnectionStrings.config
    ├── ConnectionStrings.config        Local-only, gitignored — copy from .config.example
    ├── .env                            Local-only, gitignored — OpenWeather/Unsplash keys, copy from .env.example
    ├── package.json                    devDependencies + `build`/`build:dev`/`watch` scripts (React app)
    └── packages.config                 NuGet packages (backend)
```

### React app internal structure (`Scripts/src/`)
```
Scripts/src/
├── index.js                 ReactDOM.render(<App/>, #root)
├── App.js                   Renders <Dashboard/>
├── api/
│   ├── index.js              OpenWeatherMap + Unsplash URLs; keys come from process.env (see .env.example)
│   └── components/
│       ├── Dashboard.js       Top-level page: wires all hooks + layout together
│       ├── layouts/           Header, Sidebar, Container, Today, Week, Highlights
│       └── elements/          SearchBar, WeatherIcon, WeatherInfo, LocationBox, Spinner(s)
├── constants/                City list (search autocomplete data), light/dark theme tokens
├── styles/                   One styled-components file per component (Styled*.js) + index.js barrel
├── helpers/index.js          convertC / convertF temperature conversion
└── images/v1/, v1/v2/        OpenWeatherMap icon codes (01d..50n) as local PNGs
```

## Design Pattern

- **Backend:** classic ASP.NET MVC (Model–View–Controller), Database-First EF6, server-rendered
  Razor views for auth pages; no service/repository layer — controllers talk to `DbContext`
  directly.
- **Frontend:** React function components + hooks (no class components, no Redux/Context store —
  all state lives in `Dashboard.js` and is threaded down via props). Theming via
  styled-components `ThemeProvider` (`themeLight` / `themeDark`).
- **Integration pattern:** server-side "shell", client-side "island" — Razor renders the page
  chrome (navbar, session state) and a single `<div id="root">`; the bundled React app takes
  over from there. This is the *only* connective tissue between the two stacks.

## Routes (ASP.NET MVC)

Default route: `{controller}/{action}/{id}`, default controller/action = `User_sign_in_up_/UserSinIn`
(i.e. **login is the site's landing page**, not Home/Index — see `App_Start/RouteConfig.cs`).

| Route | Controller/Action | Method | Notes |
|---|---|---|---|
| `/` , `/User_sign_in_up_/UserSinIn` | `UserSinIn` (GET) | GET | Login form |
| `/User_sign_in_up_/UserSinIn` | `UserSinIn(UserSignIn s)` | POST | Validates credentials, sets `Session["username"]` |
| `/User_sign_in_up_/UserSinUp` | `UserSinUp` (GET) | GET | Registration form |
| `/User_sign_in_up_/UserSinUp` | `UserSinUp(user_sign_in_up user)` | POST | Creates a user row, redirects to login |
| `/User_sign_in_up_/Logout` | `Logout` | GET | Clears session, redirects to login |
| `/Home/Index` | `Index` | GET | Hosts the React weather dashboard |
| `/Home/About` | `About` | GET | Static boilerplate page |
| `/Home/Contact` | `Contact` | GET | Static boilerplate page |

There **is** a session guard on `Home/Index` now (redirects to login if `Session["username"]` is
null), but nothing enforces it as a real `[Authorize]` filter — a new controller/action added
later needs the same manual `if (Session["username"] == null) return RedirectToAction(...)`
check unless it's factored into an `ActionFilterAttribute`.

## "API Endpoints"

This app has **no REST/JSON API of its own** — the MVC controllers return HTML views only.
The only APIs involved are third-party, called directly from the browser (React):

| API | Used for | Key location |
|---|---|---|
| `GET https://api.openweathermap.org/data/2.5/weather` | Current weather by city name / lat-lon | `Scripts/src/api/index.js`, key from `process.env.REACT_APP_OPENWEATHER_KEY` (`.env`) |
| `GET https://api.openweathermap.org/data/2.5/onecall` | 7-day / hourly forecast | same file |
| `GET https://api.unsplash.com/search/photos` | Background photo for searched city | same file, key from `process.env.REACT_APP_UNSPLASH_KEY` (`.env`) |

Note: these keys still ship inside the built client bundle (there's no backend proxy) — moving
them to `.env` stops them from being *committed to source*, it doesn't hide them from anyone who
opens devtools. That's an inherent limitation of a pure client-side SPA calling these APIs
directly, not something `.env` can fix.

## Authentication

- **Mechanism:** classic ASP.NET `Session` state (in-process, cookie-based session ID) — no
  cookies-auth ticket, no ASP.NET Identity, no JWT.
- **Sign up** (`User_sign_in_up_Controller.UserSinUp` POST): checks for duplicate username/email,
  hashes the password with `Custom_Scrypt.HashPassword` (Scrypt.NET), saves a new
  `user_sign_in_up` row via EF6.
- **Sign in** (`UserSinIn` POST): looks up the user by `userName`, verifies the submitted
  password against the stored hash with `Custom_Scrypt.VerifyPassword`, and on success sets
  `Session["username"]`.
- **Logout**: `Session.Clear()/Abandon()/RemoveAll()`.
- Existing rows created before the Scrypt.NET switch (if any) were hashed with the old
  reversible Base64 scheme and will **not** verify against the new `VerifyPassword` — such users
  need to re-register, there's no migration path for old hashes.

## Storage

- SQL Server, accessed via EF6 Database-First (`Models/user_sign_in_up.edmx`).
- Single table/entity: `user_sign_in_up` (`userId, firstName, lastName, gender, userName, email,
  password, city, address`).
- One connection string (`Weathering_with_youEntities`), externalized out of `Web.config` into
  `ConnectionStrings.config` (gitignored, local-only — copy `ConnectionStrings.config.example`
  and point it at your own SQL Server instance to get started). The dead second connection
  string that used to live in `Web.config` has been removed.
- No migrations folder — schema changes must be made by editing the `.edmx` and regenerating,
  or directly in SQL Server.

## CLI Commands

**Backend (Windows + Visual Studio required — MSBuild/.NET Framework, not `dotnet` CLI):**
- Copy `ConnectionStrings.config.example` → `ConnectionStrings.config` and fill in your SQL
  Server instance/credentials.
- Open `Weathering With You.sln` in Visual Studio (2019/2022), restore NuGet packages, run with
  IIS Express (F5). There is no cross-platform build path for the .NET Framework MVC part —
  it was not possible to compile/run this half from this (macOS) environment; the C# edits made
  here were reviewed by hand and the referenced `Scrypt.NET` API was verified against its README,
  but a real Visual Studio build is still the first thing to do after pulling these changes.
- NuGet restore: `nuget restore "Weathering With You.sln"`

**Frontend (React app, run from inside `Weathering With You/`):**
```bash
cp .env.example .env   # fill in your own OpenWeatherMap/Unsplash keys
npm install
npm run build           # production build → Scripts/dist/index.js (verified working)
npm run build:dev       # unminified, with source maps, for local debugging
npm run watch            # build:dev + --watch
```
There is no test script (`npm test` is a placeholder that just exits with an error) and no
`npm start`/dev-server — the bundle is only ever loaded through the ASP.NET-served
`Home/Index.cshtml`, so there's no standalone way to preview it outside the backend.

## All Pages

| Page | Purpose |
|---|---|
| Login (`UserSinIn.cshtml`) | Username + password form, shown at `/` |
| Register (`UserSinUp.cshtml`) | First/last name, city, address, username, password, email |
| Home (`Index.cshtml`) | Mounts the React weather dashboard (search, current weather, hourly/daily forecast, highlights, dark mode, °C/°F toggle) |
| About (`About.cshtml`) | Unmodified ASP.NET MVC template placeholder |
| Contact (`Contact.cshtml`) | Unmodified ASP.NET MVC template placeholder (Microsoft's default address/email) |
| Error (`Error.cshtml`) | Generic MVC error page |

## Deployment

No CI/CD, Dockerfile, or deployment scripts exist in the repo. `Web.Debug.config` /
`Web.Release.config` are the stock Web.config transforms generated by Visual Studio and are not
customized. To deploy, this would need: IIS (or Azure App Service) hosting the .NET Framework
4.7.2 MVC app, a SQL Server instance, the React bundle built and output to `Scripts/dist/`, and
the hardcoded API keys/DB credentials replaced with real secrets (see Known Issues).

## Fixed in a past session (2026-07-09)

The project was originally in a broken, undocumented state. The following were found and fixed
in one pass — listed here so the reasoning isn't lost, and so nobody re-diagnoses the same
issues from scratch:

1. **React build was completely broken** — `Scripts/config/webpack.config.js` didn't exist,
   `node-sass` (a devDependency) doesn't compile on modern Node and blocked `npm install`
   entirely, and almost every relative import under `Scripts/src/**` and `hooks/**` pointed at
   the *pre-reorg* file layout (`Scripts/src/components/...` instead of the real
   `Scripts/src/api/components/...`, `Scripts/src/hooks/...` instead of the real top-level
   `hooks/...`). Fixed by: writing `Scripts/config/webpack.config.js` (babel-loader for
   JS/JSX, style/css/sass-loader for the `swiper/scss` imports, webpack 5 `asset/resource` for
   images), dropping `node-sass` in favor of the already-present `sass` (Dart Sass), adding
   `css-loader`/`style-loader`, and rewriting every broken import to match the real file
   locations (kept the current layout — did **not** move files back — see each file's diff).
   The three `<img src={'.../images/v2/...'}>` string interpolations were also rewritten to
   root-relative URLs (`/Scripts/src/images/v1/v2/...`) since those are runtime browser strings,
   not webpack-resolved imports, and IIS serves the whole project folder as the web root.
   `npm run build` now produces a working 440 KiB bundle; verified by executing it in a jsdom
   harness with stubbed `fetch`/`geolocation` and confirming it renders the dashboard with no
   runtime errors.
2. **Passwords are now real Scrypt hashes.** `Custom_Scrypt.cs` was rewritten to wrap the
   already-installed `Scrypt.NET` (`ScryptEncoder.Encode`/`.Compare`, namespace `Scrypt`,
   verified against the upstream README) instead of doing reversible Base64. The controller's
   decode-then-plaintext-compare logic was replaced with `VerifyPassword`. **Caveat:** any rows
   created under the old scheme won't verify anymore (see Authentication section).
3. **Hardcoded API keys and DB credentials moved out of source.** OpenWeatherMap/Unsplash keys
   now come from `.env` (gitignored; `.env.example` committed) injected via
   `webpack.DefinePlugin`. The SQL Server connection string moved from inline `Web.config` to
   `ConnectionStrings.config` (gitignored; `.config.example` committed), wired up via
   `configSource`. **These specific key/password values were already committed to git history
   before this fix — moving them out of the *current* file does not scrub history. Rotate the
   OpenWeatherMap key, the Unsplash client ID, and the SQL `sa` password if this repo is or will
   be shared/public.**
4. **Dead duplicate connection string removed** — `Web.config` had two entries
   (`weathering_with_you_Entities`, unused, and `Weathering_with_youEntities`, the real one);
   only the real one survives, in `ConnectionStrings.config`.
5. **`_Layout.cshtml` navbar bug fixed** — logged-out brand link now points to `UserSinIn`
   instead of `Logout`.
6. **Session guard added to `HomeController.Index`** — redirects to login if
   `Session["username"]` is null. Not a reusable `[Authorize]`-style filter, just an inline
   check; see the Routes section note about adding this to future actions.
7. **Empty/silent `catch` blocks fixed** in `User_sign_in_up_Controller` — sign-in's dead nested
   try/catch around the session-set was removed entirely (unreachable failure mode), and
   sign-up's swallowed `ex2.Message` is now surfaced to `ViewBag.ErrorMessage` like sign-in
   already did.
8. **Bonus fix, adjacent to #7:** sign-up's duplicate-email check queried
   `c.userName.Equals(user.email)` (comparing existing *usernames* to the new *email*) instead
   of `c.email.Equals(user.email)` — so it could never actually catch a duplicate email. Fixed
   while touching that method; flagged separately here since it wasn't in the original known-issues
   list.
9. **`.csproj` `<Content Include>` list updated** to match the real file paths (including the
   `Scripts/src/images/v1/v2/...` nesting, which also didn't match the old list) so Visual
   Studio's Solution Explorer and Web Deploy publish see the right files; `ConnectionStrings.config`
   was added to the list for the same reason.

**Still not done / not verifiable from this environment:** the backend was never actually
compiled or run (no Windows/MSBuild/IIS available here) — do a real Visual Studio build after
pulling these changes before trusting the C# side. There's still no test suite or CI. The
`.env`/`ConnectionStrings.config` pattern only prevents *future* leaks — see point 3 above about
rotating the already-exposed key/password values.
