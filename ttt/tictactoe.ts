import init, {strategy} from "./ttt.js";

let REDS = 0;
let BLUES = 0;

let accept: boolean = false;

async function init_ts() {
    await init();
    let arena = document.getElementById('arena');
    if (arena !== null) {
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                let div = document.createElement("div");

                div.setAttribute("class", "box");
                div.setAttribute("onclick", "choose(" + x + ", " + y + ")");

                let div2 = document.createElement("div");

                div2.setAttribute("id", x + "" + y);
                ///div2.setAttribute("class", "red");
                div.appendChild(div2);

                arena.appendChild(div);
            }
        }
    }
    accept = true;
}
function getBlock(x: number, y: number): HTMLElement {
    if (withinBounds(x, y)) {
        let elem = document.getElementById(x + "" + y);
        if (elem === null) {
            throw "This should never happen!";
        } else {
            return elem;
        }
    }
    throw "This should also never happen!";
}

function withinBounds(x: number, y: number): boolean {
    return 0 <= x && x < 3 && 0 <= y && y <= 3;
}

function response() {
    let result = strategy(REDS, BLUES);
    console.log("Result " + result);
    let winning_information = result >> 8;
    if (winning_information === 0) {
        document.getElementById('arena')?.setAttribute("class", "win");
    }
    result &= 0xFF; // Remove information about winning or loosing
    let x = result % 3;
    let y = ((result - x) / 3 % 3); // Additional remainder to eliminate -1
    if (withinBounds(x, y) && state_empty(x, y)) {
        state_set_blue(x, y);
        let elem = getBlock(x, y);
        elem.setAttribute("class", "blue");
    } else {
        console.log("Somehow a faulty step");
    }
    accept = true;
}

function state_empty(x: number, y: number): boolean {
    return ((REDS | BLUES) & (1 << (x + 3*y))) === 0;
}

function state_set_red(x: number, y: number) {
    REDS |= (1 << (x + 3*y));
}

function state_set_blue(x: number, y: number) {
    BLUES |= (1 << (x + 3*y));
}

function choose(x: number, y: number) {
    let elem = getBlock(x, y);
    if (state_empty(x, y) && accept === true) {
        accept = false;
        state_set_red(x, y);
        elem.setAttribute("class", "red");
        setTimeout(response, 1000);
    }
}

(window as any).init = init_ts;
(window as any).choose = choose;