let canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

let x = "black",
    y = 35;


const pred = document.getElementById("pred");



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

function getMatrix() {
    let matr = [];
    for (let j = 0; j < canvas.width; j++) {
        let r = [];
        for (let i = 0; i < canvas.height; i++) {
            let color = ctx.getImageData(i, j, 1, 1).data;
            color = Math.max.apply(Math, color);
            if (color <= 255 / 2) {
                color = 0;
            } else {
                color = 255;
            }
            r.push(color);
        }
        matr.push(r);
    }
    return matr;
}

function getRowAndCol(matr, index) {
    let row = matr[index];
    let col = [];
    for (let i = 0; i < row.length; i++) {
        col.push(matr[i][index]);
    }
    return { row, col };
}

function deleteRowAndCol(matr, indexes) {
    let nmat = [];
    for (let i = 0; i < matr.length; i++) {
        if (indexes.includes(i)) continue;
        let _r = [];
        for (let j = 0; j < matr[0].length; j++) {
            if (indexes.includes(j)) continue;
            _r.push(matr[i][j]);
        }
        nmat.push(_r);
    }
    return nmat;
}

function Make28x28(matr) {
    let r_div = Math.floor((matr.length - 1) / 28);
    let c_div = Math.floor((matr.length - 1) / 28);
    console.log('divs', r_div, c_div);
    let nmat = [];
    for (let i = 0; i < matr.length; i += r_div) {
        let _r = [];
        for (let j = 0; j < matr.length; j += c_div) {
            let allcolors = [0];
            for (let _i = i; _i < i + r_div && _i < matr.length; _i++) {
                for (let _j = j; _j < j + c_div && _j < matr.length; _j++) {
                    try {
                        allcolors.push(matr[_i][_j]);
                    } catch (e) {
                        console.log(_i, _j, i, j);
                        console.error(e);
                        return;
                    }
                }
            }
            _r.push(Math.max(...allcolors));
        }
        nmat.push(_r);
    }
    return nmat;
}

function save() {
    let matrix = getMatrix();
    let delsides = [];
    let sides = matrix.length;
    for (let i = 0; i < sides - 5; i+=5) {
        let rmax = [];
        let cmax = [];
        for (let j = i; j <= (i + 5); j++) {
            let { row, col } = getRowAndCol(matrix, j);
            rmax.push(...row);
            cmax.push(...col);
        }
        if (Math.max(...rmax) === Math.max(...cmax) && Math.max(...rmax) === 0) {
            delsides.push(i);
        }
    }
    matrix = deleteRowAndCol(matrix, delsides);
    console.log(matrix);
    matrix = Make28x28(matrix);
    let more = matrix.length % 28;
    console.log('prev', matrix, more);
    if (more > 0) {
        let dels = [];
        for (let i = 0; i < more; i++) {
            dels.push(i);
        }
        matrix = deleteRowAndCol(matrix, dels);
    }
    console.log(matrix);
    window.image = matrix;
    predict([].concat(...matrix));
}
function erase() {
    //var m = confirm("Want to clear");
    let m = true;
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


function predict(image) {
    fetch('/api/predict', {
        method: "POST",
        body: JSON.stringify({
            lang: 'en',
            tensor: image,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (!response.ok) {
            alert('err');
            console.error(response);
        }
        response.json().then(data => {
            console.log('data', data);
            let char = data['prediction']['char'];
            let label = data['prediction']['label'];
            alert(`Prediction : ${label}`);
            pred.innerText = `${label}`;
        }).catch(err => {
            alert('err');
            console.error(err);
        });
    }).catch(err => {
        console.error(err);
    });
};

init();