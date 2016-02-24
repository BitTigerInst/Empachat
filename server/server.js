Messages = new Meteor.Collection('messages');
Channels = new Meteor.Collection('channels');
ChatRooms = new Meteor.Collection("chatrooms");

Meteor.publish("userStatus", function() {
  return Meteor.users.find();
});

Meteor.publish("chatrooms",function(){
    return ChatRooms.find({});
});
Meteor.startup(function(){
   ChatRooms.allow({
        'insert':function(userId,doc){
            return true;
        },
        'update':function(userId,doc,fieldNames, modifier){
            return true;
        },
        'remove':function(userId,doc){
            return false;
        }
    }); 
});
