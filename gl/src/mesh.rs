use crate::drawable::Drawable;

use crate::wasm::{self, log};

pub struct SimpleMesh {
    vertices: Vec<[f32; 3]>,
    triangles: Vec<[u32; 3]>,
}

fn to_u32_vec(src: &[u8]) -> Vec<u32> {
    src.chunks_exact(4)
        .map(|chunk| u32::from_le_bytes([chunk[0], chunk[1], chunk[2], chunk[3]]))
        .collect()
}

impl SimpleMesh {
    pub fn new(data8: &[u8]) -> Option<SimpleMesh> {
        let data = to_u32_vec(data8);
        let mut iter = data.iter();

        let vert_len = match iter.next() {
            Some(v) => *v as usize,
            None => {
                log("Vertex length is missing.");
                return None;
            }
        };
        let vert_raw: Vec<f32> = iter
            .by_ref()
            .take(vert_len)
            .copied()
            .map(f32::from_bits)
            .collect();
        if vert_raw.len() % 3 != 0 {
            log("Vertex length not divisible by three.");
            return None;
        }
        let vertices: Vec<[f32; 3]> = vert_raw
            .chunks_exact(3)
            .map(|chunk| [chunk[0], chunk[1], chunk[2]])
            .collect();

        let trngl_len = match iter.next() {
            Some(v) => *v as usize,
            None => {
                log("Triangle length is missing.");
                return None;
            }
        };
        let trngl_raw: Vec<u32> = iter.by_ref().take(trngl_len).copied().collect();
        if trngl_raw.len() % 3 != 0 {
            log(&format!("{}", trngl_raw.len()));
            log("Triangle length is not divisible by three.");
            return None;
        }
        let triangles: Vec<[u32; 3]> = trngl_raw
            .chunks_exact(3)
            .map(|chunk| [chunk[0], chunk[1], chunk[2]])
            .collect();

        if iter.next().is_some() {
            log("There is still data after parsing the mesh. Bug?");
            return None;
        }

        let vert_len = vertices.len() as u32;
        for t in &triangles {
            if t[0] >= vert_len || t[1] >= vert_len || t[2] >= vert_len {
                log(&format!("Triangle consists of vertices {}, {}, and {}, but there are only {}-many vertices.", t[0], t[1], t[2], vert_len));
                return None;
            }
        }
        log(&format!(
            "Creates new mesh with {} vertices and {} triangles.",
            vert_len,
            triangles.len()
        ));
        Some(SimpleMesh {
            vertices,
            triangles,
        })
    }

    fn get_vertex_list(&self) -> Vec<f32> {
        let triag_iter = self.triangles.iter();
        triag_iter
            .map(|t| {
                let v1 = self.vertices[t[0] as usize].to_vec();
                let v2 = self.vertices[t[1] as usize].to_vec();
                let v3 = self.vertices[t[2] as usize].to_vec();
                vec![v1, v2, v3].into_iter().flatten().collect::<Vec<f32>>()
            })
            .flatten()
            .collect()
    }

    fn get_normal_list(&self) -> Vec<f32> {
        let triag_iter = self.triangles.iter();
        triag_iter
            .map(|t| {
                let v1 = self.vertices[t[0] as usize];
                let v2 = self.vertices[t[1] as usize];
                let v3 = self.vertices[t[2] as usize];
                let a = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
                let b = [v3[0] - v2[0], v3[1] - v2[1], v3[2] - v2[2]];
                let normal = [
                    a[1] * b[2] - a[2] * b[1],
                    a[2] * b[0] - a[0] * b[2],
                    a[0] * b[1] - a[1] * b[0],
                ];
                vec![&normal, &normal, &normal]
                    .into_iter()
                    .flatten()
                    .copied()
                    .collect::<Vec<f32>>()
            })
            .flatten()
            .collect()
    }

    pub fn to_drawable(&self) -> Option<Drawable> {
        let vertices: Vec<f32> = self.get_vertex_list();
        let normals: Vec<f32> = self.get_normal_list();
        let vert_buf = wasm::array_buffer_from_f32_array(&vertices);
        let nrml_buf = wasm::array_buffer_from_f32_array(&normals);
        let vert_len = (vertices.len() / 3) as u16;

        let vert_src = include_str!("glsl/simple.vert");
        let frag_src = include_str!("glsl/simple.frag");
        let program = wasm::create_program_from_sources(vert_src, frag_src);
        Some(Drawable::new(vert_buf, nrml_buf, vert_len, program))
    }
}
