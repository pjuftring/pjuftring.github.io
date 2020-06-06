use crate::wasm;
use web_sys::{WebGlBuffer, WebGlProgram, WebGlUniformLocation};

pub struct Drawable {
    vertices: WebGlBuffer,
    normals: WebGlBuffer,
    vert_len: u16,
    program: WebGlProgram,
}

impl Drawable {
    pub fn new(
        vertices: WebGlBuffer,
        normals: WebGlBuffer,
        vert_len: u16,
        program: WebGlProgram,
    ) -> Drawable {
        Drawable {
            vertices,
            normals,
            vert_len,
            program,
        }
    }

    pub fn draw(&self) {
        wasm::draw(&self.vertices, &self.normals, self.vert_len, &self.program);
    }

    pub fn get_uniform_location(&self, name: &str) -> WebGlUniformLocation {
        wasm::get_uniform_location(&self.program, name)
    }

    pub fn set_uniform_matrix(&self, loc: &WebGlUniformLocation, data: &[f32]) {
        wasm::set_uniform_matrix(&self.program, loc, data);
    }

    pub fn set_uniform_float(&self, loc: &WebGlUniformLocation, data: f32) {
        wasm::set_uniform_float(&self.program, loc, data);
    }
}
