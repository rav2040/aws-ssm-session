#!/usr/bin/env node

import { join } from "node:path";
import { homedir } from "node:os";
import { readFileSync } from "node:fs";
import { execFileSync, spawn } from "node:child_process";

const BACKGROUND_FLAGS = ["-b", "--background"];

const args = process.argv.slice(2);
const [profile, ssmDocumentId] = args.filter((arg) => !BACKGROUND_FLAGS.includes(arg));

const configFile = readFileSync(join(homedir(), ".aws-ssm-session", `${profile}.config`), { encoding: "utf8" });
const config = JSON.parse(configFile).ssmDocuments.find(({ id }) => id === ssmDocumentId);

const awsArgs = [
    "ssm", "start-session",
    "--profile", profile,
    "--target", config.nodeId,
    "--document-name", config.name,
    "--parameters", JSON.stringify(config.parameters ?? {}),
]

if (args.some((arg) => BACKGROUND_FLAGS.includes(arg))) {
    // Run as background process
    spawn("aws", awsArgs, { stdio: "ignore", detached: true }).unref();
} else {
    // Run as foreground process
    execFileSync("aws", awsArgs, { stdio: "inherit" });
}
