const { Op, Sequelize } = require("sequelize");
const db = require("../db");

const Conversation = db.define("conversation", {
  participantId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

// find conversation given an array of user ids

Conversation.findConversations = async function (arrayOfParticipantId) {
  // A map to track how many people are in a conversation
  let conversationMap = new Map();
  let conversationArray = [];
  let resultConversationArray = [];

  arrayOfParticipantId.forEach(currentParticipantId => {
    const conversation = await Conversation.findOne({
      where: {
        participantId: currentParticipantId,
      }
    });
    if (conversationMap.get(conversation.id)) {
      conversationMap.set(conversation.id, conversationMap.get(conversation.id) + 1);
    } else {
      conversationMap.set(conversation.id, 1);
      conversationArray.push(conversation);
    }
  })

  conversationArray.forEach(conversation => {
    if (conversationMap.get(conversation.id) === arrayOfParticipantId.length) {
      resultArray.push(conversation);
    }
  })

  // return conversation or null if it doesn't exist
  return resultConversationArray;
};

module.exports = Conversation;
