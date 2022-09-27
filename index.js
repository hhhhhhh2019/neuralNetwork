/*const nn = new NeuralNetwork([2,10,1]);

let ld = [
	{"input":  [0,0],
	 "output": [0]},
	{"input":  [1,0],
	 "output": [1]},
	{"input":  [0,1],
	 "output": [1]},
	{"input":  [1,1],
	 "output": [0]},
];

nn.train({
	"data": ld,
	"iterations": 7000,
	"log": true,
	"log period": 1000,
	"koof": 0.9,
});

console.log(nn.run([0,0])[0]);
console.log(nn.run([1,0])[0]);
console.log(nn.run([0,1])[0]);
console.log(nn.run([1,1])[0]);*/

const nn = new NeuralNetwork([3,2,1], "leakyRelu");

var ld = [];

var color = [0,0,0];

const whiteBtn = document.getElementById("white");
const blackBtn = document.getElementById("black");

const trainDiv = document.getElementById("train_div");
const testDiv = document.getElementById("test_div");

testDiv.style.visibility = "hidden";

const btnTrain = document.getElementById("train");
btnTrain.onclick = function() {
	testDiv.style.visibility = "visible";
	trainDiv.style.visibility = "hidden";
	trainDiv.style.display = "none";

	nn.train({
		"data": ld,
		"iterations": 50000,
		"log": true,
		"log period": 2000,
		"koof": 0.5
	});

	next();
}

const testText = document.getElementById("test_text");

function random() {
	//return Math.random();
	let o = new Uint8Array([0]);
	window.crypto.getRandomValues(o);
	return o[0] / 255;
}

function newQuestion() {
	color = [random(), random(), random()];

	whiteBtn.style.background = `rgb(${Math.floor(color[0]*255)},${Math.floor(color[0]*255)},${Math.floor(color[0]*255)})`;
	blackBtn.style.background = `rgb(${Math.floor(color[0]*255)},${Math.floor(color[0]*255)},${Math.floor(color[0]*255)})`;
}

function answer(a) {
	let d = {
		"input": color,
		"output": [a]
	};

	ld.push(d);

	newQuestion();
}

function next() {
	color = [random(), random(), random()];
	testText.style.background = `rgb(${Math.floor(color[0]*255)},${Math.floor(color[0]*255)},${Math.floor(color[0]*255)})`;
	let a = Math.round(nn.run(color)[0]);
	testText.style.color = `rgb(${Math.floor(a*255)},${Math.floor(a*255)},${Math.floor(a*255)})`;
}

newQuestion();
