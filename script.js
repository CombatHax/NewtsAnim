const cnv = document.getElementById('cnv');
const ctx = cnv.getContext('2d');
let c1 = [60, 520];
let c2 = [20, 540];
let frame = 0;
let backOff = [0, 2];
const inRange = (num, range) => {
    console.log(`Num: ${num} Res: ${range[0] <= num < range[1]}`)
    return range[0] < num < range[1];
}
class Key {
    static frames = [0, 0];
    constructor(range, motion, num, back, audio) {
        if(back != undefined) {
            backOff[0] += back[0];
            backOff[1] += back[1];
        }
        this.audio = audio;
        this.range = range;
        this.cubeNum = num;
        this.done = false;
        if(this.cubeNum) {
            this.cube = c2;
        } else {
            this.cube = c1;
        }
        this.motion = motion;
        let diff = range[1] - range[0];
        Key.frames[num] += diff;
        this.interval = [(motion[0] - this.cube[0]) / diff, (motion[1] - this.cube[1]) / diff]
    }
    run() {
        if(this.check()) {
            this.cube[0] += this.interval[0];
            this.cube[1] += this.interval[1];
        }
    }
    check() {
        const bool = [this.range[0] < frame, frame <= this.range[1]];
        if(this.range[0] == frame) {
            let diff = this.range[1] - this.range[0];
            console.log(this.audio);
            if(this.audio != undefined) {
                new Audio(`line${this.audio}`).play();
            }
            this.interval = [(this.motion[0] - this.cube[0]) / diff, (this.motion[1] - this.cube[1]) / diff]
        }
        return bool[0] && bool[1];
    }
}
const Cube = {
    Red: 0,
    Blue: 1
}
const g = (dur, wait, pos, cube, audio, back) => {
    let start = frame + wait;
    let end = start + dur;
    let frames = Key.frames[cube];
    console.log(audio);
    return new Key([start + wait + frames, end + wait + frames], pos, cube, back, audio);
}
ctx.font = "Comic Sans MS";
ctx.textBaseline = "middle";
let sound = 0;
const audios = [

]


const keys = [
    g(60, 0, [0, 0], Cube.Red, 0),
    g(60, 0, [0, 0], Cube.Blue)
];


const Backgrounds = {
    Tiles: 0,
    Cliff: 1
}
const background = Backgrounds.Cliff;
let run = false;
const draw = () => {
    run = true;
    for(key of keys) {
        if(key != null) {
            key.run();
        }
    }
    console.log(c1);
    ctx.clearRect(0, 0, cnv.clientWidth, cnv.clientHeight);
    ctx.fillStyle = "#404040";
    ctx.fillRect(0, 0, cnv.clientWidth, cnv.clientHeight)
    switch(background) {
        case Backgrounds.Tiles:
            let ind = 0;
            for(let x = -100; x <= cnv.clientWidth + 100; x += 10) {
                for(let y = -100; y <= cnv.clientHeight + 100; y += 10) {
                    ctx.fillStyle = ind % 2 ? "	#808080" : "#aaa";
                    ctx.fillRect(x + backOff[0] % 100, y + backOff[1] % 100, 10, 10);
                    ind++;
                }
            }
            break;
        case Backgrounds.Cliff:
            ctx.fillStyle = "#783101";
            ctx.fillRect(0, 400, 300, 200);
    }
    ctx.fillStyle = "#f00";
    ctx.fillRect(c1[0], c1[1], 40, 40);
    ctx.fillStyle = "#00f";
    ctx.fillRect(c2[0], c2[1], 20, 20);
    frame++;
}
window.addEventListener("mousedown", () => {
    if(!run) setInterval(draw, 1000 / 60)
});