const express = require("express");
const router = express.Router();
const Game = require('../lib/tictactoe');

const controller = (req, res) => {
    if (!req.query.board){ return res.status(400).send("board not supplied") }

    const game = new Game(req.query.board);

    if(!game.check_length()) return res.status(400).send("invalid board size");

    if(!game.check_characters()) return res.status(400).send("invalid characters sent");

    if(!game.check_whose_turn()) return res.status(400).send("your turn has passed");

    return res.status(200).send(game.play_optimal_move())
}

router.get('/',controller);
router.post('/',controller);

module.exports = router;