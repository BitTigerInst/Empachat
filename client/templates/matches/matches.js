
Tracker.autorun(function(){
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
    //Session.set('isChatting',1);
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

// Handlebars.registerHelper('getStatusColor', function(isChatting) {
//   switch (isChatting) {
//     case 0 : {
//       return 'green';
//     }
//     break;
//     case 1 : {
//       return 'red';
//     }
//     break;
//   }
// });

