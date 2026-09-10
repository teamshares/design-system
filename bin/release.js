#!/usr/bin/env node
// Tag-only release for @teamshares/design-system.
//
// This package isn't published to a registry — consumers pin a git ref in their package.json — so
// a "release" is just an annotated-free git tag that downstream apps can point at. This automates
// the manual `git tag vX.Y.Z` + `git push` steps, guarded so the tag always matches package.json on
// a clean release branch that's in sync with the remote.
//
// Ported from teamshares_rails' `rake release` (TeamsharesRails::Releaser) so both shared repos
// release the same way. Two guards are specific to this repo: package.json is the version source
// (not a version.rb), and CHANGELOG.md must already carry a heading for the version being tagged,
// since the release PR is supposed to update both.
//
//   yarn release            cut the release
//   yarn release --dry-run  run every guard and print what would happen, without tagging

const { execFileSync } = require("child_process");
const { readFileSync } = require("fs");
const path = require("path");

const RELEASE_BRANCH = "main";
const REMOTE = "origin";
const ROOT = path.resolve(__dirname, "..");

class ReleaseError extends Error {}

function git (args, { quiet = false } = {}) {
  try {
    return execFileSync("git", ["-C", ROOT, ...args], {
      encoding: "utf8",
      stdio: quiet ? ["ignore", "pipe", "ignore"] : ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (e) {
    if (quiet) return null;
    throw new ReleaseError(`\`git ${args.join(" ")}\` failed: ${(e.stderr || "").toString().trim()}`);
  }
}

function version () {
  const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  if (!pkg.version) throw new ReleaseError("package.json has no `version`.");
  return pkg.version;
}

function ensureOnReleaseBranch () {
  const current = git(["rev-parse", "--abbrev-ref", "HEAD"]);
  if (current !== RELEASE_BRANCH) {
    throw new ReleaseError(`must be on \`${RELEASE_BRANCH}\` to cut a release (currently on \`${current}\`).`);
  }
}

// Only tracked files matter: untracked scratch files are common and don't end up in the tag.
function ensureCleanWorktree () {
  const dirty = git(["diff", "--quiet"], { quiet: true }) === null ||
                git(["diff", "--cached", "--quiet"], { quiet: true }) === null;
  if (dirty) {
    throw new ReleaseError("working tree has uncommitted changes to tracked files — commit or stash first.");
  }
}

// Tag exactly what's on the remote release branch, so the tag never points at a local-only or
// stale commit.
function ensureInSyncWithRemote () {
  git(["fetch", "--quiet", REMOTE, RELEASE_BRANCH]);
  if (git(["rev-parse", "HEAD"]) !== git(["rev-parse", "FETCH_HEAD"])) {
    throw new ReleaseError(
      `local ${RELEASE_BRANCH} is not in sync with ${REMOTE}/${RELEASE_BRANCH} — pull/push so the tag matches the remote.`,
    );
  }
}

function ensureTagAvailable (tag) {
  if (git(["tag", "--list", tag]) !== "") {
    throw new ReleaseError(`tag ${tag} already exists — bump the version in package.json first.`);
  }
}

// The release PR is meant to bump package.json *and* move the CHANGELOG's `## UNRELEASED` entries
// under the new version. Catch the half-done case, where downstream apps would adopt a version
// whose changes are undocumented.
function ensureChangelogEntry (ver) {
  const changelog = readFileSync(path.join(ROOT, "CHANGELOG.md"), "utf8");
  if (!new RegExp(`^##\\s+v?${ver.replace(/\./g, "\\.")}\\s*$`, "m").test(changelog)) {
    throw new ReleaseError(
      `CHANGELOG.md has no \`## ${ver}\` heading — move the UNRELEASED entries under it before releasing.`,
    );
  }
}

function main () {
  const dryRun = process.argv.includes("--dry-run");
  const ver = version();
  const tag = `v${ver}`;

  ensureOnReleaseBranch();
  ensureCleanWorktree();
  ensureInSyncWithRemote();
  ensureTagAvailable(tag);
  ensureChangelogEntry(ver);

  const sha = git(["rev-parse", "--short", "HEAD"]);

  if (dryRun) {
    console.log(`✔ All guards passed. Would tag ${tag} at ${sha} and push to ${REMOTE}.`);
    console.log("  Re-run without --dry-run to release.");
    return;
  }

  console.log(`Tagging ${tag} at ${sha} and pushing to ${REMOTE}…`);
  git(["tag", tag]);
  console.log(git(["push", REMOTE, tag]));
  console.log(`✔ Released ${tag}`);
  console.log("");
  console.log("Next: bump the pin in each consuming app's package.json and run `yarn install`:");
  console.log(`  "@teamshares/design-system": "teamshares/design-system.git#${tag}"`);
}

try {
  main();
} catch (e) {
  if (e instanceof ReleaseError) {
    console.error(`release: ${e.message}`);
    process.exit(1);
  }
  throw e;
}
