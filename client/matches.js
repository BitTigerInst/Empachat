
Meteor.subscribe('userStatus');

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
    return Meteor.users.find({'status.online': false}).fetch()
  }
});

Template.matches.events({
  "submit .new-chat": function(event){
    event.preventDefault();
    var username = event.target.username.value;
    var emotion = event.target.emotion.value;
    console.log(username + ', ' + emotion);

  }
});
