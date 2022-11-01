const cnv = document.getElementById('cnv');
const ctx = cnv.getContext('2d');
let c1 = [0, 540];
let c2 = [0, 300];
let frame = 0;
class Key {
    static plans = []
    constructor(range, motion, num) {
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
        this.interval = [(motion[0] - this.cube[0]) / diff, (motion[1] - this.cube[1]) / diff]
        Key.plans.push(this)
    }
    run() {
        if(this.check()) {
            this.cube[0] += this.interval[0];
            this.cube[1] += this.interval[1];
        }
    }
    check() {
        const bool = this.range[0] < frame && frame <= this.range[1];
        if(frame > this.range[1]) {
            this.done = true;
        }
        return bool;
    }
    reschedule(range) {
        console.log("Rescheduled");
        console.log(this);
        this.range = range;
        let diff = range[1] - range[0]
        this.interval = [(this.motion[0] - this.cube[0]) / diff,
            (this.motion[1] - this.cube[1]) / diff]
    }
}
function inRange(num, range) {
    console.log(`Num: ${num} Res: ${range[0] <= num < range[1]}`)
    return range[0] < num < range[1];
}
const g = (dur, wait, pos, cube) => {
    let start = frame + wait;
    let end = start + dur;
    for(plan of Key.plans) {
        if(plan.cubeNum == cube) {
            if(inRange(start, plan.range)) {
                console.log("Start time is the same");
                let range = plan.range;
                plan.reschedule([range[0], start])
                return null;
            } else {
                if(inRange(end, plan[1])) {
                    console.log("Here");
                    return null;
                }
            }
        }
    }
    return new Key([start + wait, end + wait], pos, cube);
}

const keys = [
    new Key([0, 120], [300, 300], 0),
    g(60, 0, [25, 25], 0)
];
let backOff = [0, 0]
const background = 0;
const draw = () => {
    for(key of keys) {
        if(key != null) {
            key.run();
        }
    }
    ctx.clearRect(0, 0, cnv.clientWidth, cnv.clientHeight);
    switch(background) {
        case 0:
            let ind = 0;
            for(let x = -100; x <= cnv.clientWidth + 100; x += 10) {
                for(let y = -100; y <= cnv.clientHeight + 100; y += 10) {
                    ctx.fillStyle = ind % 2 ? "grey" : "#aaa";
                    ctx.fillRect(x, y, 10, 10);
                    ind++;
                }
            }
            break;
    }
    ctx.fillStyle = "#f00";
    ctx.fillRect(c1[0], c1[1], 40, 40);
    ctx.fillStyle = "#00f";
    ctx.fillRect(c2[0], c2[1], 40, 40);
    frame++;
}
setInterval(draw, 1000/60);