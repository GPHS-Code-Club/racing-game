let ws;

function multiplayerConnect() {
    //Ensure we only have one connection going at a time
    if (ws) {
        $.toast({text:'Closing old connection...',color:'blue',position:'top-left',hideAfter: 4000});
        //Close the old connection
        ws.close();
    }

    let host = window.location.host;
    //Use the url of this server as the default, replace http port :9000 with web socket port :9100
    host = prompt('Server (host:port)', host.substring(0, host.indexOf(':')) + ':9100');

    ws = new WebSocket('ws://' + host + '/');

    ws.GAMEID = 0;
    ws.PLAYERID = 0;

    ws.onopen = function () {
        $.toast({text:'CONNECTED',position:'top-left',hideAfter: 5000});
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
                const notice = "Joined Game ID:" + ws.GAMEID + ' as player #' + ws.PLAYERID;
                console.log(notice);
                $.toast({text:notice,position:'top-left'});
                break;
            case 'P'://position update from a remote player
                //create the car if we haven't seen it before
                if (!game.remoteCars.hasOwnProperty(m.d.playerId)) {
                    game.remoteCars[m.d.playerId] = new RemoteCar(0, 0, 0, new Controller());
                }
                game.remoteCars[m.d.playerId].latestPos = m.d;
                break;
            default:
                console.log("Received Unknown: '" + m.data + "'");
        }
    }

    ws.sendPosition = async function (car) {
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
        const name = prompt('What\'s your name?', 'Guest-' + Math.floor(Math.random() * 10) + 1);
        this.sendJSON({t: 'J', d: {name: name, vehicle: 'firetruck'}})
    }


    ws.sendJSON = function (m) {
        if (ws.readyState !== ws.OPEN) {
            return;
        }
        this.send(JSON.stringify(m));
    }

    ws.onerror = function (error) {
        $.toast({text:'CONNECTION TO GAME SERVER FAILED\nPlaying Locally Only',position:'top-left',color:'red'});
        console.log('WebSocket connection failed:' + error);
        // This means the connection failed.
        console.log(ws.readyState); // 3 - CLOSED (probably from 0)

        ws.onclose = null; //already disconnected, no need to double notify;
    }

    ws.onclose = function () {
        $.toast({
            text: 'Game Server Connection CLOSED',
            showHideTransition: 'slide',
            bgColor: 'blue',
            hideAfter: 2000,

        });
        console.log('WebSocket connection closed.');
        // This means the connection closed.
        console.log(ws.readyState); // 3 - CLOSED
    }
}