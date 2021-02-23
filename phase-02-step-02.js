const predictor = new Predictor();
window.predictor = predictor;
async function loadModel(path = './tfjs_model/model.json') {
    let model = await tf.loadLayersModel(path);
    init();
    return model;
};
console.log("loading model");
loadModel().then(model => {
    predictor.setModel(model);
}).catch(console.error);

let canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

let x = "black",
    y = 15;



function init() {
    console.log("Canvas Initialising");
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
    console.log("Canvas Initialized");
}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function save() {
    let _partitions = 28;
    let image = [];
    for(let col=0;col<_partitions;col++){
        let rdata = [];
        for(let row=0;row<_partitions;row++){
            let i_s = (row+1)*y;
            let j_s = (col+1)*y;
            let color = ctx.getImageData(i_s,j_s,_partitions,_partitions).data;
            color = color.reduce((total,current) => total+current) / color.length;
            color = Math.floor(color);
            rdata.push(color);
        }
        image.push(rdata);
    }
    window.image = image;
    predictor.predict(image);
}
function erase() {
    var m = confirm("Want to clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}