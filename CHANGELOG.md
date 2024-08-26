# Changelog

## UNRELEASED
* Add change description here

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
