const fs = require('fs')
const path = require('path')

const PluginClass = require('./src/connector')

const logo = fs.readFileSync(path.join(__dirname, 'logo.png')).toString('base64')

module.exports = {
  PluginVersion: 1,
  PluginClass: PluginClass,
  PluginDesc: {
    name: 'Amazon Q Connect',
    avatar: logo,
    provider: 'Amazon',
    features: {
      intentResolution: false,
      entityResolution: false,
      testCaseGeneration: false,
      testCaseExport: false
    },
    capabilities: [
      {
        name: 'QIC_ASSISTANT_ID',
        label: 'Q Assistant ID',
        type: 'string',
        required: true,
        description: 'The identifier of the Amazon Q assistant.'
      },
      {
        name: 'QIC_AWS_REGION',
        label: 'AWS Region',
        type: 'string',
        required: true,
        description: 'AWS region where your Amazon Q assistant is located (e.g., us-east-1)'
      },
      {
        name: 'QIC_AWS_ACCESS_KEY_ID',
        label: 'AWS Access Key ID',
        type: 'string',
        required: true,
        description: 'AWS access key ID for authentication'
      },
      {
        name: 'QIC_AWS_SECRET_ACCESS_KEY',
        label: 'AWS Secret Access Key',
        type: 'secret',
        required: true,
        description: 'AWS secret access key for authentication'
      },
      {
        name: 'QIC_CLIENT_TOKEN',
        label: 'Client Token',
        type: 'string',
        required: false,
        description: 'A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If not provided, a UUID is generated.',
        advanced: true
      },
      {
        name: 'QIC_GENERATE_FILLER_MESSAGE',
        label: 'Generate Filler Message',
        type: 'boolean',
        required: false,
        description: 'Enable or disable generation of filler messages. Set to true to enable.',
        advanced: true
      }
    ]
  }
}
