// -------------------------------------------------- FUNCTIONS
function setup() {
    let canvas = createCanvas(canvasWidth.value, canvasHeight.value);
    canvas.parent('#sketch-holder');
    changeToolbarTop(active);
}

function draw() {
if (mouseIsPressed && mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) {
    stroke(rgb.r, rgb.g, rgb.b, opacity);
    strokeWeight(size.value);

    if (active.id === 'tb-path') {
        noLoop();
        strokeJoin('round');
        point(mouseX, mouseY);
        points.push({x:mouseX, y:mouseY});
        if (points.length > 1) {
            line(points[points.length-1].x, points[points.length-1].y, points[points.length-2].x, points[points.length-2].y);
        }
    }
    else if (active.id === 'tb-draw') {
        strokeJoin('round');
        line(pmouseX, pmouseY, mouseX,mouseY);
    }
    else if (active.id === 'tb-circle') {
        strokeWeight(borderSize.value);
        noLoop();
        ellipseMode(CENTER)
        fill(rgb.r, rgb.g, rgb.b, opacity);
        stroke(rgbBorder.r, rgbBorder.g, rgbBorder.b, opacity);
        ellipse(pmouseX, pmouseY, size.value);
    }
    else if (active.id === 'tb-rectangle') {
        strokeWeight(borderSize.value);
        noLoop();
        rectMode(CENTER);
        fill(rgb.r, rgb.g, rgb.b, opacity);
        stroke(rgbBorder.r, rgbBorder.g, rgbBorder.b, opacity);
        rect(mouseX, mouseY, size.value, size.value);
    }

    // else if (active.id === 'tb-text') {
    //     noLoop();
    //     let typedText = createP('hello');
    //     typedText.parent('#sketch-holder');
    //     typedText.id(`typedtext${textFields++}`)
    //     typedText.position(mouseX, mouseY, 'absolute');
    // }
}}
function mouseReleased() {
    loop();
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
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

// Get the modal
let modal = document.querySelector('#addPictureModal')

// Get the <span> element that closes the modal
let span = document.querySelectorAll('.closeModal');

// When the user clicks on <span> (x), close the modal
for (let element of span) {
    element.addEventListener('click', () => {
        closeModal();
    });
}

function closeModal() {
    modal.style.display = "none";
}

function addToGallery() {
        modal.style.display = "block";
}

// -------------------------------------------------- VARIABLES
let colorPicker = document.querySelector('#colour-picker');
let borderColorPicker = document.querySelector('#border-colour-picker');
let rgb = hexToRgb(colorPicker.value);
let rgbBorder = hexToRgb(borderColorPicker.value);
let opacity = 255;

let size = document.querySelector('#size');
let borderSize = document.querySelector('#border-size');

let clearBtn = document.querySelector('#clear-btn');

let opacityValue = document.querySelector('#opacity');

let canvasWidth = {
    element: document.querySelector('#canvas-width'),
    value: 400
};
let canvasHeight = {
    element: document.querySelector('#canvas-height'),
    value: 400
};

let saveBtn = document.querySelector('#save-btn');

let toolbarLeft = document.querySelector('#toolbar-left').children;
let active = document.querySelector('#toolbar-left .active');

let points = [];

let imgs = [];
let imgFiles = 0;

let toolbarTop = document.querySelector('#toolbar-top').children;

// -------------------------------------------------- ON CLICK/CHANGE
for (let element of toolbarLeft) {
    element.addEventListener('click', () => {
        changeMode(element);
    });
}
colorPicker.onchange = () => {
    rgb = hexToRgb(colorPicker.value);
}

clearBtn.addEventListener('click', () => {
    clear();
    points = [];
});

opacityValue.onchange = () => {
    opacity = opacityValue.value / 100 * 255;
}

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

saveBtn.addEventListener('click', () => {
    let getdate = new Date().toLocaleDateString().replaceAll('/', '')
        getdate += '-' + new Date().toLocaleTimeString().replaceAll(':', '');
    save(`${getdate}.png`);

    setTimeout(function(){
        addToGallery();
    }, 2000);
});