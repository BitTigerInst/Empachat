Template.search.helpers({
		settings: function() {
			return {
				position: "bottom",
				limit: 5,
				rules: [
					{
						// token: '',
						collection: Words,
						field: 'word',
						matchAll: true,
						template: Template.words
					}
				]
			};
		},
		words: function() {
			return Words.find();
		}
	});


Meteor.subscribe("words");
Meteor.subscribe("songs");


function jumpto(anchor){
    window.location.href = anchor;
}

function goBack() {
    window.history.back();
}


function hidden() {
    window.document.getElementById("home").setAttribute("class","hidden");
    window.document.getElementById("chatbox").style.display = 'initial';
}


function unhidden() {
    window.document.getElementById("home").removeAttribute("class","hidden");
    window.document.getElementById("chatbox").style.display = 'none';
}

Template.search.events({
		"submit .request": function (event) {

			event.preventDefault();
			var word = event.target.emotion.value;
            word = word.trim();
            if (word == "")
            {
                window.alert("Please enter your emotion!!!");
                return;
            }

            if (!Words.findOne({"word": word}))
            {
                window.alert("Unfound emotion " + word + "!!!");
                return;
            }
			          
            hidden();
			Meteor.call("addRequest", word);

            var target_emotion = Words.find({"word": word}).fetch()[0].target;
            console.log(target_emotion);
            var song_num = Songs.find({"emotion": target_emotion}).count();
            var index = Math.floor((Math.random() * song_num) + 1) - 1;
            var song_url = Songs.find({"emotion": target_emotion}).fetch()[index].src[0];   
            Session.set('current_song_url', song_url);
            
			event.target.emotion.value = "";	
		},
		
		
	});

Template.cancel.events({
	"submit .cancel": function (event) 
	{	
		event.preventDefault();
		Meteor.call("deleteRequest");
        unhidden();
        Session.set('current_song_url', '');
	}
});

Meteor.methods({    
    addRequest: function (word)
    {
        var requests = Requests.find().fetch();
        
        var myGuests = [];
        console.log("length = " + requests.length);
        for (i = 0; i < requests.length; i++)
        {
            var pair1 = Pairs.find({"source": word, "target": requests[i]["emotion"]}).fetch()[0];
            var pair2 = Pairs.find({"source": requests[i]["emotion"], "target": word}).fetch()[0];

            if (pair1 || pair2)
            {
                console.log("i'm here");
                var updateGuests = Candidates.find({"host": requests[i]["username"]}).fetch()[0].guests;
                updateGuests.push(Meteor.user().username);
                Candidates.update({host: requests[i].username}, {host: requests[i].username, guests: updateGuests});

                myGuests.push(requests[i].username);
            }
        }
        
        Requests.insert({
            username: Meteor.user().username,
            emotion: word
        });
        
        Candidates.insert({
            host: Meteor.user().username,
            guests: myGuests
        });
    },
    
    deleteRequest: function ()
    {
        Requests.remove({
            username: Meteor.user().username,
        });
        var myGuests = Candidates.find({"host": Meteor.user().username}).fetch()[0].guests;
        Candidates.remove({host: Meteor.user().username});
        for (i = 0; i < myGuests.length; i++)
        {
            var updateguests = Candidates.find({"host": myGuests[i]}).fetch()[0].guests;
            index = updateguests.indexOf(Meteor.user().username);
            updateguests.splice(index, 1);
            Candidates.update({host: myGuests[i]}, {host: myGuests[i], guests: updateguests});
        }
    },

    logoutClean: function (user_name)
    {
        Requests.remove({
            username: user_name,
        });
        var myGuests = Candidates.find({"host": user_name}).fetch()[0].guests;
        Candidates.remove({host: user_name});
        for (i = 0; i < myGuests.length; i++)
        {
            var updateguests = Candidates.find({"host": myGuests[i]}).fetch()[0].guests;
            index = updateguests.indexOf(user_name);
            updateguests.splice(index, 1);
            Candidates.update({host: myGuests[i]}, {host: myGuests[i], guests: updateguests});
        }
    }

});



