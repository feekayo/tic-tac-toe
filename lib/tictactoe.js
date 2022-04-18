class TicTacToe {
  constructor(board) {
    this.board = this.clean(board.toLowerCase()); //clean the game board
    this.token = "o"; //set my gaming token
    this.length = 9;
    this.acceptable = ["o", "x", " "];
    this.twoDArray = [];
    this.play = false;
    this.won = false;
    this.space = " ";
    this.lost = false;

    if (this.check_length() && this.check_characters())
      this.twoDArray = this.convert_to_2DArr();
  }

  clean = (body) => {
    let str = "";

    for (let i = 0; i < body.length; i++) {
      if (body[i] !== "+") str = str + body[i];
      else str = str + " ";
    }

    //console.log(str);
    return str;
  };

  check_length = () => {
    //check length of board
    //compare lengths; if board is of expected value length, return true
    const length = this.board.length;
    //console.log(length, this.board.length);
    if (this.length === length) return true;

    return false; //else return false
  };

  convert_to_2DArr = () => {
    //convert to 2D array to convert O(n) from 9 to 3

    let first = [],
      second = [],
      third = [],
      twoDArray = [];

    for (let i = 0; i < this.length; i++) {
      if (i < 3) first.push(this.board[i]);
      if (i > 2 && i < 6) second.push(this.board[i]);
      if (i > 5) third.push(this.board[i]);
    }

    twoDArray.push(first);
    twoDArray.push(second);
    twoDArray.push(third);

    return twoDArray;
  };

  check_characters = () => {
    //set flag, default to true
    let truth = true;

    //check for special characters inside board
    for (let i = 0; i < this.length; i++) {
      if (this.acceptable.indexOf(this.board[i]) === -1) truth = false;
    }

    return truth;
  };

  check_whose_turn = () => {
    let x = 0,
      o = 0,
      space = 0;

    for (let i = 0; i < this.length; i++) {
      if (this.board[i] === "x") x++; // count number of xs
      if (this.board[i] === "o") o++; // count number of os
      if (this.board[i] === this.space) space++; // count number of spaces
    }

    //console.log("o", o);
    //console.log("x", x);
    //console.log("space", space);

    if (o > x) return false; //if o has played more times, then its definitely not your turn

    return true;
  };

  generate_conditions = (arr) => {
    //console.log(arr);
    const condition1 =
      arr[0] === arr[1] && arr[1] === arr[2] && arr[0] !== this.space; // check for ['o','o','o'] or ['x','x','x']
    const condition2 =
      arr[0] === arr[1] && arr[2] == this.space && arr[0] !== this.space; // check for ['o','o',' '] or ['x','x',' ']
    const condition3 =
      arr[0] === arr[2] && arr[1] == this.space && arr[0] !== this.space; // check for ['o',' ','o'] or ['x',' ',' x']
    const condition4 =
      arr[1] === arr[2] && arr[0] == this.space && arr[2] !== this.space; // check for [' ','o','o'] or [' ','x',' x']

    return { condition1, condition2, condition3, condition4 }; // return conditionals
  };

  get_game_status = () => {
    return {
      won: this.won,
      play: this.play,
      lost: this.lost,
      board: this.twoDArray,
    };
  };

  flip_board = (board) => {
    //return flip board
    return [
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
    ];
  };

  generate_diagonals = (board) => {
    const first_diagonal = [board[0][0], board[1][1], board[2][2]];
    const second_diagonal = [board[2][0], board[1][1], board[0][2]];

    return { first_diagonal, second_diagonal };
  };

  check_diagonal = () => {
    let board = this.twoDArray;
    const { first_diagonal, second_diagonal } = this.generate_diagonals(board);

    const first_conditions = this.generate_conditions(first_diagonal);
    const second_conditions = this.generate_conditions(second_diagonal);

    //check if game has been lost or this.won already
    if (first_conditions.condition1 || second_conditions.condition1)
      if (
        first_diagonal[0] === this.token ||
        second_diagonal[0] === this.token
      ) {
        // if first or second diagonal pattern matches for me already
        this.won = true; // i this.won
      } else if (first_diagonal[0] === "x" || second_diagonal[0] === "x") {
        this.lost = true;
      } // if didn't win

    //check for ['o','o',' '] or ['x','x',' '] on first diagonal
    if (first_conditions.condition2) {
      this.play = true; //play
      board[2][2] = this.token; // block or win
      if (board[1][1] === this.token) this.won = true; // if pattern matches mine, win
    }

    if (second_conditions.condition2) {
      // check for ['o','o',' '] or ['x','x',' '] on second diagonal
      this.play = true; //play
      board[0][2] = this.token; //block or win
      if (board[1][1] === this.token) this.won = true; // if pattern matches mine, win
    }

    // check for ['o',' ','o'] or ['x',' ',' x'] for both diagonals
    if (first_conditions.condition3 || second_conditions.condition3) {
      this.play = true; // play
      board[1][1] = this.token; //block or win
      if (first_conditions.condition3 && board[0][0] === this.token) this.won = true; // check if I win in first diagonal
      if (second_conditions.condition3 && board[2][0] === this.token)
        this.won = true; // check if I win in second diagonal
    }

    // check for [this.space,'o','o'] or [this.space,'x',' x'] on first diagonal
    if (first_conditions.condition4) {
      this.play = true; //play
      board[0][0] = this.token; // block or win
      if (board[1][1] === this.token) this.won = true; // check if i win
    }

    // check for [this.space,'o','o'] or [this.space,'x',' x'] on second diagonal
    if (second_conditions.condition4) {
      this.play = true; // play
      board[2][0] = this.token; // block or win
      if (board[1][1] === this.token) this.won = true; //check if i win
    }

    this.twoDArray = board;
    return board; // return board
  };

  check_horizontal = (board) => {
    //check for horizontal matches
    if (board.length !== 3) return false;

    for (let i = 0; i < 3; i++) {
      let arr = board[i];

      const conditions = this.generate_conditions(arr);
      //console.log(conditions);

      //check if board has already bn this.won or lost
      if (conditions.condition1) {
        if (arr[0] === this.token) this.won = true;
        else if (arr[0] !== this.token) {
          this.lost = true;
        }
      }

      //check for ['o','o',' '] or ['x','x',' ']
      if (conditions.condition2) {
        //console.log("My Lord!");
        //play to win or block
        this.play = true;
        board[i][2] = this.token; // overwrite space
        if (board[i][0] === this.token) this.won = true; // you win
      }

      // check for ['o',' ','o'] or ['x',' ',' x']
      if (conditions.condition3) {
        //play to win or block
        this.play = true;
        board[i][1] = this.token; // overwrite space
        if (board[i][2] === this.token) this.won = true; //you win
      }

      // check for [this.space,'o','o'] or [this.space,'x',' x']
      if (conditions.condition4) {
        //play to win or block
        this.play = true;
        board[i][0] = this.token; // overwrite space
        if (board[i][1] === this.token) this.won = true; //you win
      }

      if (this.play | this.won) break;
    }

    this.twoDArray = board;
    return board;
  };

  check_vertical = () => {
    //console.log("initial", this.twoDArray);
    let board = this.check_horizontal(this.flip_board(this.twoDArray)); //flip board and check horizontally
    ////console.log('original', board);
    board = this.flip_board(board);
    //console.log("flipped", board);
    this.twoDArray = board;
    return board;
  };

  convert_to_string = () => {
    const board = this.twoDArray;
    let str = "";
    let dash = "-";
    for (let i = 0; i < 3; i++) {
      //if (i === 0) dash = "";
      str =
        str +
        "-" +
        this.replace_space(board[i][0]) +
        "-" +
        this.replace_space(board[i][1]) +
        "-" +
        this.replace_space(board[i][2]);
    }
    return str.replace("-", ""); //replace first dash
  };

  replace_space = (item) => {
    if (item === this.space) return "space";
    return item;
  };

  create_horizontal_fork = () => {
    const board = this.twoDArray;

    for (let i = 0; i < 3; i++) {
      const condition1 =
        board[i][0] === this.token &&
        board[i][1] === this.space &&
        board[i][2] === this.space;

      const condition2 =
        board[i][0] === this.space &&
        board[i][1] === this.space &&
        board[i][2] === this.token;

      if (condition1 || condition2) {
        this.play = true;
        if (condition1) this.twoDArray[i][2] = this.token;
        if (condition2) this.twoDArray[i][0] = this.token;
      }

      if (this.play) break;
    }
  };

  //create a vertical fork
  create_vertical_fork = () => {
    this.twoDArray = this.flip_board(this.twoDArray); // flip our board

    this.create_horizontal_fork(); // create an horizontal fork with our flipped table

    this.twoDArray = this.flip_board(this.twoDArray); // unflip our board
  };

  //create a diagonal fork
  create_diagonal_fork = () => {
    const { first_diagonal, second_diagonal } = this.generate_diagonals(
      this.twoDArray
    ); // generate our first and second diagonals

    //['o',' ',' '] first diagonal
    const condition1 =
      first_diagonal[0] === this.token &&
      first_diagonal[1] === this.space &&
      first_diagonal[2] === this.space;
    //[' ',' ','o'] first diagonal
    const condition2 =
      first_diagonal[0] === this.space &&
      first_diagonal[1] === this.space &&
      first_diagonal[2] === this.token;
    //['o',' ',' '] second diagonal
    const condition3 =
      second_diagonal[0] === this.token &&
      second_diagonal[1] === this.space &&
      second_diagonal[2] === this.space;
    //[' ',' ','o'] second diagonal
    const condition4 =
      second_diagonal[0] === this.space &&
      second_diagonal[1] === this.space &&
      second_diagonal[2] === this.token;

    if (condition1) {
      this.play = true;
      // play into the bottom right corner
      return (this.twoDArray[2][2] = this.token);
    }

    if (condition2) {
      this.play = true;
      // play into the top left corner
      return (this.twoDArray[0][0] = this.token);
    }

    if (condition3) {
      this.play = true;
      // play into the top right corner
      return (this.twoDArray[2][0] = this.token);
    }

    if (condition4) {
      this.play = true;
      // play into the bottom left corner
      return (this.twoDArray[0][2] = this.token);
    }
  };

  //play token in the center if center is empty
  create_play_center = () => {
    if (this.twoDArray[1][1] === this.space) {
      this.play = true;

      //play into the center
      this.twoDArray[1][1] = this.token;
    }
  };

  // put our token in the first empty spot
  create_play_first_empty = () => {
    for (let i = 0; i < 3; i++) {
      if (this.play) break;
      for (let j = 0; j < 3; j++) {
        if (this.twoDArray[i][j] === this.space) {
          this.play = true;
          this.twoDArray[i][j] = this.token; // insert into first empty spot
          break;
        }
      }
    }
  };

  play_optimal_move = () => {
    this.check_horizontal(this.twoDArray);

    if (!this.play) this.check_vertical(this.twoDArray);

    if (!this.play) this.check_diagonal(this.twoDArray);

    if (!this.play) this.create_horizontal_fork();

    if (!this.play) this.create_vertical_fork();

    if (!this.play) this.create_diagonal_fork();

    if (!this.play) this.create_play_center();

    if (!this.play) this.create_play_first_empty();

    return this.convert_to_string();
  };
}

module.exports = TicTacToe;
