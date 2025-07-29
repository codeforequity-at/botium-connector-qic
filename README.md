# Botium Connector for Amazon Q Connect

[![NPM](https://nodei.co/npm/botium-connector-qic.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/botium-connector-qic/)
[![npm version](https://badge.fury.io/js/botium-connector-qic.svg)](https://badge.fury.io/js/botium-connector-qic)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

This is a [Botium](https://github.com/codeforequity-at/botium-core) connector for testing your Amazon Q in Connect chatbot.

__Did you read the [Botium in a Nutshell](https://medium.com/@floriantreml/botium-in-a-nutshell-part-1-overview-f8d0ceaf8fb4) articles? Be warned, without prior knowledge of Botium you won't be able to properly use this library!__

## How it works
Botium connects to the [Amazon Connect API](https://docs.aws.amazon.com/connect/latest/APIReference/API_Operations_Amazon_Q_Connect.html) to start a chat session and interact with your Amazon Q in Connect Assistant.

It can be used as any other Botium connector with all Botium Stack components:
* [Botium CLI](https://github.com/codeforequity-at/botium-cli/)
* [Botium Bindings](https://github.com/codeforequity-at/botium-bindings/)
* [Botium Box](https://www.botium.at)

This connector does not extract NLP info, so NLP based asserters wont work using this technology

## Requirements
* **Node.js and NPM**
* An **Amazon Connect instance** with Amazon Q assistant.
* An **IAM user** with permissions to use the Amazon Connect API.
* A **project directory** on your workstation to hold test cases and Botium configuration.

## Install Botium and Amazon Q in Connect Connector

When using __Botium CLI__:

```
> npm install -g botium-cli
> npm install -g botium-connector-qic
> botium-cli init
> botium-cli run
```

When using __Botium Bindings__:

```
> npm install -g botium-bindings
> npm install -g botium-connector-qic
> botium-bindings init mocha
> npm install && npm run mocha
```

When using __Botium Box__:

_Already integrated into Botium Box, no setup required_

## Connecting Amazon Q in Connect to Botium

You have to create an **IAM user** to enable Botium to access the Amazon Connect API.

* [Create an IAM user](https://console.aws.amazon.com/iam/) (see [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) for help)
  * Important: choose _Programmatic access_ as access type
  * Note access key and secret, you need it later
  * Choose _Attach existing policies to user directly_ to give permissions. A good starting point is the `AmazonConnect_FullAccess` policy.
  * Feel free to use finer grained policies if you know what you are doing, or read [Authentication and Access Control for Amazon Connect](https://docs.aws.amazon.com/connect/latest/adminguide/security-iam.html).

Create a `botium.json` with your Amazon Connect and chat configuration:

```json
{
  "botium": {
    "Capabilities": {
      "CONTAINERMODE": "qic",
      "QIC_ASSISTANT_ID": "your-assistant-id",
      "QIC_AWS_REGION": "us-east-1",
      "QIC_AWS_ACCESS_KEY_ID": "your-access-key-id",
      "QIC_AWS_SECRET_ACCESS_KEY": "your-secret-access-key"
    }
  }
}
```

To check the configuration, run the emulator (Botium CLI required) to bring up a chat interface in your terminal window:

```
> botium-cli emulator
```

Botium setup is ready, you can begin to write your [BotiumScript](https://botium-docs.readthedocs.io/en/latest/05_botiumscript/index.html) files.

## Supported Capabilities

Set the capability **CONTAINERMODE** to **qic** to activate this connector.

### QIC_AWS_REGION
**Required.** AWS region where your Connect instance is located (e.g., `us-east-1`).

### QIC_AWS_ACCESS_KEY_ID
**Required.** AWS access key ID for authentication.

### QIC_AWS_SECRET_ACCESS_KEY
**Required.** AWS secret access key for authentication.

### QIC_ASSISTANT_ID
**Required.** The identifier of the Amazon Q assistant.

### QIC_CLIENT_TOKEN
A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If not provided, a UUID is generated.

### QIC_GENERATE_FILLER_MESSAGE
Enable or disable generation of filler messages. Set to true to enable.

