import shex from '@toptensoftware/shex'

let $ = shex({ async: true, shell: "bash" });

if (await $`git diff --exit-code && git diff --cached --exit-code && git push -n`.status != 0)
    throw new Error("Uncommitted or unpushed changes");

// Update version
await $`npm version patch --no-git-tag-version`

// Get the package version
let pkg = JSON.parse((await $`cat package.json`).stdout);
console.log(`Package Version: ${pkg.version}`);

// Tag and commit both repos
await $`git add .`
await $`git commit -m ${pkg.version} --allow-empty`
await $`git tag -f ${pkg.version}`
await $`git push --quiet`
await $`git push -f --tags --quiet`

console.log("Build Completed Successfully");
