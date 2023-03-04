# aws-ssm-session

This CLI tool is a thin wrapper around the `aws ssm start-session` AWS CLI command that loads pre-defined configuration including AWS credential profile, SSM instance ID, SSM document, and session parameters.

Reference: https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ssm/start-session.html

## Installation

```sh
npm i -g aws-ssm-session
```

## Usage

```sh
ssm-start [profile] [id]
```
The value of `profile` should match an existing AWS credential profile *and* the name of your configuration file. `id` refers to one of the SSM documents listed in the configuration. See below for details.

## Pre-requisites

The AWS Session Manager plugin for AWS CLI must be installed. Installation instructions can be found here: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html

This tool requires a configuration file to be present in your HOME directory under `.aws-ssm-session`. The configuration file should be named `[PROFILE].config`, where PROFILE is a value that matches the name of a configured AWS credential profile. For example, if you have an AWS profile named "my-profile", the configuration file should be named `my-profile.config`.

Example in Linux:

```
~/.aws-ssm-session/my-profile.config
```

The content of the configuration file should be valid JSON that matches the following schema:

```json
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "ssmDocuments": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    },
                    "nodeId": {
                        "type": "string"
                    },
                    "parameters": {
                        "type": "object"
                    }
                },
                "required": [
                    "id",
                    "name",
                    "nodeId",
                    "parameters"
                ]
            }
        }
    },
    "required": [
        "ssmDocuments"
    ]
}
```

Example configuration:

```json
{
    "ssmDocuments": [
        {
            "id": "foo",
            "name": "MySSMSessionDocumentName",
            "nodeId": "i-0123456789",
            "parameters": {
                "portNumber": ["8080"],
                "localPortNumber": ["8080"]
            }
        }
    ]
}
```

Example execution for the configuration shown above:

```sh
ssm-start my-profile foo
```
