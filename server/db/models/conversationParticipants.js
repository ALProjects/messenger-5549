const { Op, Sequelize } = require("sequelize");
const db = require("../db");

const ConversationParticipants = db.define('conversation_participants', {})

// find participants given the conversation id
ConversationParticipants.findParticipants = async function (conversationId) {
  const participants = await ConversationParticipants.findAll({
    where: {
      conversationId: conversationId
    }
  });

  // return participants or null if no participants exist
  return participants;
};

// Find all conversations where every participant in the array is present
ConversationParticipants.findConversations = async function (participantIdArray) {
  let intersectArray = [];
  let prevIntersectArray = [];
  let currConversations = [];
  // Find all the conversations where all participants are involved
  for (let i = 0; i < participantIdArray.length; i++) {
    // Get all conversations one participant is a part of
    const conversations = await ConversationParticipants.findAll({
      where: {
        userId: participantIdArray[i]
      }
    })
    currConversations = conversations;
    // If we are in the first iteration, there will be no prev to compare to. Thus breaking our intersect immediately.
    // To fix this, we just set our intersectArray as our current conversation array
    if (i === 0) {
      intersectArray = currConversations;
    } else {
      // Filter out any conversations where not everyone is a part of 
      intersectArray = currConversations.filter(conversation => prevIntersectArray.includes(conversation));
    }
    //Update our prev array.
    prevIntersectArray = intersectArray;
  }

  return intersectArray;
}

module.exports = ConversationParticipants;
