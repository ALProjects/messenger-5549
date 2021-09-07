const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const ConversationParticipants = require("./conversationParticipants");

// associations

User.hasMany(Conversation);
Conversation.belongsToMany(User, { as: 'conversation', through: ConversationParticipants });
User.belongsToMany(Conversation, { as: 'user', through: ConversationParticipants });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
  ConversationParticipants
};
