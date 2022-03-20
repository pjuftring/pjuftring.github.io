import init, {game_start, game_step, game_keydown, game_keyup} from './pkg/wendytale.js';

async function run() {
    const font = new FontFace('determination', 'url(assets/determination.woff)');
    await font.load();
    await init();

    document.fonts.add(font);
    await document.fonts.ready;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '10px "determination"';

    game_start(ctx);

    function keydown(e) {
        if (e.key.length != 1) {
            return;
        }
        game_keydown(e.key.charCodeAt(0));
    }
    function keyup(e) {
        if (e.key.length != 1) {
            return;
        }
        game_keyup(e.key.charCodeAt(0));
    }
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);   
    function game_step_js(time) {
        game_step(ctx, time);
        window.requestAnimationFrame(game_step_js);
    }
    window.requestAnimationFrame(game_step_js);
}

run();
