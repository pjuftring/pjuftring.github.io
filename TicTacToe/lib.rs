use wasm_bindgen::prelude::*;

//fn main() {
//    for i in 0..9 {
//        println!("{}", winning_move(1 << i, 0b000_000_000).0);
//    }
//}

#[wasm_bindgen]
pub fn strategy(red: u32, blue: u32) -> u32 {
    let (mov, result) = winning_move(red as u16, blue as u16);
    let winformation: u32 = match result {
        End::WIN => 0,
        End::DRAW => 1,
        End::FAIL => 2,
    };
    mov as u32 | (winformation << 8)
}

fn has_won(player: u16) -> bool {
    let winning_moves: [u16; 8] = [
        0b111_000_000,
        0b000_111_000,
        0b000_000_111,
        0b100_100_100,
        0b010_010_010,
        0b001_001_001,
        0b100_010_001,
        0b001_010_100,];
    for &mov in &winning_moves {
        if player & mov == mov {
            return true;
        }
    }
    return false;
}

enum End {
    WIN,
    FAIL,
    DRAW,
}

// assume that the game is not won yet.
fn winning_move(red_: u16, blue_: u16) -> (i8, End) {
    const STACK_SIZE: usize = 32;
    let mut possible_draw: [u16; STACK_SIZE] = [0; STACK_SIZE];
    let mut i: [u16; STACK_SIZE] = [0; STACK_SIZE];
    let mut red: [u16; STACK_SIZE] = [0; STACK_SIZE];
    let mut blue: [u16; STACK_SIZE] = [0; STACK_SIZE];

    let mut pointer: isize = 0;

    red[0] = red_;
    blue[0] = blue_;

    let mut stage: isize = 0;
    let mut retval: (i8, End) = (-1, End::FAIL); // this initial value should never be used

    'main: loop {
        let ptr: usize = pointer as usize % 9;
        if pointer == -1 {
            break;
        }
        if stage == 0 {
            if (red[ptr] | blue[ptr]) == 0b111_111_111 {
                retval = (-1, End::DRAW);
                pointer -= 1;
                stage = 2;
                continue 'main;
            }
            i[ptr] = 0;
            stage = 1;
            continue 'main;
        } else if stage == 1 {
            let new_pos: u16 = 1 << i[ptr];
            if ((red[ptr] | blue[ptr]) & new_pos) != 0 {
                 // position is already taken
                stage = 3;
                continue 'main;
            } else {
                let new_blue = blue[ptr] | new_pos;
                if has_won(new_blue) {
                    retval = (i[ptr] as i8, End::WIN);
                    pointer -= 1;
                    stage = 2;
                    continue 'main;
                }
                possible_draw[ptr + 1] = 0;
                red[ptr + 1] = new_blue;
                blue[ptr + 1] = red[ptr];
                pointer += 1;
                stage = 0;
                continue 'main;
            }
        } else if stage == 2 {
            let new_pos: u16 = 1 << i[ptr];
            match retval {
                (_, End::WIN) => (), // do not consider moves that make the other player win
                (_, End::DRAW) => possible_draw[ptr] |= new_pos,
                (_, End::FAIL) => {
                    retval = (i[ptr] as i8, End::WIN);
                    pointer -= 1;
                    stage = 2;
                    continue 'main;
                },
            }
            stage = 3;
            continue 'main;
        } else if stage == 3 {
            i[ptr] += 1;
            if i[ptr] < 9 {
                // continue with the original "for i in 0..9"-loop
                stage = 1;
                continue 'main;
            } else {
                // we try to draw
                for j in 0..9 {
                    if ((1 << j) & possible_draw[ptr]) != 0 {
                        retval = (j as i8, End::DRAW);
                        pointer -= 1;
                        stage = 2;
                        continue 'main;
                    }
                }
                // no winning move
                retval = (-1, End::FAIL);
                pointer -= 1;
                stage = 2;
                continue 'main;
            }
        }
    }
    return retval;
}

/*
// assume that the game is not won yet.
fn winning_move(red: u16, blue: u16) -> (i8, End) {
    let mut possible_draw: u16 = 0;
    if (red | blue) == 0b111_111_111 {
        return (-1, End::DRAW);
    }
    for i in 0..9 {
        let new_pos: u16 = 1 << i;
        if ((red | blue) & new_pos) != 0 {
            // position is already taken
        } else {
            let new_blue = blue | new_pos;
            if has_won(new_blue) {
                return (i as i8, End::WIN);
            }
            match winning_move(new_blue, red) {
                (_, End::WIN) => (), // do not consider moves that make the other player win
                (_, End::DRAW) => possible_draw |= new_pos,
                (_, End::FAIL) => return (i as i8, End::WIN),
            }
        }
    }
    // we try to draw
    for i in 0..9 {
        if ((1 << i) & possible_draw) != 0 {
            return (i as i8, End::DRAW);
        }
    }
    // no winning move
    return (-1, End::FAIL);
}*/
