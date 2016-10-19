angular.module("magiciansBattle").controller("chatCtrl", function ($scope) {
});

var websocket = WS.connect("ws://127.0.0.1:8080");

websocket.on("socket/connect", function(session){
    //the callback function in "subscribe" is called everytime an event is published in that channel.
    session.subscribe("chat/channel", function(uri, payload){
        console.log("Received message", payload.msg);
    });

    session.publish("chat/channel", "This is a message!");
});