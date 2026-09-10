#!/usr/bin/env node
// Tags v<package.json version> and pushes it. Consumers pin a git ref, so a release is just a tag —
// nothing is published to a registry. Ported from teamshares_rails' `rake release`.
//
//   yarn release [--dry-run]

const { execFileSync } = require("child_process");
const { readFileSync } = require("fs");
const path = require("path");

const RELEASE_BRANCH = "main";
const REMOTE = "origin";
const ROOT = path.resolve(__dirname, "..");

class ReleaseError extends Error {}

function git (args, { exitStatusIsTheAnswer = false } = {}) {
  try {
    return execFileSync("git", ["-C", ROOT, ...args], {
      encoding: "utf8",
      stdio: exitStatusIsTheAnswer ? ["ignore", "pipe", "ignore"] : ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (e) {
    if (exitStatusIsTheAnswer) return null;
    throw new ReleaseError(`\`git ${args.join(" ")}\` failed: ${(e.stderr || "").toString().trim()}`);
  }
}

// git reports push results on stderr ("* [new tag] …"); swallowing it would hide why a push failed.
function gitShowingItsOutput (args) {
  try {
    execFileSync("git", ["-C", ROOT, ...args], { stdio: ["ignore", "inherit", "inherit"] });
  } catch {
    throw new ReleaseError(`\`git ${args.join(" ")}\` failed — see the output above.`);
  }
}

function versionFromPackageJson () {
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

function ensureTrackedFilesClean () {
  const dirty = git(["diff", "--quiet"], { exitStatusIsTheAnswer: true }) === null ||
                git(["diff", "--cached", "--quiet"], { exitStatusIsTheAnswer: true }) === null;
  if (dirty) {
    throw new ReleaseError("working tree has uncommitted changes to tracked files — commit or stash first.");
  }
}

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

// Catches the half-done release PR: package.json bumped, CHANGELOG's UNRELEASED entries not moved.
function ensureChangelogDocumentsVersion (version) {
  const changelog = readFileSync(path.join(ROOT, "CHANGELOG.md"), "utf8");
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // (?=\s|$) not \b: a word boundary would also accept `## 2.0.0-rc1` or `## 1.3.1.1` for 2.0.0/1.3.1.
  if (!new RegExp(`^##\\s+v?${escaped}(?=\\s|$)`, "m").test(changelog)) {
    throw new ReleaseError(
      `CHANGELOG.md has no \`## ${version}\` heading — move the UNRELEASED entries under it before releasing.`,
    );
  }
}

function parseArgs (argv) {
  const unknown = argv.filter((arg) => arg !== "--dry-run");
  if (unknown.length > 0) {
    throw new ReleaseError(`unknown argument(s): ${unknown.join(" ")} — the only flag is --dry-run.`);
  }

  return { dryRun: argv.includes("--dry-run") };
}

function main () {
  const { dryRun } = parseArgs(process.argv.slice(2));
  const version = versionFromPackageJson();
  const tag = `v${version}`;

  ensureOnReleaseBranch();
  ensureTrackedFilesClean();
  ensureInSyncWithRemote();
  ensureTagAvailable(tag);
  ensureChangelogDocumentsVersion(version);

  const sha = git(["rev-parse", "--short", "HEAD"]);

  if (dryRun) {
    console.log(`✔ All guards passed. Would tag ${tag} at ${sha} and push to ${REMOTE}.`);
    console.log("  Re-run without --dry-run to release.");
    return;
  }

  console.log(`Tagging ${tag} at ${sha} and pushing to ${REMOTE}…`);
  git(["tag", tag]);
  try {
    gitShowingItsOutput(["push", REMOTE, tag]);
  } catch (e) {
    git(["tag", "--delete", tag]);
    throw e;
  }
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
