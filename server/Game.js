/**
 *
 * @type {Game}
 */
module.exports = class Game {
    /**
     * Server incremental functional goals
     * 1. web server for game and assets
     * 2. basic state management via sockets - allow all players to see each other
     * 3. game management - game starts/ends, join, exit
     * 4. cheating detection?
     **/

    id = Date.now();
    name = 'Game - ' + this.id;
    description = '';
    state = 'lobby';
    players = [];
}