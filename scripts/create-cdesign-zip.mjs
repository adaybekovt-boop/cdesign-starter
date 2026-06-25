#!/usr/bin/env node
// Creates a portable source archive for the current cdesign project.
// No external dependencies: the script writes a standard ZIP file directly.

import { deflateRawSync } from "node:zlib";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";

const root = process.cwd();
const outputName = process.argv[2] || "cdesign-starter.zip";
const outputPath = resolve(root, outputName);
const outputBase = basename(outputPath);

const EXCLUDED_DIRS = new Set([
  ".git",
  ".next",
  ".turbo",
  ".vercel",
  "build",
  "coverage",
  "node_modules",
  "out",
]);

const EXCLUDED_FILES = new Set([
  ".DS_Store",
  "next-env.d.ts",
  "npm-debug.log",
  "yarn-debug.log",
  "yarn-error.log",
]);

function shouldSkipFile(path) {
  const name = basename(path);
  if (name === outputBase) return true;
  if (EXCLUDED_FILES.has(name)) return true;
  if (name.endsWith(".zip")) return true;
  if (name.endsWith(".tsbuildinfo")) return true;
  if (name.endsWith(".pem")) return true;
  if (name.startsWith(".env")) return true;
  if (name.endsWith(".log")) return true;
  return false;
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".") && EXCLUDED_DIRS.has(name)) continue;
    if (EXCLUDED_DIRS.has(name)) continue;

    const path = join(dir, name);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      walk(path, files);
      continue;
    }

    if (!shouldSkipFile(path)) files.push(path);
  }

  return files;
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosTime(date) {
  const year = Math.max(date.getFullYear(), 1980);
  const time =
    (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1);
  const day =
    ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, day };
}

function localFileHeader(entry) {
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0x0800, 6);
  header.writeUInt16LE(8, 8);
  header.writeUInt16LE(entry.time, 10);
  header.writeUInt16LE(entry.day, 12);
  header.writeUInt32LE(entry.crc, 14);
  header.writeUInt32LE(entry.compressedSize, 18);
  header.writeUInt32LE(entry.uncompressedSize, 22);
  header.writeUInt16LE(entry.nameBuffer.length, 26);
  header.writeUInt16LE(0, 28);
  return Buffer.concat([header, entry.nameBuffer]);
}

function centralDirectoryHeader(entry) {
  const header = Buffer.alloc(46);
  header.writeUInt32LE(0x02014b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(20, 6);
  header.writeUInt16LE(0x0800, 8);
  header.writeUInt16LE(8, 10);
  header.writeUInt16LE(entry.time, 12);
  header.writeUInt16LE(entry.day, 14);
  header.writeUInt32LE(entry.crc, 16);
  header.writeUInt32LE(entry.compressedSize, 20);
  header.writeUInt32LE(entry.uncompressedSize, 24);
  header.writeUInt16LE(entry.nameBuffer.length, 28);
  header.writeUInt16LE(0, 30);
  header.writeUInt16LE(0, 32);
  header.writeUInt16LE(0, 34);
  header.writeUInt16LE(0, 36);
  header.writeUInt32LE(0, 38);
  header.writeUInt32LE(entry.offset, 42);
  return Buffer.concat([header, entry.nameBuffer]);
}

function endOfCentralDirectory(entryCount, centralSize, centralOffset) {
  const header = Buffer.alloc(22);
  header.writeUInt32LE(0x06054b50, 0);
  header.writeUInt16LE(0, 4);
  header.writeUInt16LE(0, 6);
  header.writeUInt16LE(entryCount, 8);
  header.writeUInt16LE(entryCount, 10);
  header.writeUInt32LE(centralSize, 12);
  header.writeUInt32LE(centralOffset, 16);
  header.writeUInt16LE(0, 20);
  return header;
}

const files = walk(root)
  .map((path) => ({
    path,
    zipName: relative(root, path).split(sep).join("/"),
  }))
  .sort((a, b) => a.zipName.localeCompare(b.zipName));

if (files.length === 0) {
  throw new Error("No files found to archive.");
}

const localParts = [];
const centralParts = [];
const entries = [];
let offset = 0;

for (const file of files) {
  const source = readFileSync(file.path);
  const compressed = deflateRawSync(source, { level: 9 });
  const { time, day } = dosTime(statSync(file.path).mtime);
  const entry = {
    nameBuffer: Buffer.from(file.zipName, "utf8"),
    crc: crc32(source),
    compressedSize: compressed.length,
    uncompressedSize: source.length,
    time,
    day,
    offset,
  };

  const local = localFileHeader(entry);
  localParts.push(local, compressed);
  offset += local.length + compressed.length;
  entries.push(entry);
}

const centralOffset = offset;
for (const entry of entries) {
  const central = centralDirectoryHeader(entry);
  centralParts.push(central);
  offset += central.length;
}

const centralSize = offset - centralOffset;
const zip = Buffer.concat([
  ...localParts,
  ...centralParts,
  endOfCentralDirectory(entries.length, centralSize, centralOffset),
]);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, zip);

console.log(
  `Created ${relative(root, outputPath)} (${entries.length} files, ${(zip.length / 1024).toFixed(1)} KB)`,
);
