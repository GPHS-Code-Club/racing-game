// Node.js WebSocket server script
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();

let games = [];

class Game {
    id = Date.now();
    state = 'lobby';
    players = [];
}

server.listen(9898);

const wsServer = new WebSocketServer({
    httpServer: server
});


wsServer.on('request', function (request) {

    const connection = request.accept(null, request.origin);

    connection.on('message', function (message) {

        const m = JSON.parse(message.utf8Data);

        switch (m.type) {

            case "JOIN":
                //@todo support joining a specific game
                console.log('JOINED:' + m.data.name);
                if (games.length === 0) {
                    let newGame = new Game();
                    games.push(newGame);
                }
                games[0].players.push(m.data);
                connection.send(
                    JSON.stringify(
                        {t: 'JOINED', d: {gid: games[0].id}}
                    )
                );

                break;

            case "LIST":
            //@todo return list of games, including state and count

            default:
                console.log('Unknown Message:' + message.utf8Data);
        }

    });
    connection.on('close', function (reasonCode, description) {
        console.log('Client has disconnected.');
    });
});