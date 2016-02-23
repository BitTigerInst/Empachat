Template.chat.messages = function () {
  var messagesCursor = Messages.find({}, {sort:{timestamp:-1}, limit:42});
  var messages = messagesCursor.fetch().reverse(); // Should use observechnage to avoid over computation ?
  
  for (var i = messages.length - 1; i >= 0; i--) {
    var user =  Meteor.users.findOne(messages[i].author);
    if (user) {
      messages[i].name = user.profile.name;
    }
    else {
      messages[i].name = "Unknown";
    }
  }

  var conversations = [];
  var newConversation = messages[0];
  for (var i = 0; i <= messages.length - 2; i++) {
    var timedelta = messages[i+1].timestamp - messages[i].timestamp; 
    var sameauthor = (messages[i+1].author === messages[i].author);
    if (timedelta <= 30000 && sameauthor) {
      newConversation.message = newConversation.message + " \n" + messages[i+1].message;
    }
    else {
      conversations.push(newConversation);
      newConversation = messages[i+1];
    }
  };
  conversations.push(newConversation);
  // title bar alert 
  $.titleAlert("New chat message!", {requireBlur: true});
  return conversations;
};
