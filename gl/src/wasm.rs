use wasm_bindgen::prelude::*;
use web_sys::{WebGlBuffer, WebGlProgram, WebGlUniformLocation};

#[wasm_bindgen(module = "/src/helper.js")]
extern "C" {
    pub fn init_canvas();
    pub fn gl_clear_color(red: f32, green: f32, blue: f32, alpha: f32);
    pub fn gl_clear(mask: u32);
    pub fn array_buffer_from_f32_array(data: &[f32]) -> WebGlBuffer;
    pub fn delete_buffer(buffer: WebGlBuffer);
    pub fn create_program_from_sources(vert_src: &str, frag_src: &str) -> WebGlProgram;
    pub fn get_uniform_location(prog: &WebGlProgram, name: &str) -> WebGlUniformLocation;
    pub fn set_uniform_matrix(prog: &WebGlProgram, location: &WebGlUniformLocation, data: &[f32]);
    pub fn set_uniform_float(prog: &WebGlProgram, location: &WebGlUniformLocation, data: f32);
    pub fn log(text: &str);
    pub fn draw(
        vertices: &WebGlBuffer,
        normals: &WebGlBuffer,
        vert_len: u16,
        program: &WebGlProgram,
    );
}
