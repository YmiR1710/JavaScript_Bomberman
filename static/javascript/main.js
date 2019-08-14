let game_lost = false;
let slider = false;
let enemy_speed = 500;

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const generate_field = () => {
    for(let i = 0; i<13; i++){
        for(let j = 0; j<13; j++){
            let block = document.createElement("section");
            block.className = "floor";
            getRandomInt(4) === 0 ? block.className = "brick" : {};
            i === 0 || j===0 || i === 12 || j === 12 ? block.className = "wall" : {};
            i%2 === 0 && j%2 ===0 ? block.className = "wall" : {};
            document.getElementsByClassName("game-field")[0].appendChild(block);
        }
    }
    document.getElementsByClassName("floor")[getRandomInt(document.getElementsByClassName("floor").length)].className = "player";
    for(let i = 0; i<3; i++){
        document.getElementsByClassName("floor")[getRandomInt(document.getElementsByClassName("floor").length)].className = "enemy";
    }
};

const get_game_field = () => {
    let game_field = [];
    let q = 0;
    for(let i = 0; i<13; i++){
        let row = [];
        for(let j = 0; j<13; j++){
            row.push(document.getElementsByClassName("game-field")[0].children[q]);
            q++;
        }
        game_field.push(row);
    }
    return game_field;
};

const getCoordinates = (block) => {
    let game_field = get_game_field();
    for(let i = 0; i<13; i++){
        for(let j = 0; j<13; j++){
            if(block === game_field[i][j]){
                return [i, j];
            }
        }
    }
};

const moveUP = (block) => {
    let coordiantes = getCoordinates(block);
    let game_field = get_game_field();
    if(game_field[coordiantes[0]-1][coordiantes[1]].className === "floor"){
        game_field[coordiantes[0]-1][coordiantes[1]].className = block.className;
        block.className = "floor";
    }
    game_field[coordiantes[0]-1][coordiantes[1]].className === "enemy" && block.className === "player" ? game_lost = true : {};
    game_field[coordiantes[0]-1][coordiantes[1]].className === "player" && block.className === "enemy" ? game_lost = true : {};
};

const moveDown = (block) => {
    let coordiantes = getCoordinates(block);
    let game_field = get_game_field();
    if(game_field[coordiantes[0]+1][coordiantes[1]].className === "floor"){
        game_field[coordiantes[0]+1][coordiantes[1]].className = block.className;
        block.className = "floor";
    }
    game_field[coordiantes[0]+1][coordiantes[1]].className === "enemy" && block.className === "player" ? game_lost = true : {};
    game_field[coordiantes[0]+1][coordiantes[1]].className === "player" && block.className === "enemy" ? game_lost = true : {};
};

const moveRight = (block) => {
    let coordiantes = getCoordinates(block);
    let game_field = get_game_field();
    if(game_field[coordiantes[0]][coordiantes[1]+1].className === "floor"){
        game_field[coordiantes[0]][coordiantes[1]+1].className = block.className;
        block.className = "floor";
    }
    game_field[coordiantes[0]][coordiantes[1]+1].className === "enemy" && block.className === "player" ? game_lost = true : {};
    game_field[coordiantes[0]][coordiantes[1]+1].className === "player" && block.className === "enemy" ? game_lost = true : {};
};

const moveLeft = (block) => {
    let coordinates = getCoordinates(block);
    let game_field = get_game_field();
    if(game_field[coordinates[0]][coordinates[1]-1].className === "floor"){
        game_field[coordinates[0]][coordinates[1]-1].className = block.className;
        block.className = "floor";
    }
    game_field[coordinates[0]][coordinates[1]-1].className === "enemy" && block.className === "player" ? game_lost = true : {};
    game_field[coordinates[0]][coordinates[1]-1].className === "player" && block.className === "enemy" ? game_lost = true : {};
};

const explode_bomb = (bomb) => {
    const block_destruction = (block) => {
        block.className === "brick"||block.className === "enemy" ? block.className = "floor" :
            block.className === "player" ? game_lost = true : {};
    };
    let game_field = get_game_field();
    let coordinates = getCoordinates(bomb);
    block_destruction(game_field[coordinates[0]][coordinates[1]]);
    block_destruction(game_field[coordinates[0]-1][coordinates[1]]);
    block_destruction(game_field[coordinates[0]+1][coordinates[1]]);
    block_destruction(game_field[coordinates[0]][coordinates[1]-1]);
    block_destruction(game_field[coordinates[0]][coordinates[1]+1]);
    game_field[coordinates[0]][coordinates[1]].removeAttribute("id");
};

const check_win = () => document.getElementsByClassName("enemy").length === 0
    && document.getElementsByClassName("brick").length === 0;

const random_move = () => {
    let enemies = document.getElementsByClassName("enemy");
    for (let i = 0; i<enemies.length; i++){
        let move = getRandomInt(4);
        move === 0 ? moveUP(enemies[i]) :
            move === 1 ? moveDown(enemies[i]) :
                move === 2 ? moveLeft(enemies[i]) :
                    moveRight(enemies[i]);
    }
};

document.addEventListener("keydown", (event) => {
    if (!slider) {
        event.which === 68 ? moveRight(document.getElementsByClassName("player")[0]) :
            event.which === 65 ? moveLeft(document.getElementsByClassName("player")[0]) :
                event.which === 87 ? moveUP(document.getElementsByClassName("player")[0]) :
                    event.which === 83 ? moveDown(document.getElementsByClassName("player")[0]) : {}
        }
    }
);

document.addEventListener("click", () => {
    if (!slider) {
        let coordinates = getCoordinates(document.getElementsByClassName("player")[0]);
        get_game_field()[coordinates[0]][coordinates[1]].id = "bomb";
        setTimeout(() => explode_bomb(get_game_field()[coordinates[0]][coordinates[1]]), 2000)
    }
});

const continuous_move = () => {
    random_move();
    enemy_speed = (100 - document.getElementsByClassName("speed-slider")[0].value) * 10;
    console.log(enemy_speed);
    setTimeout(continuous_move, enemy_speed);
};

window.onload = () => {
    generate_field();
    const start = new Date().getTime();
    document.getElementsByClassName("speed-slider")[0].onmouseenter = () => slider = true;
    document.getElementsByClassName("speed-slider")[0].onmouseleave = () => slider = false;
    setInterval(()=>{game_lost ? window.location.reload() : {}}, 50);
    setInterval(() => {if(check_win())
    {alert("Your result: " + ((new Date().getTime() - start)/1000).toString() + " seconds");
    window.location.reload();}
    }, 300);
    setTimeout(continuous_move, enemy_speed);
};
