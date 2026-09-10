# @teamshares/design-system

Design-related assets and shared configs used across the Teamshares family of apps.

## Problems?

Checkout the [Working with Shared Repos](https://www.notion.so/teamshares/Working-with-Shared-Repos-abca981d44e94e3587da090e50905cf0) doc, then ping `#engineering-deps`.

## Setup

Instructions for installing in a new Rails app (note there are [many other steps to take](https://www.notion.so/teamshares/Spinning-Up-a-New-Application-Repository-b5fe388a56e44ba4aa547158b508014d#729587b1055d471db2fb4c86ab006201) to fully align a new app with Teamshares conventions).

1. Add entry to "dependencies" in `package.json`
    ```
    "@teamshares/design-system": "https://github.com/teamshares/design-system.git#main",
    ```

2. Include Teamshares styles on the first line of your `application.scss`
    ```
    @import '@teamshares/design-system';
    ```

3. Include Teamshares JS near the top of your `application.js`
    ```
    import Teamshares from "@teamshares/design-system/rails-js";
    Teamshares.start();
    ```

4. Configure build pipeline + linters + cypress

    Every file under `configs/` should have a file of the same name in the root of your Rails app that references these shared configs; exact syntax differs for each file, see the existing files in OS or another app (or reach out to `#engineering-deps` for guidance).

    If you use cypress, both `cypress.config.js` and `cypress/support/commands.js` should reference the shared configs from this repo.

## Local Development _Setup_

Instructions on testing changes to this shared package _within another full Rails app in development_ (e.g. to have OS read your _local_ design-system, without having to deploy all changes first) follow (or see [this Loom video](https://www.loom.com/share/856ecb06ed1945eab4d19cf7a6ec12b8)):

1. From within **the design-system directory**, tell yarn we want to register it as a local override available for other apps on this computer: `yarn link`

    You should see output including:
    > success Registered "@teamshares/design-system".

2. From within **the Rails app**, configure yarn to _use_ that local version: `yarn link @teamshares/design-system`

    You should see output including:
    > success Using linked package for "@teamshares/design-system".

3. Finally (not positive this is necessary) rerun `yarn install` _in both directories_ to make sure all necessary dependencies are installed and linked properly.

That's it! You're all configured.

## _Doing_ Local Development

Once the steps from above have been completed, to actually make changes you'll want to:

0. **In the Rails app** (e.g. `OS`): Start the Rails server and whatever script needs to be running to compile assets (e.g. `yarn dev`).

1. Now make a change in this repo and it should show up on the next page refresh in the consuming app (e.g. OS).

### Cleanup

When you're done doing local development you _can_ undo this config.

* From _within the linked Rails app_: `yarn unlink @teamshares/design-system` and then `yarn install --force` to re-install the previously-linked package from remote instead.

## After merging your PR

Your changes _won't go live_ in any consuming Rails apps until:
* a new release is cut
* that consuming rails app increments the version in their `package.json`

## Releasing a new version

Consuming apps pin a git ref, so a "release" here is a git tag — nothing is published to a
registry. Two PRs and one command:

**1. Merge your change.** Add a bullet under `## UNRELEASED` in `CHANGELOG.md` describing it. Merging
alone changes nothing downstream — a pinned app keeps resolving its own tag.

**2. Open a release PR.** Bump `version` in `package.json`, and rename `## UNRELEASED` in
`CHANGELOG.md` to the new version (starting a fresh empty `## UNRELEASED` above it). Follow semver:
patch for fixes, minor for additive changes, major for anything a consuming app must react to.
Branch naming convention is `release/vX.Y.Z`.

**3. Cut the tag.** Once that PR is merged, from an up-to-date local `main`:

```bash
yarn release
```

This tags `v<package.json version>` and pushes just that tag. It refuses to run unless you're on
`main`, your tracked files are clean, your `main` matches `origin/main`, the tag doesn't already
exist, and `CHANGELOG.md` has a heading for the version being tagged — so a half-finished release
PR can't produce a tag whose changes are undocumented. Use `yarn release --dry-run` to run every
guard and see what it would do without tagging.

**4. Adopt it in each consuming app.** Nothing is live until each app bumps its own pin:

```jsonc
// package.json
"@teamshares/design-system": "teamshares/design-system.git#v1.2.3"
```

then `yarn install` (which updates `yarn.lock`) and open a PR per app. As of this writing the
consuming apps are **os-app** and **buyout-app**. Let each app's CI run before merging — a
design-system change reaches every form, modal, and Stimulus controller in the app, and the
app suites are the only real regression coverage this repo has.

Both apps depend on Rails UJS, in different places, so neither one alone verifies a UJS change.
os-app has no `data-remote` *forms*, but `link_to_modal` defaults to `remote: true` and its modals
are built on UJS's `ajax:success`, so the link path is load-bearing there. buyout-app uses
`remote: true` on both forms and links across its admin surfaces. A change to the form-submitter
selectors needs buyout; a change to link handling needs os-app.

NOTE: if your release includes breaking changes, you'll need to coordinate with all existing apps to ensure they're aware of the steps needed (where plausible, usually this means opening PRs to implement those changes directly so that context isn't lost/forgotten in the future).

NOTE: any questions in the process, reach out to @kdonovan or @kathleenteamshares.
