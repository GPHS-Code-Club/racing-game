const ws = new WebSocket('ws://localhost:9898/');

ws.GAMEID = 0;

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
            console.log("Joined Game ID:" + ws.GAMEID);
            break;
        default:
            console.log("Received Unknown: '" + e.data + "'");
    }
}

ws.sendPosition = function (car) {
    this.sendJSON({
        type: 'POSITION',
        data: {
            x: car.x,
            y: car.y
        }
    });
}

ws.join = function () {
    this.sendJSON({type: 'JOIN', data: {name: 'Joel', vehicle: 'firetruck'}})
}


ws.sendJSON = function (m) {
    this.send(JSON.stringify(m));
}

ws.onerror = function (error) {
    alert('DISCONNECTED: ERROR');
    console.log('WebSocket connection failed:' + error);
    // This means the connection failed.
    console.log(ws.readyState); // 3 - CLOSED (probably from 0)
}

ws.onclose = function () {
    alert('DISCONNECTED');
    console.log('WebSocket connection closed.');
    // This means the connection closed.
    console.log(ws.readyState); // 3 - CLOSED
}
