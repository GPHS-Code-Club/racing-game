module.exports = class Player {
    connection;

    position = {x: 0, y: 0, a: 0};

    /**
     * The Player's Name
     * @type {string}
     */
    name;

    /**
     * The Vehicle Type
     * @todo expand to class?
     * @type {string}
     */
    vehicle;

    /**
     * Unique Id in the game
     * @type {string}
     */
    id;

    /**
     * A reference to the game that the player is currently in
     * @type {Game}
     */
    game;

}