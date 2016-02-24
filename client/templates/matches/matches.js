
Tracker.autorun(function(){
    Meteor.subscribe("chatrooms");
    Meteor.subscribe('userStatus');
});



Template.matches.labelClass = function() {
  if (this.status.idle)
    return "label-warning";
  else if (this.status.online)
    return "label-success";
  else
    return "label-default";
};

Template.matches.helpers({
  matched_users: function(){
    return Meteor.users.find({'status.online': true, _id: {$ne: Meteor.userId()}})
  }
});

Template.matches.events({
  /*
  'submit .new-chat': function(event){
    event.preventDefault();
    var username = event.target.username.value;
    event.target.username.value = '';
  },
  */

  'click .user':function(){
    Session.set('currentId',this._id);
    var res=ChatRooms.findOne({chatIds:{$all:[this._id,Meteor.userId()]}});
    if(res){
    //already room exists
      Session.set("roomid",res._id);
    }
    else{
    //no room exists
      var newRoom= ChatRooms.insert({chatIds:[this._id , Meteor.userId()],messages:[]});
      Session.set('roomid',newRoom);
    }
  }
});

Template.messages.helpers({
  'msgs':function(){
      var result=ChatRooms.findOne({_id:Session.get('roomid')});
      if(result){
        return result.messages;
      }
  }
});

Template.input.events ({
  'keydown input#message' : function (event) {
    if (event.which === 13) { 
        if (Meteor.user())
        {
          var name = Meteor.user().username;
          var message = document.getElementById('message');
          if (message.value !== '') {
            var de = ChatRooms.update({"_id":Session.get("roomid")},{$push:{messages:{
              name: name,
              text: message.value,
              createdAt: Date.now()
            }}});
            console.log(de);
            document.getElementById('message').value = '';
            message.value = '';
          }
        }
        else
        {
           alert("login to chat");
        } 
    }
  }
});
