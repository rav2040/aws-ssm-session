#!/usr/bin/env node

import { join } from "node:path";
import { homedir } from "node:os";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const [, , profile, ssmDocumentId] = process.argv;

const configFile = readFileSync(join(homedir(), ".aws-ssm-session", `${profile}.config`), { encoding: "utf8" });
const config = JSON.parse(configFile).ssmDocuments[ssmDocumentId];

execFileSync("aws", [
    "ssm", "start-session",
    "--profile", profile,
    "--target", config.nodeId,
    "--document-name", config.name,
    "--parameters", JSON.stringify(config.parameters),
], { stdio: "inherit" });
