Tracker.autorun(function(){
    Meteor.subscribe("chatrooms");
});




Template.input.events ({
  'keydown input#message' : function (event) {
    
    if (event.which === 13) { 
        if (Meteor.user())
        {
          var name = Meteor.user().username;
          var message = document.getElementById('message');
          if (message.value !== '') {
              scrolldown();
            var de = ChatRooms.update({"_id":Session.get("roomid")},{$push:{messages:{
              name: name,
              text: message.value,
              createdAt: Date.now()
              
            }}});
            console.log(de);
            Notifications.insert({
              postId: Meteor.userId(),
              userId: Session.get("currentId"),
              username: Meteor.user().username,
              read: false
            });
            //console.log(Notifications.findOne(Meteor.userId());
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
