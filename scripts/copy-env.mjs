import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const example = join(root, ".env.example");
const target = join(root, ".env.local");

if (!existsSync(example)) {
  console.log("SKIP: .env.example tidak ditemukan");
  process.exit(0);
}

if (existsSync(target)) {
  console.log("SKIP: .env.local sudah ada");
  process.exit(0);
}

copyFileSync(example, target);
console.log("DONE: .env.local dibuat dari .env.example");
