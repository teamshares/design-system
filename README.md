# @teamshares/ui

JavaScript package for shared JS, styles, and configuration (e.g. linters, tailwind, build scripts).

## Problems?

Checkout the [Working with Shared Repos](https://www.notion.so/teamshares/Working-with-Shared-Repos-abca981d44e94e3587da090e50905cf0) doc, then ping `#engineering-deps`.

## Local Development _Setup_

Instructions on testing changes to this shared package _within another full Rails app in development_ (e.g. to have OS read your _local_ shared-ui, without having to deploy all changes first) follow (or see [this Loom video](https://www.loom.com/share/856ecb06ed1945eab4d19cf7a6ec12b8)):

0. Check this repo out _as a sibling of the primary Rails apps_ (e.g. I use `~/code`): `git clone git@github.com:teamshares/shared-ui.git`

1. CD into that directory and run `yarn` to install dependencies, then `yarn husky install` to set up the precommit hooks (only needs to be run once on initial setup)

### Yarn 1 - Classic

1. From within **the shared-ui directory**, tell yarn we want to register it as a local override available for other apps on this computer: `yarn link`

    You should see output including:
    > success Registered "@teamshares/ui".

2. From within **the Rails app**, configure yarn to _use_ that local version: `yarn link @teamshares/ui`

    You should see output including:
    > success Using linked package for "@teamshares/ui".

3. Finally (not positive this is necessary) rerun `yarn install` _in both directories_ to make sure all necessary dependencies are installed and linked properly.

### Yarn 3

1. CD into **the Rails app** that you want to use the local version, then configure yarn: `yarn link --private --relative ../shared-ui`

    You should see output indicating success (warnings OK), e.g.:
    > YN0000: Done with warnings in 0s 839ms

That's it! You're all configured.

## _Doing_ Local Development

Once the steps from above have been completed, to actually make changes you'll want to:

0. **In the Rails app** (e.g. `OS`): Start the Rails server and whatever script needs to be running to compile assets (probably something like `yarn build --watch` and `yarn build:css --watch` for Rails 7+).

1. Now make a change in this repo and it should show up on the next page refresh in the consuming app (e.g. OS).

#### Details

* **Changes to SCSS files** are picked up immediately by the Rails app as long as you have `yarn build:css --watch` running.

* **Changes to JS files** are picked up immediately by the Rails app as long as you have `yarn build --watch` running.

* **Changes to `tailwind.config.js`** _do not_ hotreload -- changes there require a restart of the `yarn build:css --watch` script.

### Caveats

#### Yarn 3

Super annoyingly, as of Yarn v3 the `yarn link` command adds a `resolutions` key directly to `package.json`... which we obviously can't commit to production, since it's only a valid path on your local computer.  I WOULD LOVE A WORKAROUND HERE IF ANYONE HAS ONE! In the meantime, I've updated CI for all our consuming apps to include a linter step that will fail if you accidentally check that resolutions key in.

### Cleanup

When you're done doing local development you _can_ undo this config.

__Yarn 1__:

0. From _within the linked Rails app_: `yarn unlink @teamshares/ui` and then `yarn install --force` to re-install the previously-linked package from remote instead.

__Yarn 3__:

0. From _within the linked Rails app_: `yarn unlink ../shared-ui` (or `yarn unlink --all`). `yarn install --force` won't hurt anything, but I don't _think_ is required.

## After merging your PR
Your changes _won't go live_ in any consuming Rails apps until their `yarn.lock` is updated to point to the newest-released git SHA (i.e. you merge a PR in that app in which you've run `yarn upgrade @teamshares/ui`).
