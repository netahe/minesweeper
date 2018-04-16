import {BoardModel} from "./model/board";

const GAMEOVER = Symbol();
const GAMEWON = Symbol();

const NUMBER = Symbol();
const MINE = Symbol();
const EMPTY = Symbol();



// return a random integer in  [0, range)
export function randint(range) {
    return Math.floor(Math.random() * range);
}