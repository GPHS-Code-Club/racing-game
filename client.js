let ws;
function multiplayerConnect() {

    const host = prompt('Server (host:port)','localhost:9100');
    ws = new WebSocket('ws://'+host+'/');

    ws.GAMEID = 0;
    ws.PLAYERID = 0;

    ws.onopen = function () {
        console.log('WebSocket Client Connected To Server');
        ws.join();
    }

    //Main Message Handling
    ws.onmessage = function (e) {
        const m = JSON.parse(e.data);
        //console.log({m: m});
        switch (m.t) {
            case 'JOINED':
                ws.GAMEID = m.d.gid;
                ws.PLAYERID = m.d.pid;
                playerCar.PLAYERID = ws.PLAYERID;
                console.log("Joined Game ID:" + ws.GAMEID + ' as player #' + ws.PLAYERID);
                break;
            case 'P'://position update from a remote player
                //create the car if we haven't seen it before
                if (!game.remoteCars.hasOwnProperty(m.d.playerId)){
                    game.remoteCars[m.d.playerId] =new RemoteCar(0,0,0,new Controller());
                }
                game.remoteCars[m.d.playerId].latestPos = m.d;
                break;
            default:
                console.log("Received Unknown: '" + m.data + "'");
        }
    }

    ws.sendPosition = function (car) {
        if (ws.readyState !== ws.OPEN) {
            return;
        }
        this.sendJSON({
            t: 'P',//position
            d: {
                x: Math.round(car.x),
                y: Math.round(car.y),
                a: car.alfa,
            }
        });
    }

    ws.join = function () {
        const name = prompt('Connected, what\'s your name?', 'Guest-' + Math.floor(Math.random() * 10) + 1);
        this.sendJSON({t: 'JOIN', d: {name: name, vehicle: 'firetruck'}})
    }


    ws.sendJSON = function (m) {
        if (ws.readyState !== ws.OPEN) {
            return;
        }
        this.send(JSON.stringify(m));
    }

    ws.onerror = function (error) {
        alert('CONNECTION TO GAME SERVER FAILED\nPlaying Locally Only');
        console.log('WebSocket connection failed:' + error);
        // This means the connection failed.
        console.log(ws.readyState); // 3 - CLOSED (probably from 0)

        ws.onclose = null; //already disconnected, no need to double notify;
    }

    ws.onclose = function () {
        alert('DISCONNECTED');
        console.log('WebSocket connection closed.');
        // This means the connection closed.
        console.log(ws.readyState); // 3 - CLOSED
    }
}