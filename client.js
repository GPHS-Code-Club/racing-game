const ws = new WebSocket('ws://localhost:9000/');

ws.GAMEID = 0;
ws.PLAYERID = 0;

ws.onopen = function () {
    console.log('WebSocket Client Connected To Server');
    ws.join();
}

//Main Message Handling
ws.onmessage = function (e) {
    e = JSON.parse(e.data);
    console.log({e: e});
    switch (e.t) {
        case 'JOINED':
            ws.GAMEID = e.d.gid;
            ws.PLAYERID = e.d.pid;
            console.log("Joined Game ID:" + ws.GAMEID + ' as player #'+ws.PLAYERID);
            break;
        default:
            console.log("Received Unknown: '" + e.data + "'");
    }
}

ws.sendPosition = function (car) {
    this.sendJSON({
        type: 'P',//position
        d: {
            x: Math.round(car.x),
            y: Math.round(car.y),
            a: car.alfa,
        }
    });
}

ws.join = function () {
    const name = prompt('Player Name','Guest-'+Math.floor(Math.random() * 10)+1);
    this.sendJSON({type: 'JOIN', data: {name: name, vehicle: 'firetruck'}})
}


ws.sendJSON = function (m) {
    if(ws.readyState !== ws.OPEN ){
        return;
    }
    this.send(JSON.stringify(m));
}

ws.onerror = function (error) {
    alert('CONNECTION FAILED');
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
