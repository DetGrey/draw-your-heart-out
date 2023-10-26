// -------------------------------------------------- SETUP CANVAS
let canvasWidth = {
    element: document.querySelector('#canvas-width'),
    value: 400
};
let canvasHeight = {
    element: document.querySelector('#canvas-height'),
    value: 400
};
if (window.innerWidth < 450) {
    canvasWidth.value = 300;
    canvasHeight.value = 300;
}

function setup() {
    let canvas = createCanvas(canvasWidth.value, canvasHeight.value);
    canvas.parent('#sketch-holder');
    changeToolbarTop(active);
}

// -------------------------------------------------- RESIZE CANVAS
canvasWidth.element.onchange = () => {
    if (canvasWidth.element.value < parseInt(canvasWidth.element.min)) {
        canvasWidth.element.value = parseInt(canvasWidth.element.min)
    }
    else if (canvasWidth.element.value > parseInt(canvasWidth.element.max)) {
        canvasWidth.element.value = parseInt(canvasWidth.element.max);
    }
    canvasWidth.value = canvasWidth.element.value;
    resizeCanvas(canvasWidth.value, canvasHeight.value);
}
canvasHeight.element.onchange = () => {
    if (canvasHeight.element.value < parseInt(canvasHeight.element.min)) {
        canvasHeight.element.value = parseInt(canvasHeight.element.min)
    }
    else if (canvasHeight.element.value > parseInt(canvasHeight.element.max)) {
        canvasHeight.element.value = parseInt(canvasHeight.element.max);
    }
    canvasHeight.value = canvasHeight.element.value;
    resizeCanvas(canvasWidth.value, canvasHeight.value);
}

// -------------------------------------------------- DRAW
function draw() {
    if (mouseIsPressed && mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) {
        if (active.id === 'tb-path') {
            drawPath();
        }
        else if (active.id === 'tb-draw') {
            drawBrush();
        }
        else if (active.id === 'tb-circle') {
            createEllipse();
        }
        else if (active.id === 'tb-rectangle') {
            createRectangle();
        }
    }}
function mouseReleased() {
    loop();
}

// -------------------------------------------------- DRAWING MODES
let toolbarLeft = document.querySelector('#toolbar-left').children;
let active = document.querySelector('#toolbar-left .active');

function changeMode(element) {
    changeToolbarTop(element);

    document.querySelector('#' + element.id + ' img').src = `icons/${element.id}-active.png`;

    element.classList.add('active');
    active = element;

    for (let tool of toolbarLeft) {
        if (element !== tool) {
            document.querySelector('#' + tool.id + ' img').src = `icons/${tool.id}.png`;
            tool.classList.remove('active');
        }}

    if (active.id === 'tb-img' && document.querySelector('#img-upload').files[0]) {
        imgs.push({imgNumber: imgFiles, element: document.querySelector('#img-upload').files[0]});
        imgFiles++;
    }
}

for (let element of toolbarLeft) {
    element.addEventListener('click', () => {
        changeMode(element);
    });
}

// -------------------------------------------------- BRUSH MODES / SHAPES
let size = document.querySelector('#size');
let borderSize = document.querySelector('#border-size');
let paths = [];
function drawPath() {
    noLoop();
    stroke(rgb.r, rgb.g, rgb.b, opacity);
    strokeWeight(size.value);
    strokeJoin('round');
    point(mouseX, mouseY);
    paths.push({x:mouseX, y:mouseY});

    if (paths.length > 1) {
        line(paths[paths.length-1].x, paths[paths.length-1].y, paths[paths.length-2].x, paths[paths.length-2].y);
    }
}
function drawBrush() {
    stroke(rgb.r, rgb.g, rgb.b, opacity);
    strokeWeight(size.value);
    strokeJoin('round');
    line(pmouseX, pmouseY, mouseX,mouseY);
}
function createEllipse() {
    strokeWeight(borderSize.value);
    noLoop();
    ellipseMode(CENTER)
    fill(rgb.r, rgb.g, rgb.b, opacity);
    stroke(rgbBorder.r, rgbBorder.g, rgbBorder.b, opacity);
    ellipse(pmouseX, pmouseY, size.value);
}
function createRectangle() {
    strokeWeight(borderSize.value);
    noLoop();
    rectMode(CENTER);
    fill(rgb.r, rgb.g, rgb.b, opacity);
    stroke(rgbBorder.r, rgbBorder.g, rgbBorder.b, opacity);
    rect(mouseX, mouseY, size.value, size.value);
}

// -------------------------------------------------- CONVERT HEX TO RGB
function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// -------------------------------------------------- TOOLBAR TOP ELEMENTS
let colorPicker = document.querySelector('#colour-picker');
let rgb = hexToRgb(colorPicker.value);

colorPicker.onchange = () => {
    rgb = hexToRgb(colorPicker.value);
}

let borderColorPicker = document.querySelector('#border-colour-picker');
let rgbBorder = hexToRgb(borderColorPicker.value);

borderColorPicker.onchange = () => {
    rgbBorder = hexToRgb(borderColorPicker.value);
}

let opacity = 255;
let opacityValue = document.querySelector('#opacity');

opacityValue.onchange = () => {
    opacity = opacityValue.value / 100 * 255;
}

// -------------------------------------------------- TOOLBAR TOP
let toolbarTop = document.querySelector('#toolbar-top').children;
function changeToolbarTop(element) {
    let id = element.id.split('-')[1];
    for (let tool of toolbarTop) {
        let classes = tool.className.split(' ');
        if (classes.includes(id)) {
            tool.classList.remove('none');
        }
        else {
            tool.classList.add('none');
        }
    }
}


// -------------------------------------------------- CLEAR CANVAS
let clearBtn = document.querySelector('#clear-btn');
clearBtn.addEventListener('click', () => {
    clear();
    paths = [];
});

// -------------------------------------------------- SAVE CANVAS AS PNG
let saveBtn = document.querySelector('#save-btn');
saveBtn.addEventListener('click', () => {
    let getdate = new Date().toLocaleDateString().replaceAll('/', '')
        getdate += '-' + new Date().toLocaleTimeString().replaceAll(':', '');
    save(`${getdate}.png`);
});