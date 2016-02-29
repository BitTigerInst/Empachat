Template.messages.helpers({
    'msgs': function () {
        var result = ChatRooms.findOne({
            _id: Session.get('roomid')
        });
        if (result) {
            return result.messages;
        }
    
    },
});
