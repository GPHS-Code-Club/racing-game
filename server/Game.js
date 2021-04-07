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
module.exports = class Game {
    id = Date.now();
    name = 'Game - ' + this.id;
    description = '';
    state = 'lobby';
    /**
     *
     * @type {Player[]}
     */
    players = [];
}