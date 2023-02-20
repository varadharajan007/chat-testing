import { Client as ConversationsClient } from '@twilio/conversations';
import { EventEmitter } from 'events';
import { TranslatePipe } from '../../core/pipes/translate/translate.pipe';

class EventConstants {
  static MESSAGE_ADDED = 'manh:messageadded';
  static TYPING_STARTED = 'manh:typingstarted';
  static TYPING_ENDED = 'manh:typingended';
  static CUSTOMER_TYPING_STARTED = 'manh:customertypingstarted';
  static CUSTOMER_TYPING_ENDED = 'manh:customertypingended';
  static AGENT_ADDED = 'manh:agentadded';
  static POPULATE_MESSAGE = 'manh:populatemessage';
  static CHATWINDOW_MINIMIZE = 'manh:minimize';
  // static CONNECT_TO_AGENT = 'manh:connecttoagent'
}

class Constants {
  static FROM_CUSTOMER = 'fromCustomer';
  static REGISTERED = 'registered';
  static IDENTITY = 'identity';
  static AGENT_ADDED = 'agentAdded';
  static AGENT_NAME = 'agentName';
  static AGENT_ID = 'agentId';
  static NAME = 'name';
  static CHAT_BOT = 'chatbot';
  static INTENT = 'Intent';
}

/**
 * @classdesc A Conversation represents communication between multiple Conversations Clients
 * @property {String} registeredCustomerId - Customer Id of logged in user
 * @property {String} agentId - Id of the agent
 * @property {String} agentName - Name of the agent
 * @property {String} firstName - First name of the customer
 * @property {String} lastName - Last name of the customer
 * @property {String} emailId - Email Id of the customer
 * @property {String} phone - Phone of the customer
 * @property {boolean} minimizeVal - Minimize window boolean value
 *
 * @fires Conversation#manh:messageadded
 * @fires Conversation#manh:typingstarted
 * @fires Conversation#manh:typingended
 *
 * @fires Conversation#manh:minimize
 */
class Conversation extends EventEmitter {
  #conversation;
  #fromCSR = false;
  #messages = [];

  registeredCustomerId;
  agentId = '';
  agentName = 'Agent';
  firstName;
  lastName;
  emailId;
  phone;
  minimizeVal;

  constructor() {
    super();
  }

  _setConversation(conversation) {
    this.#conversation = conversation;
  }

  _setMessageOrigin(response) {
    this.#fromCSR = response;
  }

  _setMessages(messages) {
    this.#messages = messages;
  }

  /**
   * Returns messages from conversation.
   *
   * @returns {Array} List the messages in conversation
   */
  getMessages() {
    return this.#messages;
  }

  _addMessage(message) {
    this.#messages.push(message);
  }

  /**
   * Fire this event when you start typing in the Conversation.
   *
   */
  typing() {
    this.#conversation.typing();
  }

  /**
   * Send a Message in the Conversation.
   * @param {String} message - The message body for text message,
   *
   */
  sendMessage(message, attributes) {
    let messageAttributes = {};
    if (attributes) {
      messageAttributes = attributes;
    }
    messageAttributes[Constants.FROM_CUSTOMER] = !this.#fromCSR;
    messageAttributes[Constants.AGENT_ID] = this.agentId;
    messageAttributes[Constants.REGISTERED] = this.registeredCustomerId
      ? true
      : false;
    this.#conversation.sendMessage(message, messageAttributes);
  }
}

/**
 * @classdesc A Manhattan client static class to be used
 * @class
 * @hideconstructor
 */
class ManhClient {
  static _events = new EventEmitter();

  static _populateToMessage(message) {
    ManhClient._events.emit(EventConstants.POPULATE_MESSAGE, message);
  }

  static minimize(isMinimized) {
    ManhClient._events.emit(EventConstants.CHATWINDOW_MINIMIZE, isMinimized);
    var data = {
      showPopup: false,
    };
    parent.window.postMessage(data, '*');
  }

  /**
   * This method is to be called to initialize the conversations by passing the payload
   * @static this is a static method
   * @param {Object} payload - This Object consists of accessToken, conversationId, customer info like registered customer id, first name, last name , email Id , phone  and call back functions like onConversationLoaded, onConnected.
   */
  static initialize(payload) {
    ManhClient._fetchConversation(payload, false);
  }

  static initializeCSR(payload) {
    ConversationsClient.create(payload.accessToken)
      .then((client) => {
        client.on('connectionStateChanged', (state) => {
          if (
            state === 'connected' ||
            state === 'connecting' ||
            state === 'disconnecting' ||
            state === 'disconnected' ||
            state === 'denied'
          ) {
            payload.onConnected(state);
          }
        });
        client.on('conversationAdded', (conversation) => {
          payload.onConversationAdded(conversation);
        });
        client.on('conversationUpdated', (conversation) => {
          payload.onConversationUpdated(conversation);
        });
        client.on('tokenAboutToExpire', () => {
          payload.onTokenAboutToExpire();
        });
        client.on('tokenExpired', () => {
          payload.onTokenExpired();
        });

        payload.onClientLoaded(client);
      })
      .catch((e) => {
        payload.onClientLoaded(null, 'errorWhileCreating_TC');
      });
  }

  static _fetchConversationCSR(client, payload) {
    let conversation = new Conversation();
    let activeConversation;
    conversation.registeredCustomerId = payload.registeredCustomerId;
    conversation.firstName = payload.firstName;
    conversation.lastName = payload.lastName;
    conversation.emailId = payload.emailId;
    conversation.phone = payload.phone;
    conversation._setMessageOrigin(true);

    client
      .getConversationBySid(payload.conversationId)
      .then((conversationObject) => {
        activeConversation = conversationObject;
        conversation._setConversation(conversationObject);
        ManhClient._fetchMessagesCSR(activeConversation, conversation, payload);
        ManhClient._addListeners(activeConversation, conversation, true);
      })
      .catch((e) => {
        payload.onConversationLoaded(null, null, 'errorWhileFetching_TC');
      });
  }

  static _fetchConversation(payload, fromCSR) {
    ConversationsClient.create(payload.accessToken)
      .then((client) => {
        let conversation = new Conversation();
        let activeConversation;
        conversation.registeredCustomerId = payload.registeredCustomerId;
        conversation.firstName = payload.firstName;
        conversation.lastName = payload.lastName;
        conversation.emailId = payload.emailId;
        conversation.phone = payload.phone;
        if (fromCSR) {
          conversation._setMessageOrigin(true);
        }

        client.options.syncClient.on('tokenAboutToExpire', () => {
          client.options.syncClient.updateToken(payload.accessToken);
        });

        client.on('connectionStateChanged', (state) => {
          if (
            payload.onConnected &&
            (state === 'connected' ||
              state === 'connecting' ||
              state === 'disconnecting' ||
              state === 'disconnected' ||
              state === 'denied')
          ) {
            payload.onConnected(state);
          }
          if (state === 'connected') {
            client
              .getConversationBySid(payload.conversationId)
              .then((conversationObject) => {
                activeConversation = conversationObject;
                conversation._setConversation(conversationObject);
                ManhClient._fetchMessages(
                  activeConversation,
                  conversation,
                  payload
                );
                ManhClient._addListeners(
                  activeConversation,
                  conversation,
                  fromCSR
                );
              })
              .catch((e) => {
                payload.onConversationLoaded(null, 'errorWhileFetching_TC');
              });
          } else {
            ManhClient._removeListeners(activeConversation, conversation);
          }
        });
      })
      .catch((e) => {
        payload.onConversationLoaded(null, 'errorWhileCreating_TC');
      });
  }

  static _fetchMessages(activeConversation, conversation, payload) {
    activeConversation
      .getMessages()
      .then((messagesObject) => {
        let messages = [];
        messagesObject.items.forEach((message) => {
          let messageObject = {};
          messageObject.body = message.body;
          messageObject.dateUpdated = message.dateUpdated;
          messageObject.attributes = message.attributes;
          if (message.media) {
            message.media.getContentTemporaryUrl().then((response) => {
              messageObject.media = {
                imageUrl: response,
              };
            });
          }
          ManhClient._setSenderDetails(messageObject, message, conversation);
          messages.push(messageObject);
        });
        conversation._setMessages(messages);
        payload.onConversationLoaded(conversation);
      })
      .catch((e) => {
        payload.onConversationLoaded(null, 'Error while fetching messages');
      });
  }

  static _fetchMessagesCSR(activeConversation, conversation, payload) {
    activeConversation
      .getMessages()
      .then((messagesObject) => {
        let messages = [];
        messagesObject.items.forEach((message) => {
          let messageObject = {};
          messageObject.body = message.body;
          messageObject.dateUpdated = message.dateUpdated;
          messageObject.attributes = message.attributes;
          if (message.media) {
            message.media.getContentTemporaryUrl().then((response) => {
              messageObject.media = {
                imageUrl: response,
              };
            });
          }
          ManhClient._setSenderDetails(messageObject, message, conversation);
          messages.push(messageObject);
        });
        conversation._setMessages(messages);
        payload.onConversationLoaded(activeConversation, conversation);
      })
      .catch((e) => {
        payload.onConversationLoaded(
          null,
          null,
          'Error while fetching messages'
        );
      });
  }

  static _addListeners(activeConversation, conversation, fromCSR) {
    activeConversation.on('messageAdded', (message) => {
      let messageObject = {};
      messageObject.body = message.body;
      messageObject.dateUpdated = message.dateUpdated;
      messageObject.attributes = message.attributes;
      if (message.media) {
        message.media.getContentTemporaryUrl().then((response) => {
          messageObject.media = {
            imageUrl: response,
          };
        });
      }
      ManhClient._setSenderDetails(messageObject, message, conversation);
      conversation._addMessage(messageObject);
      conversation.emit(EventConstants.MESSAGE_ADDED, messageObject);
    });
    activeConversation.on('participantJoined', (participant) => {
      if (participant.attributes[Constants.NAME]) {
        let messageObject = {};
        messageObject.agentAdded = true;
        messageObject.body =
          'Connected to agent ' + participant.attributes[Constants.NAME];
        conversation.agentId = participant[Constants.IDENTITY];
        conversation.agentName = participant.attributes[Constants.NAME];
        conversation._addMessage(messageObject);
        conversation.emit(EventConstants.AGENT_ADDED);
      }
    });
    activeConversation.on('typingStarted', (participant) => {
      let participantObject = {};
      participantObject.author = participant.identity;
      fromCSR
        ? conversation.emit(
            EventConstants.CUSTOMER_TYPING_STARTED,
            participantObject
          )
        : conversation.emit(EventConstants.TYPING_STARTED, participantObject);
    });
    activeConversation.on('typingEnded', (participant) => {
      let participantObject = {};
      participantObject.author = participant.identity;
      fromCSR
        ? conversation.emit(
            EventConstants.CUSTOMER_TYPING_ENDED,
            participantObject
          )
        : conversation.emit(EventConstants.TYPING_ENDED, participantObject);
    });
  }

  static _setSenderDetails(messageObject, message, conversation) {
    if (message.attributes) {
      if (message.attributes[Constants.FROM_CUSTOMER] === true) {
        messageObject.senderType = 'customer';
        messageObject.senderId = conversation.registeredCustomerId
          ? conversation.registeredCustomerId
          : null;
        if (conversation.firstName || conversation.lastName) {
          messageObject.senderDisplayName =
            conversation.firstName + ' ' + conversation.lastName;
        } else {
          messageObject.senderDisplayName = 'You_TC';
        }
      } else if (message.author === Constants.CHAT_BOT) {
        messageObject.senderType = 'bot';
        messageObject.senderId = message.author;
        messageObject.senderDisplayName = 'robinChatBot_TC';
      } else {
        messageObject.senderType = 'agent';
        messageObject.senderId = message.author;
        messageObject.senderDisplayName =
          message.attributes[Constants.AGENT_NAME];
        conversation.agentId = message.author;
        conversation.agentName = message.attributes[Constants.AGENT_NAME];
      }
    }
  }

  static _removeListeners(activeConversation, conversation) {
    if (activeConversation) {
      activeConversation.removeAllListeners(['messageAdded']);
      activeConversation.removeAllListeners(['typingStarted']);
      activeConversation.removeAllListeners(['typingEnded']);
      activeConversation.removeAllListeners(['participantJoined']);
    }
    if (conversation) {
      conversation.removeAllListeners();
    }
  }
}

export { ManhClient };
/*
 *
 * Fired when a new Message is added to the Conversation.
 * @event Conversation#manh:messageadded
 * @type {Message}
 * @returns message object with author, message , updated date information
 */

/*
 *
 * Fired when a user started typing in the Conversation.
 * @event Conversation#manh:typingstarted
 */

/*
 *
 * Fired when a user stopped typing in the Conversation.
 * @event Conversation#manh:typingended
 */

/*
 *
 * Fired when a user minimize.
 * @event Conversation#manh:minimize
 */
