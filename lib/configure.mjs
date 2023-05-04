#!/usr/bin/env node

import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);

const nameIndex = args.indexOf("--name");
const paramNameIndex = args.indexOf("--paramName");

if (nameIndex < 0) {
    console.error("Flag '--name' expected but not provided.");
    process.exit(1);
}

if (paramNameIndex < 0) {
    console.error("Flag '--paramName' expected but not provided.");
    process.exit(1);
}

const name = args.at(nameIndex + 1);
const paramName = args.at(paramNameIndex + 1);

if (!name || name.startsWith("-")) {
    console.error("Invalid value for '--name'.");
    process.exit(1);
}

if (!paramName || !paramName.startsWith("/")) {
    console.error("Invalid value for '--paramName'.");
    process.exit(1);
}

const configFilePath = join(homedir(), ".aws-ssm-session-config");

if (!existsSync(configFilePath)) {
    writeFileSync(configFilePath, JSON.stringify({}), { encoding: "utf8" });
}

const configFile = readFileSync(configFilePath, { encoding: "utf8" });
const config = JSON.parse(configFile);

const updatedConfigFile = JSON.stringify({ ...config, [name]: paramName });

writeFileSync(configFilePath, updatedConfigFile, { encoding: "utf8" });
