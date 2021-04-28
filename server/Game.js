/**
 * Holds the state for a single game
 *
 * @Todo Future Improvements
 * 1. basic state management via sockets - allow all players to see each other
 * 2. game management - game starts/ends, join, exit
 * 3. cheating detection?
 *
 * @type {Game}
 */
const EventEmitter = require('events');

module.exports = class Game extends EventEmitter {
    id = Date.now();
    name = 'Game - ' + this.id;
    description = 'No description Provided';
    /**
     * The state of the game.
     *
     * 'lobby' - When a game is first created it enters the 'lobby' state.
     * 'full' - When a game lobby is full
     * 'starting' - When all players have indicated ready the game enters the 'starting' state, no players may join
     * 'started' - When the countdown finishes the game enters the 'started' state.
     * 'finishing' - When the first player crosses the finish line, the game enters the 'finish' state.
     * 'finished' - When all players have crossed the finish line or time limit has expired, the game enters the 'finished' state.
     * @type {string}
     */
    state = 'lobby'; //lobby, full, starting, started, finishing, finished
    /**
     * The rules engine for this game
     * @type {string}
     */
    type = 'lap';

    minPlayers = 1;
    maxPlayers = 5;

    /**
     * First player is in control of the game
     *
     * @type {Player[]}
     */
    players = [];



    constructor() {
        super();

        this.on('lobby', function () {
            this.state = 'lobby';
        });

        this.on('full', function () {
            this.state = 'full';
            //@todo test/evaluate for race condition where lots of people join all at once...allow overfill, set full, kick overfill entries
            this.emit('starting');
        });
    }


    /**
     *
     * @param player Player
     */
    join(player) {
        //Can't join if we're already full
        if (this.playerCount() >= this.maxPlayers) {
            if (this.state !== 'full') this.emit('full');
            return false;
        }

        //Can't join if we're not in the lobby
        if (this.state !== 'lobby') {
            return false;
        }

        //don't exceed max players
        if (this.playerCount() < this.maxPlayers) {
            player.number=this.playerCount()+1;
            this.players[player.id] = player;
            return true;
        }else{
            if (this.state !== 'full') this.emit('full');
            return false;
        }
    }

    playerCount() {
        //@todo cache this answer in a property with get/set so we don't have to keep calculating?
        return Object.keys(this.players).length;
    }

    toString() {
        return this.name;
    }


}