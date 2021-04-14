racing-game
===========

2D racing game written in JavaScript with a html/canvas frontend and Node.js backend.

## Getting Started
1. Make sure you have [node.js](https://nodejs.org/en/download/) installed and that these commands work.
````   
    node -v
    npm -v
````
2. Clone this repository
3. In the main folder run
````
    npm install
````
4. Start the web and game server
````
    ./start.sh
````
or directly run these two commands
````
    http-server -p 9000 -s
    node server/server.js
````
5. Go to http://localhost:9000 to play.

### Todo
1. Synchronized start of game 
1. Synchronized end of game (1st, 2nd, 3rd place)
1. Position all cars at start
1. Show names and appropriate vehicle for remote cars
1. Improved Lobby
    1. Create a game
    2. Join a game from a list or code
        3. Enter Name, Pick Vehicle
    


You can see the latest version in action <a href="https://gphs-code-club.github.io/racing-game/" target="_blank">here</a>.
Or you can try <a href="http://urosh.net/race/v1.0/" target="_blank">v1.0</a>.
