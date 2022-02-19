import init, {Game} from './pkg/wendytale.js';

async function run() {
    await init();
    
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const game = new Game(ctx);

    function keydown(e) {
        game.keydown(e.key.charCodeAt(0));
    }
    function keyup(e) {
        game.keyup(e.key.charCodeAt(0));
    }
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);   
    function game_step(time) {
        game.step(time);
        window.requestAnimationFrame(game_step);
    }
    window.requestAnimationFrame(game_step);
}

run();