function base64(data) {
    const dec = new TextDecoder('utf-16');
    const raw = btoa(dec.decode(new Uint16Array(data)));
    return 'data:image/webp;base64,' + raw;
}
export function set_background(data) {
    document.getElementById('background').style.backgroundImage = 'url(' + base64(data) + ')';
}
export function new_image(data) {
    const img = new Image();
    img.src = base64(data);
    return img;
}

export function get_text_width(ctx, txt) {
    return ctx.measureText(txt).width;
}
