/**
 * Responsible for communication between the clients and the game
 */
const Game = require('./Game');
const http = require('http');
const WebSocketServer = require('websocket').server;

const server = http.createServer();

// The lobby listening port (each game will have it's own port)
const listenPORT = 9000;

/**
 * Actively Managed Games
 * @type {Game[]}
 */
let games = [];

//
server.listen(listenPORT);

const wsServer = new WebSocketServer({
    httpServer: server
});


wsServer.on('request', function (request) {
    //Player Context
    let player;
    const connection = request.accept(null, request.origin);
    connection.sendJSON = function (m) {
        connection.send(JSON.stringify(m));
    }

    connection.on('message', function (message) {

        const m = JSON.parse(message.utf8Data);

        switch (m.type) {

            case "JOIN":
                m.data.id = generateUIDWithCollisionChecking();
                player = m.data;

                //@todo support joining a specific game

                if (games.length === 0) {
                    games.push(new Game());
                }

                //set up references between player and game
                player.game = games[0];
                games[0].players[player.id] = player;


                console.log('JOINED:' + player.name + ' added to game ' + player.game.id);

                connection.sendJSON(
                    {
                        t: 'JOINED',
                        d: {
                            gid: games[0].id,
                            pid: player.id
                        }
                    }
                );

                break;
            case "P"://position
                games[0].players[player.id].x = m.d.x;
                games[0].players[player.id].y = m.d.y;
                games[0].players[player.id].a = m.d.a;
                break;
            case "LIST":
                //@todo return list of games, including state and count
                connection.sendJSON(games);
                break;
            default:
                console.log('Unknown Message:' + message.utf8Data);
        }

    });
    connection.on('close', function (reasonCode, description) {
        console.log(player.name + ' has disconnected.');
        games[0].players[player.id] = null;
    });
});

setInterval(() => {
    //console.table(games);
    if (games.length >= 1) {
        console.table(games[0].players);
    }
}, 1000);

let _generatedUIDs = {};

function generateUIDWithCollisionChecking() {
    while (true) {
        let uid = ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4);
        if (!_generatedUIDs.hasOwnProperty(uid)) {
            _generatedUIDs[uid] = true;
            return uid;
        }
    }
}