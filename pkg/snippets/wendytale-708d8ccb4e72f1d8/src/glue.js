export function set_background(src) {
    document.getElementById('background').style.backgroundImage = 'url(' + src + ')';
}

export function get_text_width(ctx, txt) {
    return ctx.measureText(txt).width;
}