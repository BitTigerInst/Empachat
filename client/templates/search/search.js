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


function jumpto(anchor){
    window.location.href = anchor;
}

function goBack() {
    window.history.back();
}


function hidden() {
    window.document.getElementById("home").setAttribute("class","hidden");

    //window.document.getElementById("home").style.display = 'none';
    window.document.getElementById("chatbox").style.display = 'initial';
}


function unhidden() {
    window.document.getElementById("home").removeAttribute("class","hidden");
    //window.document.getElementById("home").style.display = 'initial';
    
    window.document.getElementById("chatbox").style.display = 'none';
}

Template.search.events({
		"submit .request": function (event) {
			//console.log("submit call");
			event.preventDefault();
			var word = event.target.emotion.value;
			//event.target.emotion.value = "";	
            
			//jumpto("#chatbox");
            hidden();
			Meteor.call("addRequest", word);
            
			event.target.emotion.value = "";	
		},
		
		
	});

Template.cancel.events({
	"submit .cancel": function (event) 
	{	
		event.preventDefault();
		Meteor.call("deleteRequest");
		//goBack();
		//jumpto("#home");
        unhidden();
	}
});

Meteor.methods({	
	addRequest: function (word)
	{
		
		if (!Words.findOne({"word": word}))
		{ 
            unhidden();
			window.alert("Cannot find " + word + "!!!");
            
			 return;
		}
		var requests = Requests.find().fetch();
		
		var myGuests = [];
		//console.log("length = " + requests.length);
		for (i = 0; i < requests.length; i++)
		{
			var pair1 = Pairs.find({"source": word, "target": requests[i]["emotion"]}).fetch()[0];
			var pair2 = Pairs.find({"source": requests[i]["emotion"], "target": word}).fetch()[0];
			if (pair1)
				console.log(pair1.distance);
			if (pair2)
				console.log(pair2.distance);
			if ((pair1 && pair1.distance <= 3) || (pair2 && pair2.distance <= 3))
			{
				//console.log("i'm here");
				var updateGuests = Candidates.find({"host": requests[i]["username"]}).fetch()[0].guests;
				updateGuests.push(Meteor.user().username);
				//console.log(updateGuests);
				//Candidates.update({username: requests[i].username}, {$set: {guests: updateGuests}});
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

		hidden();
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
			Candidates.update({host: myGuests[i]}, {host: myGuests[i], guests: updateguests})
		}
		//alert("You have canceled the request!");
		unhidden();
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
        //alert("You have canceled the request!");
        unhidden();
    }
});




