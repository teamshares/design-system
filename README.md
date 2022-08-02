# @teamshares/ui

JavaScript package to share frontend UI components, styles, and configuration.

## Setup

When you first check this repo out, run `yarn` to install dependencies, then make sure you're run once: `yarn husky install`.  This _was_ a `prepare` script to be run automatically, but [the presence of that script name in package.json that causes weird broken-cache issues](https://github.com/yarnpkg/yarn/issues/7212#issuecomment-493720324) with downstream consumers who pull the library in via git (i.e. everyone).

## Editing javascript

Note that as currently configured, downstream consumers pull in JS code from `dist/`, not from `src/`, so you need to make sure you run `yarn compile` after making any edits under `src/`.

To _help_ make sure that isn't forgotten, there's a pre-commit hook that detects JS changes under `src/` and runs compilation automatically... unfortunately (for now at least) **you still have to manually add the  `dist/` changes to your commit**.

## Local Development _Setup_

Instructions on testing changes to this shared package _within another full Rails app in development_ (e.g. to have OS read your _local_ shared-ui, without having to deploy all changes first). If you'd rather see it visually, I've walked through the steps [in this Loom video](https://www.loom.com/share/856ecb06ed1945eab4d19cf7a6ec12b8).

0. Check this repo out _as a sibling of the primary Rails apps_ (e.g. I use `~/code`): `git clone git@github.com:teamshares/shared-ui.git` (and then run `yarn` once to install dependencies)

1. CD into **this new directory**, then tell yarn that we want to register it as a local override available for other apps on this computer: `yarn link`

    You should see output including:
    > success Registered "@teamshares/ui".

2. CD into **the Rails app** that you want to use the local version, then configure yarn: `yarn link @teamshares/ui`

    You should see output including:
    > success Using linked package for "@teamshares/ui".

3. Finally (not positive this is necessary) rerun `yarn install` _in both directories_ to make sure all necessary dependencies are installed and linked properly.

That's it! You're all configured.

## _Doing_ Local Development

Once the steps from above have been completed, to actually make changes you'll want to:

0. **In the Rails app** (e.g. `OS`): Start the Rails server and whatever script needs to be running to compile assets (`bin/webpack-dev-server` in older apps, probably something like `yarn build --watch` and `yarn build:css --watch` for Rails 7+).

1. **In this directory**: Start the compilation script with `yarn compile:watch` (only needed for JS changes)


2. Now make a change in this repo and it should show up "immediately" (after compilation completes) in the consuming app (e.g. OS).

    * NOTE: For Rails 6 apps you don't even need a browser reload, as some fast-refresh config appears to be triggering it for us (although that can be a bit delayed if the recompilation takes a while... which, in my testing, it tends to). Leadership is on Rails 7 and it appears to require a manual browser refresh to pick up changes, but no server restarts are required as long as the various JS and CSS watcher commands are running.


#### Details

* **Changes to SCSS files** (loaded directly, no SCSS->CSS compilation needed within shared-ui) are picked up immediately by the Rails app as long as you have `bin/webpack-dev-server` running.

* **Changes to JS files** _are also_ picked up immediately, as long as you're running `yarn compile:watch` in this directory.

* **Changes to `tailwind.config.js`** _do not_ hotreload -- changes there require a restart of the Rails app's compiler (e.g. `bin/webpack-dev-server`).

### Cleanup

When you're done doing local development you _can_ undo this config:

0. From _within this directory_: `yarn unlink`

1. From _within the linked Rails app_: `yarn unlink @teamshares/ui` and then `yarn install --force` to re-installed the previously-linked package from remote instead.
