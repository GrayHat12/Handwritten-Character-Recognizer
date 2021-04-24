var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

let pred;

var x = "white", y = 30;
let canvasEnabled = false;

let CHAR_TO_PREDICT;

const video = document.getElementsByTagName("video")[0];

let timestamps = [
    {
        t: 22.419432,
        char: "क"
    },
    {
        t: 31.619554,
        char: "ख"
    },
    {
        t: 36.906189999999995,
        char: "ग"
    },
    {
        t: 43.728748,
        char: "घ"
    },
    {
        t: 51.316231,
        char: "ङ"
    },
    {
        t: 58.290466,
        char: "च"
    },
    {
        t: 66.821336,
        char: "छ"
    },
    {
        t: 73.242266,
        char: "ज"
    },
    {
        t: 82.853553,
        char: "झ"
    },
    {
        t: 89.770818,
        char: "ञ"
    },
    {
        t: 95.205406,
        char: "ट"
    },
    {
        t: 101.932985,
        char: "ठ"
    },
    {
        t: 108.938826,
        char: "ड"
    },
    {
        t: 115.906165,
        char: "ढ"
    },
    {
        t: 122.880898,
        char: "ण"
    },
    {
        t: 129.742423,
        char: "त"
    },
    {
        t: 137.062998,
        char: "थ"
    },
    {
        t: 143.84825,
        char: "द"
    },

    {
        t: 151.729473,
        char: "ध"
    },
    {
        t: 158.539406,
        char: "न"
    },
    {
        t: 163.499902,
        char: "प"
    },
    {
        t: 171.044124,
        char: "फ"
    },
    {
        t: 178.935133,
        char: "ब"
    },
    {
        t: 185.085444,
        char: "भ"
    },
    {
        t: 190.275019,
        char: "म"
    },
    {
        t: 195.482917,
        char: "य"

    },
    {
        t: 201.222173,
        char: "र"
    },
    {
        t: 207.018022,
        char: "ल"
    },
    {
        t: 212.486308,
        char: "व"
    },
    {
        t: 218.762569,
        char: "श"
    },
    {
        t: 225.455197,
        char: "ष"
    },
    {
        t: 232.899973,
        char: "स"
    },
    {
        t: 239.471564,
        char: "ह"
    },
    {
        t: 246.154766,
        char: "क्ष"
    },
    {
        t: 251.50238,
        char: "त्र"
    },
    {
        t: 258.020136,
        char: "ज्ञ"
    }
];

let donesies = [];

function setChar(data) {
    let char = data.char;
    let but = document.getElementById("char");
    but.style.display = "block";
    but.getElementsByClassName("a")[0].innerHTML = char;
    donesies.push(data);
    canvasEnabled = true;
    CHAR_TO_PREDICT = char;
}

video.addEventListener("timeupdate", (ev) => {
    let ctime = video.currentTime;
    console.log(timestamps[0]);
    let diff = timestamps[0].t - ctime;
    if (Math.abs(diff) < 0.1) {
        video.pause();
        setChar(timestamps.shift());
    } if (diff < -1) {
        donesies.push(timestamps.shift());
    }
});

function setBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function init() {
    canvas = document.getElementById('can');
    pred = document.getElementById("pred");
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    setBackground();
    canvas.addEventListener("mousemove", function (e) {
        //console.log(e);
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
}

function draw() {
    if (!canvasEnabled) return;
    ctx.beginPath();
    ctx.moveTo(prevX + window.scrollX, prevY + window.scrollY);
    ctx.lineTo(currX + window.scrollX, currY + window.scrollY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function erase() {
    var m = true;//confirm("Want to clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
    setBackground();
}

function save() {
    var dataURL = canvas.toDataURL();
    fetch('/api/predict', {
        method: "POST",
        body: JSON.stringify({
            image: dataURL,
            lang: 'hi'
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
            let chars = data['prediction']['char'];
            //let labels = data['prediction']['label'];
            if (chars.includes(CHAR_TO_PREDICT)) {
                alert("Success");
                if (video.paused) {
                    video.play();
                }
            } else {
                alert("Wrong");
            }
            //alert(`Prediction : ${label}`);
            //pred.innerText = `${label}`;
        }).catch(err => {
            alert('err');
            console.error(err);
        });
    }).catch(err => {
        console.error(err);
    });
}

function findxy(res, e) {
    //let rect = canvas.getBoundingClientRect();
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

init();