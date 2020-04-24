let canvas;
let ctx;

let horizSquares; 
let vertSquares;

let blurAmount;

let speed = 100;

let time = Date.now() / 1000;

let ampl1Slider;
let wavelen1Slider;
let shift1Slider;

let ampl2Slider;
let wavelen2Slider;
let shift2Slider;

let squareSlider;
let blurSlider;

let amplMatch;
let lenMatch;
let shiftMatch;

function distance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2)
                     + Math.pow(pos1.y - pos2.y, 2));
}

function Sound() {
    this.x;
    this.y;

    this.ampl;
    this.freq;

    this._wavelen;
    this.getWavelen = () => this._wavelen;
    this.setWavelen = (value) => {
        this._wavelen = value;
        this.freq = speed / this._wavelen;
    }
    
    this.shift;

    this.pressure = (pos) => {
        let dist = distance(this, pos);

        return this.ampl * Math.sin(this.shift
            + 2 * Math.PI * (dist / this.getWavelen() - time * this.freq));
    }
}

let sound1;
let sound2;

function setupTopSliders() {
    let ampl1Change = () => {
        sound1.ampl = Number.parseFloat(ampl1Slider.value);
        if (amplMatch.checked) {
            sound2.ampl = sound1.ampl;
            ampl2Slider.value = sound1.ampl;
        }
    }
    ampl1Change();
    ampl1Slider.addEventListener("input", ampl1Change);

    let wavelen1Change = () => {
        sound1.setWavelen(Number.parseFloat(wavelen1Slider.value));
        if (lenMatch.checked) {
            sound2.setWavelen(sound1.getWavelen());
            wavelen2Slider.value = sound1.getWavelen();
        }
    }
    wavelen1Change();
    wavelen1Slider.addEventListener("change", wavelen1Change);

    let shift1Change = () => {
        sound1.shift = Number.parseFloat(shift1Slider.value);
        if (shiftMatch.checked) {
            sound2.shift = sound1.shift;
            shift2Slider.value = sound1.shift;
        }
    }
    shift1Change();
    shift1Slider.addEventListener("input", shift1Change);
}

function setupBottomSliders() {
    let ampl2Change = () => {
        sound2.ampl = Number.parseFloat(ampl2Slider.value);
        if (amplMatch.checked) {
            sound1.ampl = sound2.ampl;
            ampl1Slider.value = sound2.ampl;
        }
    }
    ampl2Change();
    ampl2Slider.addEventListener("input", ampl2Change);

    let wavelen2Change = () => {
        sound2.setWavelen(Number.parseFloat(wavelen2Slider.value));
        if (lenMatch.checked) {
            sound1.setWavelen(sound2.getWavelen());
            wavelen1Slider.value = sound2.getWavelen();
        }
    }
    wavelen2Change();
    wavelen2Slider.addEventListener("change", wavelen2Change);

    let shift2Change = () => {
        sound2.shift = Number.parseFloat(shift2Slider.value);
        if (shiftMatch.checked) {
            sound1.shift = sound2.shift;
            shift1Slider.value = sound2.shift;
        }
    }
    shift2Change();
    shift2Slider.addEventListener("input", shift2Change);
}

function setupSettingsSliders() {
    let distSlider = document.getElementById("distance");
    let distChange = () => {
        let v = Number.parseFloat(distSlider.value);
        sound1.y = (1 - v) / 2 * canvas.height;
        sound2.y = canvas.height - (1 - v) / 2 * canvas.height;
    }
    distChange();
    distSlider.addEventListener("input", distChange);

    let speedSlider = document.getElementById("speed");
    let speedChange = () => {
        speed = Number.parseFloat(speedSlider.value)

        sound1.freq = speed / sound1.getWavelen();
        sound2.freq = speed / sound2.getWavelen();
    }
    speedChange();
    speedSlider.addEventListener("change", speedChange);
}

function setupSliders() {
    setupSettingsSliders();
    setupBottomSliders();
    setupTopSliders();

    let squareChange = () => {
        updateSquareCounts(Number.parseInt(squareSlider.value));
    }
    squareChange();
    squareSlider.addEventListener("input", squareChange);

    let blurChange = () => {
        blurAmount = Number.parseInt(blurSlider.value);
    }
    blurChange();
    blurSlider.addEventListener("input", blurChange);
}

function setupCheckBoxes() {
    
    let amplLockChange = () => {
        if (amplMatch.checked) {
            sound2.ampl = sound1.ampl;
            ampl2Slider.value = ampl1Slider.value;
        }
    }
    amplLockChange();
    amplMatch.addEventListener("click", amplLockChange);

    let lenLockChange = () => {
        if (lenMatch.checked) {
            sound2.setWavelen(sound1.getWavelen());
            wavelen2Slider.value = wavelen1Slider.value;
        }
    }
    lenLockChange();
    lenMatch.addEventListener("click", lenLockChange);

    let shiftLockChange = () => {
        if (shiftMatch.checked) {
            sound2.shift = sound1.shift;
            shift2Slider.value = shift1Slider.value;
        }
    }
    shiftLockChange();
    shiftMatch.addEventListener("click", shiftLockChange);

}

function updateSquareCounts(horizCount) {
    horizSquares = horizCount;
    vertSquares = horizCount * canvas.height / canvas.width;
}

addEventListener("load", () => {
    canvas = document.getElementById("ctx");
    ctx = canvas.getContext("2d");

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    vertSquares = horizSquares * canvas.height / canvas.width;

    sound1 = new Sound();
    sound1.x = canvas.width * 1 / 8;

    sound2 = new Sound();
    sound2.x = canvas.width * 1 / 8;

    ampl1Slider = document.getElementById("ampl1");
    wavelen1Slider = document.getElementById("wavelen1");
    shift1Slider = document.getElementById("shift1");

    ampl2Slider = document.getElementById("ampl2");
    wavelen2Slider = document.getElementById("wavelen2");
    shift2Slider = document.getElementById("shift2");
    
    squareSlider = document.getElementById("squares");
    blurSlider = document.getElementById("blur");
    
    amplMatch = document.getElementById("match_ampl");
    lenMatch = document.getElementById("match_len");
    shiftMatch = document.getElementById("match_shift");

    setupSliders();
    setupCheckBoxes();

    requestAnimationFrame(update);
});


function gradient(p) {
    let c = 255 * Math.abs(p) / (sound1.ampl + sound2.ampl);
    
    c = Math.round(c);
    c = Math.min(255, c);
    c = Math.max(0, c);

    if (p > 0)
        return `rgb(${c}, 0, 0)`;
    else
        return `rgb(0, 0, ${c})`;
}

function update() {
    time = Date.now() / 1000;

    for (let i = 0; i < horizSquares; i++) {
        for (let j = 0; j < vertSquares; j++) {

            let x = i / horizSquares * canvas.width;
            let y = j / vertSquares * canvas.height;

            let pos = {
                x: x + canvas.width / (2 * horizSquares),
                y: y + canvas.height / (2 * vertSquares)
            };

            let p = sound1.pressure(pos);
            p += sound2.pressure(pos);

            ctx.fillStyle = gradient(p);

            ctx.fillRect(x, y,
                         canvas.width / horizSquares,
                         canvas.height / vertSquares);
        }
    }

    if (blurAmount > 0.09) {
        ctx.filter = `blur(${blurAmount}px)`;
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = "none";
    }


    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(sound1.x, sound1.y, 10, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(sound2.x, sound2.y, 10, 0, 2 * Math.PI);
    ctx.fill();

    requestAnimationFrame(update);
}