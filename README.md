Implementation of minesweeper for Wix.

Some notes
==========
Tests
-----

1. If I uploaded everything correctly, you should be able to run the tests by typing `npm test`

2. The tests cover mostly the game model, I'm still not 100% sure I know how to test React components.

Requirements
----------------------
1. One major change to the specification you gave me is that you can win a game without flagging anything, as long as you
exposed all cells not containing mines. You can win a game using flags, so the original requirement is still satisfied. I've added
that option mostly because it's easier for me to play, and this is how it works in most Minesweeper implementations.

2. Unlike in the working example, flagging more cells then there are mines raise a warning, rather then an error, to let the user amend the situation.
In any case, the user can't win a game if they over-used their flags.

3. I couldn't satisfy the requirment to render 300 x 300 board, see: conversation with Itai.

4. Otherwise, I believe I've satisfied all of the requirements.