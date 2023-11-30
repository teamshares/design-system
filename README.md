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
    Teamshares.init();
    ```

    * _Optional_: if you use any shared stimulus controllers, require and register them in your `controllers/application.js` - e.g. [see OS](https://github.com/teamshares/os-app/blob/main/app/frontend/javascript/controllers/application.js#L2).


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
Your changes _won't go live_ in any consuming Rails apps until their `yarn.lock` is updated to point to the newest-released git SHA (i.e. you merge a PR in that app in which you've run `yarn upgrade @teamshares/design-system`).
