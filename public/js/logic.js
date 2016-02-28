//console.log(socket.id);
$('form').submit(function () {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});
socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});

//document.querySelector('.chat').style.marginLeft = $(window).width() - 300 + "px";


