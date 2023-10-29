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
canvasWidth.element.addEventListener('change', () => {
    if (canvasWidth.element.value < parseInt(canvasWidth.element.min)) {
        canvasWidth.element.value = parseInt(canvasWidth.element.min)
    }
    else if (canvasWidth.element.value > parseInt(canvasWidth.element.max)) {
        canvasWidth.element.value = parseInt(canvasWidth.element.max);
    }
    canvasWidth.value = canvasWidth.element.value;
    resizeCanvas(canvasWidth.value, canvasHeight.value);
});
canvasHeight.element.addEventListener('change', () => {
    if (canvasHeight.element.value < parseInt(canvasHeight.element.min)) {
        canvasHeight.element.value = parseInt(canvasHeight.element.min)
    }
    else if (canvasHeight.element.value > parseInt(canvasHeight.element.max)) {
        canvasHeight.element.value = parseInt(canvasHeight.element.max);
    }
    canvasHeight.value = canvasHeight.element.value;
    resizeCanvas(canvasWidth.value, canvasHeight.value);
});

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

    if (!colorOpen && mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) {
        saveState();
        greyOutText(redoBtn);
        nextState = [];
        nextStateIndex = 0;
    }
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
let sizeHeight = document.querySelector('#size-height');
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
    ellipse(pmouseX, pmouseY, size.value, sizeHeight.value);
}
function createRectangle() {
    strokeWeight(borderSize.value);
    noLoop();
    rectMode(CENTER);
    fill(rgb.r, rgb.g, rgb.b, opacity);
    stroke(rgbBorder.r, rgbBorder.g, rgbBorder.b, opacity);
    rect(mouseX, mouseY, size.value, sizeHeight.value);
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

// -------------------------------------------------- GREY OUT TEXT / ACTIVE TEXT
function greyOutText(element) {
    element.style.color = '#00000050';
}
function activeText(element) {
    element.style.color = 'black';
}

// -------------------------------------------------- TOOLBAR TOP ELEMENTS
// opacity
let opacity = 255;
let opacityValue = document.querySelector('#opacity');
let opacityValueNumber = document.querySelector('#opacity-value-number');

opacityValue.addEventListener('change', () => {
    opacity = opacityValue.value / 100 * 255;
    opacityValueNumber.value = opacityValue.value;
});
opacityValue.addEventListener('mousemove', () => {
    opacity = opacityValue.value / 100 * 255;
    opacityValueNumber.value = opacityValue.value;
});
opacityValueNumber.addEventListener('change', () => {
    opacity = opacityValueNumber.value / 100 * 255;
    opacityValue.value = opacityValueNumber.value;
});

// color picker
let colorPicker = document.querySelector('#colour-picker');
let rgb = hexToRgb(colorPicker.value);
let colorOpen = false;

colorPicker.addEventListener('click', () => {
    colorOpen = true;
});
colorPicker.addEventListener('change', () => {
    rgb = hexToRgb(colorPicker.value);
});
colorPicker.addEventListener('blur', () => {
    colorOpen = false;
});

// border color and size
let borderColorPicker = document.querySelector('#border-colour-picker');
let rgbBorder = hexToRgb(borderColorPicker.value);

borderColorPicker.addEventListener('change', () => {
    rgbBorder = hexToRgb(borderColorPicker.value);
});

// more or less buttons
let lessBtns = document.querySelectorAll('.less-btn');
let moreBtns = document.querySelectorAll('.more-btn');
let lessMoreBtns = [[lessBtns, '-'], [moreBtns, '+']];
let changeValueInterval;
lessMoreBtns.forEach(btns => {
    for (let btn of btns[0]) {
        let element = btn.parentElement.children[1];

        btn.addEventListener('mousedown', () => {
            changeValueInterval = setInterval(() => {
                // You are now in a hold state, you can do whatever you like!
                addOrSubtractNumber(element, element.value, btns[1]);
            }, 200);
        });
        btn.addEventListener('mouseup', () => {
            setTimeout(() => {
                clearInterval(changeValueInterval);
            }, 200);
        });
    }
});

function addOrSubtractNumber(element, value, symbol) {
    if (symbol === '-') {
        element.value--;
    }
    else {
        element.value++;
    }
}

// -------------------------------------------------- TOOLBAR TOP
let toolbarTop = document.querySelector('#toolbar-top').children;
function changeToolbarTop(element) {
    let id = element.id.split('-')[1];
    if (id === 'rectangle' || id === 'circle') {
        document.querySelector('#size-span').innerText = 'width (px)';
    }
    else {
        document.querySelector('#size-span').innerText = 'size (px)';
    }

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

// -------------------------------------------------- UNDO
let previousState = [];
let nextState = [];
let previousStateIndex = 0;
let nextStateIndex = 0;
let undoBtn = document.querySelector('#undo-btn');
let redoBtn = document.querySelector('#redo-btn');

window.addEventListener('keydown', (e) => {
    if (e.key === 'z' && e.ctrlKey) {
        e.preventDefault();
        undoToPreviousState();
    }
    else if (e.key === 'y' && e.ctrlKey) {
        e.preventDefault();
        redoToNextState();
    }
    else if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        saveCanvasAsPNG();
    }
    else if (e.key === 'Delete'){
        e.preventDefault();
        clearCanvas();
    }
});

undoBtn.addEventListener('click', () => {
    undoToPreviousState();
});

redoBtn.addEventListener('click', () => {
    redoToNextState();
});

function undoToPreviousState() {
    setTimeout(() => {
        if (previousState.length === 0) {
            greyOutText(undoBtn);
        }
        else {
            nextState.push(previousState[previousStateIndex]);
            nextStateIndex++;
            activeText(redoBtn);

            previousState.splice(previousStateIndex, 1);
            previousStateIndex--;
            if (previousState.length === 0) {
                greyOutText(undoBtn);
            }

            background(255)
            image(previousState[previousStateIndex], 0, 0, canvasWidth.value, canvasHeight.value);
        }
    },200);
}
function redoToNextState() {
    setTimeout(() => {
        if (nextState.length === 0 || nextState[nextStateIndex - 1] === undefined) {
            greyOutText(redoBtn);
        }
        else {

            previousState.push(nextState[nextStateIndex - 1]);
            previousStateIndex++;
            activeText(undoBtn);

            nextState.splice(nextStateIndex, 1);
            nextStateIndex--;
            if (nextState.length === 0) {
                greyOutText(redoBtn);
            }

            background(255)
            image(nextState[nextStateIndex], 0, 0, canvasWidth.value, canvasHeight.value);
        }
    }, 200);
}
function saveState() {
    loadPixels();
    previousState.push(get());
    previousStateIndex++;
    activeText(undoBtn);
}

// -------------------------------------------------- CLEAR CANVAS
let clearBtn = document.querySelector('#clear-btn');
clearBtn.addEventListener('click', () => {
    clearCanvas();
});
function clearCanvas() {
    clear();
    paths = previousState = nextState = [];
    previousStateIndex = nextStateIndex = 0;
    greyOutText(undoBtn);
    greyOutText(redoBtn);
}

// -------------------------------------------------- SAVE CANVAS AS PNG
let saveBtn = document.querySelector('#save-btn');
saveBtn.addEventListener('click', () => {
    saveCanvasAsPNG();
});
function saveCanvasAsPNG() {
    let getdate = new Date().toLocaleDateString().replaceAll('/', '')
    getdate += '-' + new Date().toLocaleTimeString().replaceAll(':', '');
    save(getdate + `.png`);
}