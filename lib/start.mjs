#!/usr/bin/env node

import { join } from "node:path";
import { homedir } from "node:os";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const [profile, name] = process.argv.slice(2);

const configFilePath = join(homedir(), ".aws-ssm-session-config");
const configFile = readFileSync(configFilePath, { encoding: "utf8" });
const ssmParams = JSON.parse(configFile);

const param = execFileSync("aws", [
    "ssm", "get-parameter",
    "--profile", profile,
    "--name", ssmParams[name],
    "--query", "Parameter.Value",
    "--output", "text",
    "--with-decryption",
], { encoding: "utf8" });

const config = JSON.parse(param);

execFileSync("aws", [
    "ssm", "start-session",
    "--profile", profile,
    "--target", config.nodeId,
    "--document-name", config.name,
    "--parameters", JSON.stringify(config.parameters ?? {}),
], { stdio: "inherit" });
