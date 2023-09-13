# @teamshares/design-system

Design-related assets used across the Teamshares family of apps.

> NOTE: renamed from shared-ui (contained SCSS, JS, and configs) to design-system (only org-wide styles) in September 2023.

## Problems?

Checkout the [Working with Shared Repos](https://www.notion.so/teamshares/Working-with-Shared-Repos-abca981d44e94e3587da090e50905cf0) doc, then ping `#engineering-deps`.

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
