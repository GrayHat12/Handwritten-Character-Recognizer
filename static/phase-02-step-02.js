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
    for(let row=_partitions-1;row>=0;row--){
        for(let col=0;col<_partitions;col++){
            let i_s = (row+1)*y;
            let j_s = (col+1)*y;
            let color = ctx.getImageData(i_s,j_s,_partitions,_partitions).data;
            color = Math.max.apply(Math,color);
            if (color === 0) {
                color = 0;
            }else {
                color = 255;
            }
            image.push(color);
        }
    }
    window.image = image;
    predict(image);
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
    fetch('/api/predict',{
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
            console.log('data',data);
            let char = data['prediction']['char'];
            let label = data['prediction']['label'];
            alert(`Prediction : ${label}`);
        }).catch(err => {
            alert('err');
            console.error(err);
        });
    }).catch(err => {
        console.error(err);
    });
};

init();