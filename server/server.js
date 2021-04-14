/**
 * Responsible for communication between the clients and the game
 *
 *
 */
const Game = require('./Game');
const http = require('http');
const readline = require('readline');
const WebSocketServer = require('websocket').server;

const server = http.createServer();

// The lobby listening port (each game will have it's own port)
const listenPORT = 9100;


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
        mps.out++;
        mps.total_out++;
        connection.send(JSON.stringify(m));
    }

    connection.on('message', function (message) {
        mps.in++;
        mps.total_in++;
        const m = JSON.parse(message.utf8Data);

        switch (m.t) {

            case "J"://Join
                m.d.id = generateUIDWithCollisionChecking();
                player = m.d;

                //@todo support joining a specific game

                if (games.length === 0) {
                    games.push(new Game());
                }

                //create references
                player.connection = this;
                player.ip = this.remoteAddress;
                player.game = games[0];
                games[0].players[player.id] = player;

                log('JOINED:' + player.name + ' added to game ' + player.game.id);

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
            case "P"://position report
                if (!games[0]) return;
                if (!games[0].playerCount() > 1) return;
                //Update the player's position in the game
                games[0].players[player.id].x = m.d.x;
                games[0].players[player.id].y = m.d.y;
                games[0].players[player.id].a = m.d.a;

                //Annotate the position update with our playerId
                m.d.playerId = player.id;

                //Tell the other player's about the position
                for (let i in games[0].players) {
                    if (i !== player.id) {
                        //console.log('sending '+player.id+' update to '+i);
                        games[0].players[i].connection.sendJSON(m);
                    }
                }

                break;
            case "L"://List
                //@todo return list of games, including state and count
                connection.sendJSON(games);
                break;
            default:
                log('Unknown Message:' + message.utf8Data);
        }

    });
    connection.on('error', function (e) {
        log(e.toString());

    });
    connection.on('close', function (reasonCode, description) {
        log(player.name + ' has disconnected.');
        //remove player from game
        delete games[0].players[player.id];
        // if (Object.keys(games[0].players).length === 0) {
        //     //no players, no game
        //     delete games[0];
        // }
    });
});


//Status reporting once per second
setInterval(() => {
    console.clear();
    //readline.cursorTo(process.stdout,0,0);
    //console.table(games);

    if (games[0] && games[0].playerCount() > 0) {
        console.log('PLAYERS');
        console.table(games[0].players);
    } else {
        log('No Games or Players yet...waiting for connections...');
    }
    console.log('PERFORMANCE');
    console.table(renderMps());
    writeLog();


}, 1000);

let outputLog = [];
let outputLogStartRow = 16;

/**
 *
 * @param {string} message string
 */
function log(message) {
    const now = new Date();
    const dateString = ("0" + now.getHours()).slice(-2) + ":" +
        ("0" + now.getMinutes()).slice(-2) + ":" +
        ("0" + now.getSeconds()).slice(-2);

    message = "| " + dateString + " - " + message;

    if (outputLog.push(message) > (process.stdout.rows - outputLogStartRow - 1)) {
        outputLog.shift();
    }
}

function writeLog() {
    const left = 0, top = outputLogStartRow;

    readline.cursorTo(process.stdout, left, top);
    process.stdout.write('EVENT LOG');
    outputLog.forEach(function (value, index, array) {
        readline.cursorTo(process.stdout, left, top + index + 1);
        process.stdout.write(value);
    });

}

/**
 * Track the number of messages we process per second
 *
 */
let mps = {in: 0, out: 0, total_in: 0, total_out: 0};
let mpsTime = (new Date()).getTime();

function renderMps() {
    const curTime = (new Date()).getTime();
    const elapsed = (curTime - mpsTime) / 1000;

    const data = {
        'messages total': {
            received: mps.total_in,
            sent: mps.total_out
        },
        '(5 sec avg)m/s': {
            received: Math.floor(mps.in / elapsed),
            sent: Math.floor(mps.out / elapsed)
        },

    };

    if ((new Date()).getTime() - mpsTime > 5000) { //5 second average?
        mps.in = 0;
        mps.out = 0;
        mpsTime = curTime;
    }
    return data;
}


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