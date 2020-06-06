use wasm_bindgen::prelude::*;
use web_sys::WebGlUniformLocation;

mod drawable;
mod mesh;
mod wasm;

use drawable::Drawable;
use mesh::SimpleMesh;

use nalgebra::{Matrix4, Vector3};

const SUZANNE: &[u8] = include_bytes!("Suzanne.dat");

#[wasm_bindgen]
pub struct App {
    dummy: Drawable,
    camera: WebGlUniformLocation,
    timeu: WebGlUniformLocation,
}

#[wasm_bindgen]
impl App {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        wasm::init_canvas();
        let suzanne = SimpleMesh::new(SUZANNE);
        let dummy = suzanne.map(|mesh| mesh.to_drawable()).flatten().unwrap();
        let camera = dummy.get_uniform_location("camera");
        let timeu = dummy.get_uniform_location("time");
        App {
            dummy,
            camera,
            timeu,
        }
    }

    #[wasm_bindgen]
    pub fn draw_loop(&mut self, time: f64) {
        let time = time as f32;
        let camera_mat =
            Matrix4::new_perspective(16.0 / 9.0, std::f32::consts::PI / 2.0, 1., 1000.)
                * Matrix4::new_translation(&Vector3::new(0., 0., -2.5))
                * Matrix4::new_rotation(Vector3::new(time / 1000., 0., 0.));
        self.dummy.set_uniform_float(&self.timeu, time);
        self.dummy
            .set_uniform_matrix(&self.camera, camera_mat.as_slice());
        self.dummy.draw();
    }
}

impl Default for App {
    fn default() -> Self {
        App::new()
    }
}
