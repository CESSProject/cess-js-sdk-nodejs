import { join as pathJoin, resolve as pathResolve } from "node:path";
import { promisify } from "node:util";
import { execFile } from "node:child_process";

// These files are relative to the script path. Surely we can use glob, but let's do it
// meticulously here, enabling our examples one-by-one.
const EXAMPLE_FILES = ["authorize.js", "bucket.js", "file.cjs", "space.cjs", "space.mjs"];

const execAsync = promisify(execFile);

async function main() {
  // Let's say for now these examples are meant to be run once at a time.
  for (const file of EXAMPLE_FILES) {
    const filePath = pathResolve(pathJoin(__dirname, file));
    console.log(`Running example: ${filePath}`);

    const { stdout, stderr } = await execAsync("node", [filePath]);
    console.log(`stdout:\n${stdout}\nstderr:\n${stderr}`);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
