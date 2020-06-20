var board = null
var game = new Chess()
var $status
var $fen
var $pgn

jQuery(function($) {
  $status = $('#status')
  $fen = $('#fen')
  $pgn = $('#pgn')

  var config = {
    // orientation: 'black',
    // position: 'start',
    // draggable: true,
    // moveSpeed: 'slow',
    // snapbackSpeed: 500,
    // snapSpeed: 100,
    // onDragStart: onDragStart,
    // onDrop: onDrop,
    // onSnapEnd: onSnapEnd
  }
  board = Chessboard('board', config);
  $(window).resize(board.resize);
  window.setTimeout(makeRandomMove, 500);
});

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen())
}

function updateStatus() {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game Over ! ' + moveColor + ' is in Checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game Over, Drawn Position.'
  }

  // game still on
  else {
    status = moveColor + ' to Move !'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in Check !'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}

function makeRandomMove() {
  var possibleMoves = game.moves()

  // exit if the game is over
  if (game.game_over()) return

  var randomIdx = Math.floor(Math.random() * possibleMoves.length)
  game.move(possibleMoves[randomIdx])
  board.position(game.fen())
  updateStatus()

  window.setTimeout(makeRandomMove, 500)
}