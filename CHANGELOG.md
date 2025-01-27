# Changelog

## UNRELEASED
* [DOC] Add release instructions to README

## 1.8.3
* Update cypress helpers to use `force: true`

## 1.8.2
* Update shoelace for yarn audit issues
* Update eslint-plugin-n to 17.15.0

## 1.8.1
* Switch to pinned versions (updated) to resolve downstream yarn audit issues

## 1.8.0
* Add shared cypress helpers

## 1.7.0
* Update asset pipeline dependencies
* Fix pre-commit script for Husky@9 compatibility

## 1.6.2
* Bump to Shoelace 2.3.0
* **Note!** Before merging this release, make sure `teamshares-rails` is 1.6.1 or above

## 1.6.1
* [Bugfix] Fix reorganization of scss includes to allow building css

## 1.6.0
* ViewComponent sidecar styles no longer require wrapping in `._component` class [@kdonovan]

## 1.5.0 - Skipped to keep parity with teamshares-rails

## 1.4.3
* Test using tag with release for changelog

## 1.4.2
* Patch fix to bump `design-system` to a new version, as the previous version bumped Shoelace but missed bumping `design-system` itself
* **Okay to merge** This release is okay to merge without `teamshares-rails`

## 1.4.1
* Bump to Shoelace 2.2.1

## 1.4.0
* Add `_pagination.scss` so that pagy styles can be shared across apps
* Update styles in `_pagination.scss` so they work with pagy v8 and with pagy_helper in `cash-account-app`

## 1.3.2
* Bump to Shoelace 2.1.2 patch release

## 1.3.1.1
* Quick fix to also update yarn.lock when bumping to Shoelace 2.1.1

## 1.3.1
* Bump to Shoelace 2.1.1 patch release

## 1.3.0
* Updates to error styles for Shoelace forms wrapped with Simple Form; update `<body>` decs to remove `letter-spacing` and update `line-height` to match default for `body-1`
* Bump to Shoelace 2.1.0

## 1.2.2
* Add temp support for health insurance engine's view components SCSS [@kdonovan]

## 1.2.1
* Re-release of 1.2.0 (tag had been created prematurely, now CI has caching issues) [@crookedgrin, @kdonovan]

## 1.2.0
* Responsive tables, enhanced Stimulus support, launcher_controller, ViewComponent-scoped assets [@crookedgrin, @kdonovan]
