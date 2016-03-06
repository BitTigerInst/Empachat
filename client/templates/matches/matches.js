
Tracker.autorun(function(){
    Meteor.subscribe('userStatus');
    Meteor.subscribe("candidates");
});



Template.input.events({

    'click div.card-panel': function (event, template) {
        if (Meteor.user()) {
            var name = Meteor.user().username;
            var messages = document.getElementsByClassName(name);
            for (i = 0; i < messages.length; i++) {
                messages[i].style.backgroundColor = 'azure';
                messages[i].style.borderRadius = "20px";
                messages[i].style.textAlign="right";
                
            }
            console.log("change color");
        }
    }


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
    //Candidates.find({"host": myGuests[i]}).fetch()[0].guests
    //console.log(Candidates.find());
    var candidates = Candidates.find({"host": Meteor.user().username}).fetch()[0].guests;
    console.log(candidates);
    //console.log(guests);
    
    return Meteor.users.find({$and: [{username: {$in: candidates}}, {'status.online': true}]});
    //return Meteor.users.find({'status.online': true, _id: {$ne: Meteor.userId()}})
  }
});
    
    $(document).ready(function(){
    $(".card-panel").hide(0).delay(500).fadeIn(3000)    
    });


Template.matches.events({

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
