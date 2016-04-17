//console.log(socket.id);
var messages = [];

$('.chat-form').submit(function () {
    socket.emit('chat message', {room: thisRoom, msg: $('#msg').val()});
    $('#msg').val('');
    return false;
});

socket.on("chat message", function (obj) {
    if (obj.msg !== null) {
        var messageContainer = document.querySelector('.messages');
        var node = document.createElement("li");
        var textnode = document.createTextNode(obj.msg);
        node.appendChild(textnode);
        messageContainer.appendChild(node);

        messages.push(obj.msg);

        if (messages.length == 5) {
            messages.shift();
            messageContainer.removeChild(messageContainer.firstChild);
        }
    }
//$('#messages').append($('<li>').text(msg));
});

socket.on("old messages", function (obj) {
        if (obj.historyMessage !== [] && thisSocket == obj.sid) {
            var messageContainer = document.querySelector('.messages');
            for (var i = 0; i < obj.historyMessage.length; i++) {
                var subNode = document.createElement("li");
                var subText = document.createTextNode(obj.historyMessage[i]);
                subNode.appendChild(subText);
                messageContainer.appendChild(subNode);
            }
            messages = obj.historyMessage;

            if (messages.length == 5) {
                messages.shift();
                messageContainer.removeChild(messageContainer.firstChild);
            }
        }
});
