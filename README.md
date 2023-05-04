# aws-ssm-session

This CLI tool is a thin wrapper around the `aws ssm start-session` AWS CLI command that loads pre-defined configuration including AWS credential profile, SSM instance ID, SSM document, and session parameters from AWS Parameter Store.

Reference: https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ssm/start-session.html

## Installation

```sh
npm i -g aws-ssm-session
```

## Usage

Before you can establish a port forwarding session to a remote host you must have configured it's AWS Parameter Store name with the following command:

```sh
ssm-configure --name [custom_name] --paramName [parameter_store_name]
```

The value for `--name` can be any string value you choose. `--paramName` must be an existing SSM parameter where its value is set to a configration in the format of serialised JSON.

Then to establish an SSM port forwarding session, execute the following command:

```sh
ssm-start [profile] [name]
```

The value of `profile` should match an existing AWS credential profile. `name` refers to the custom name set with `ssm-configure`.

## Pre-requisites

The AWS Session Manager plugin for AWS CLI must be installed. Installation instructions can be found here: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html

This tool requires the parameter store value to be serialised JSON that matches the following schema:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
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
  "required": ["id", "name", "nodeId", "parameters"]
}
```

Example configuration:

```json
{
  "id": "foo",
  "name": "MySSMSessionDocumentName",
  "nodeId": "i-0123456789",
  "parameters": {
    "portNumber": ["8080"],
    "localPortNumber": ["8080"]
  }
}
```

Example execution for the configuration shown above:

```sh
ssm-start my-profile foo
```
