# @teamshares/ui

JavaScript package to share frontend UI components, styles, and configuration.

## Setup

When you first check this repo out, run `yarn` to install dependencies, then make sure you've run once: `yarn husky install`.  This _was_ a `prepare` script to be run automatically, but [the presence of that script name in package.json causes weird broken-cache issues](https://github.com/yarnpkg/yarn/issues/7212#issuecomment-493720324) with downstream consumers who pull the library in via git (i.e. everyone).

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

0. **In the Rails app** (e.g. `OS`): Start the Rails server and whatever script needs to be running to compile assets (probably something like `yarn build --watch` and `yarn build:css --watch` for Rails 7+).

1. Now make a change in this repo and it should show up on the next page refresh in the consuming app (e.g. OS).

#### Details

* **Changes to SCSS files** are picked up immediately by the Rails app as long as you have `yarn build:css --watch` running.

* **Changes to JS files** are picked up immediately by the Rails app as long as you have `yarn build --watch` running.

* **Changes to `tailwind.config.js`** _do not_ hotreload -- changes there require a restart of the Rails app's compiler.

### Cleanup

When you're done doing local development you _can_ undo this config:

0. From _within this directory_: `yarn unlink`

1. From _within the linked Rails app_: `yarn unlink @teamshares/ui` and then `yarn install --force` to re-installed the previously-linked package from remote instead.

## After merging your PR
Your changes _won't go live_ in any consuming Rails apps until their `yarn.lock` is updated to point to the newest-released git SHA (i.e. you merge a PR in that app in which you've run `yarn upgrade @teamshares/ui`).

## Dependency Versions
### Tailwind

    * `@tailwindcss/aspect-ratio` -
    * `@tailwindcss/forms` - 0.3.7 (0.4 switches to tailwind v3 compatibility)
    * `@tailwindcss/line-clamp` -
    * `@tailwindcss/typography` -
