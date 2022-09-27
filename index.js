// https://stackoverflow.com/questions/1769584/get-position-of-element-by-javascript
function getPos(ele){
    var x=0;
    var y=0;
    while(true){
        x += ele.offsetLeft;
        y += ele.offsetTop;
        if(ele.offsetParent === null){
            break;
        }
       ele = ele.offsetParent;
    }
    return [x, y];
}


const cnv = viewport; // да, так можно обращатся
cnv.height = cnv.width = 512;
const ctx = cnv.getContext("2d");
ctx.fillStyle = "#000000";

const cellsCount = 10;
const cellSize = cnv.width / cellsCount;

var image = [];
for (let i = 0; i < cellsCount * cellsCount; i++)
	image.push(0);



const nn = new NeuralNetwork([cellsCount * cellsCount, 50, 10, 20, 1]);
var ld = [];



function clearCnv() {
	for (let i = 0; i < image.length; i++)
		image[i] = 0;

	update();
}

const [cx,cy] = getPos(cnv);

var isMouseDown = false;
var mx = 0;
var my = 0;

cnv.onmousedown = function(e) {
	isMouseDown = true;

	mx = Math.min(cellsCount - 1, Math.max(0, Math.round((e.pageX - cx - cellSize / 2) / cellSize)));
	my = Math.min(cellsCount - 1, Math.max(0, Math.round((e.pageY - cy - cellSize / 2) / cellSize)));

	image[mx + my * cellsCount] = 1;

	update();
}

cnv.onmousemove = function(e) {
	if (isMouseDown == false) return;

	mx = Math.min(cellsCount, Math.max(0, Math.round((e.pageX - cx - cellSize / 2) / cellSize)));
	my = Math.min(cellsCount, Math.max(0, Math.round((e.pageY - cy - cellSize / 2) / cellSize)));

	image[mx + my * cellsCount] = 1;

	update();
}

cnv.onmouseup = function(e) {
	isMouseDown = false;
}

function new_ld(a) {
	let d = {
		"input": image.slice(0,image.length),
		"output": [a]
	};

	ld.push(d);

	clearCnv();
}

function update() {
	ctx.clearRect(0,0,cnv.width,cnv.height);

	for (let x = 0; x < cellsCount; x++) {
		for (let y = 0; y < cellsCount; y++) {
			if (image[x + y * cellsCount] == 1)
				ctx.fillRect(x*cellSize,y*cellSize,cellSize,cellSize);
		}
	}
}

function train() {
	ld.sort(() => Math.random() - 0.5);

	nn.train({
		"data": ld,
		"iterations": 10000,
		"log": true,
		"log period": 1000,
		"koof": 0.5
	});

	train_div.style.display = "none";
	test_div.style.display = "block";
}


function ask() {
	let r = nn.run(image);

	answer.innerHTML = r + ": " + (r > 0.5 ? "Нолик" : "Крестик");

	clearCnv();
}
