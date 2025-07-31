const debug = require('debug')('botium-connector-qic')
const _ = require('lodash')
require('dotenv').config()
const {
  QConnectClient,
  CreateSessionCommand,
  SendMessageCommand,
  GetNextMessageCommand,
  MessageType
} = require('@aws-sdk/client-qconnect')
const { v4: uuidv4 } = require('uuid')

const Capabilities = require('./Capabilities')

const RequiredCapabilities = [
  Capabilities.QIC_ASSISTANT_ID,
  Capabilities.QIC_AWS_REGION,
  Capabilities.QIC_AWS_ACCESS_KEY_ID,
  Capabilities.QIC_AWS_SECRET_ACCESS_KEY
]

class BotiumConnectorQIC {
  constructor ({ queueBotSays, caps }) {
    this.queueBotSays = queueBotSays
    this.caps = caps
    this.qConnectClient = null
    this.sessionId = null
    this.assistantId = null
    this.clientToken = null
  }

  Validate () {
    debug('Validate called')
    for (const cap of RequiredCapabilities) {
      if (!this.caps[cap]) throw new Error(`${cap} capability required`)
    }
  }

  Build () {
    debug('Build called')
    this.assistantId = this.caps[Capabilities.QIC_ASSISTANT_ID]
    this.clientToken = this.caps[Capabilities.QIC_CLIENT_TOKEN] || uuidv4()
  }

  async Start () {
    debug('Start called')

    this.qConnectClient = new QConnectClient({
      region: this.caps[Capabilities.QIC_AWS_REGION],
      credentials: {
        accessKeyId: this.caps[Capabilities.QIC_AWS_ACCESS_KEY_ID],
        secretAccessKey: this.caps[Capabilities.QIC_AWS_SECRET_ACCESS_KEY]
      }
    })

    const createSessionCommand = new CreateSessionCommand({
      clientToken: this.clientToken,
      assistantId: this.assistantId,
      name: `botium-session-${Date.now()}`
    })

    const sessionResponse = await this.qConnectClient.send(createSessionCommand)
    this.sessionId = sessionResponse.session.sessionId
    debug(`Session created with ID: ${this.sessionId}`)
  }

  async UserSays (msg) {
    debug('UserSays called')
    if (!this.sessionId) {
      throw new Error('Session not started.')
    }

    const sendMessageCommand = new SendMessageCommand({
      assistantId: this.assistantId,
      sessionId: this.sessionId,
      type: MessageType.TEXT,
      clientToken: this.clientToken,
      message: {
        value: {
          text: {
            value: msg.messageText
          }
        }
      }
    })

    if (!_.isNil(this.caps[Capabilities.QIC_GENERATE_FILLER_MESSAGE])) {
      sendMessageCommand.configuration = {
        generateFillerMessage: !!this.caps[Capabilities.QIC_GENERATE_FILLER_MESSAGE]
      }
    }
    let nextMessageToken
    try {
      const messageResponse = await this.qConnectClient.send(sendMessageCommand)
      nextMessageToken = messageResponse.nextMessageToken
    } catch (error) {
      debug('Error sending message to Q Connect:', error)
      throw new Error(`Error from Q Connect: ${error.message}`)
    }

    if (!nextMessageToken) {
      debug('No nextMessageToken received')
      throw new Error('No nextMessageToken received from Q Connect')
    }

    debug(`SendMessage token: ${nextMessageToken}`)

    this._getNextMessage(nextMessageToken)
  }

  async _getNextMessage (nextMessageToken) {
    if (!this.sessionId) {
      debug('Session not started, cannot get next message')
      return
    }
    try {
      const getNextMessageCommand = new GetNextMessageCommand({
        sessionId: this.sessionId,
        assistantId: this.assistantId,
        nextMessageToken
      })
      const nextMessageResponse = await this.qConnectClient.send(getNextMessageCommand)
      debug(`Next message: ${JSON.stringify(nextMessageResponse)}`)

      if (nextMessageResponse.response?.value?.text?.value) {
        const botMsg = {
          sender: 'bot',
          sourceData: nextMessageResponse,
          messageText: nextMessageResponse.response.value.text.value
        }
        // setTimeout is not required anymore, because _getNextMessage is already async, does not block userSays?
        setTimeout(() => this.queueBotSays(botMsg), 0)
      }

      if (nextMessageResponse.nextMessageToken) {
        debug(`Chained response, next message token: ${nextMessageResponse.nextMessageToken}`)
        this._getNextMessage(nextMessageResponse.nextMessageToken)
      }
    } catch (error) {
      debug('Error sending message to Q Connect:', error)
      // setTimeout is not required anymore, because _getNextMessage is already async, does not block userSays?
      setTimeout(() => this.queueBotSays(error), 0)
    }
  }

  async Stop () {
    debug('Stop called')
    this.sessionId = null
  }

  async Clean () {
    debug('Clean called')
    this.qConnectClient = null
  }
}

module.exports = BotiumConnectorQIC
