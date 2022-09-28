const functions = {
	"leakyRelu": {
		"activate": function(x) {
			if (x < 0) return x * 0.01;
			if (x > 1) return x * 0.01 + 1;
			return x;
		},
		"measure": function(y) {
			if (y < 0 || y > 1) return 0.01;
			return 1;
		}
	},

	"logistic": {
		"activate": function(x) {
			return 1 / (1 + Math.exp(-x));
		},
		"measure": function(y) {
			return y * (1 - y);
		}
	}
};


class NeuralNetwork {
	constructor(nc, type = "logistic") {
		// nc = [2,3,1]
		this.neurons = [];
			// [value, error]
			// layout 0    [0,0],[0,0]
			// layput 1 [0,0],[0,0],[0,0],
			// layput 2       [0,0]
		this.weights = [];
			// layout 0 - layout 1
			//   [0,0]
			//   [0,0]
			//   [0,0]
			// layout 1 - layout 2
			//   [0,0,0]
		
		this.type = type; //"leakyRelu"; // activation function type

		for (let i = 0; i < nc.length; i++) {
			let layout = [];

			for (let j = 0; j < nc[i]; j++) {
				layout.push([0,0]);
			}

			this.neurons.push(layout);
		}

		for (let i = 0; i < nc.length - 1; i++) {
			let layout = [];

			for (let j = 0; j < nc[i + 1]; j++) {
				let neuron = [];

				for (let k = 0; k < nc[i]; k++) {
					neuron.push(Math.random()*2-1);
				}

				layout.push(neuron);
			}

			this.weights.push(layout);
		}
	}
	

	// lid - left layout id
	forWard(lid) {
		for (let r = 0; r < this.neurons[lid + 1].length; r++) {
			this.neurons[lid + 1][r][0] = 0;

			for (let l = 0; l < this.neurons[lid].length; l++) {
				this.neurons[lid + 1][r][0] += this.neurons[lid][l][0] * this.weights[lid][r][l];
			}

			this.neurons[lid + 1][r][0] = functions[this.type]["activate"](this.neurons[lid + 1][r][0]);
		}
	}

	run(data) {
		for (let i = 0; i < data.length; i++) {
			this.neurons[0][i][0] = data[i];//functions[this.type]["activate"](data[i]);
		}

		for (let i = 0; i < this.neurons.length - 1; i++) {
			this.forWard(i);
		}

		let output = [];

		for (let i = 0; i < this.neurons[this.neurons.length - 1].length; i++) {
			output.push(this.neurons[this.neurons.length - 1][i][0]);
		}

		return output;
	}


	getOutputError(outdata) {
		for (let i = 0; i < outdata.length; i++) {
			this.neurons[this.neurons.length - 1][i][1] = outdata[i] - this.neurons[this.neurons.length - 1][i][0];
		}
	}

	getError(lid) {
		//let error = 0;
			
		for (let l = 0; l < this.neurons[lid].length; l++) {
			this.neurons[lid][l][1] = 0;

			for (let r = 0; r < this.neurons[lid + 1].length; r++) {
				this.neurons[lid][l][1] += this.neurons[lid + 1][r][1] * this.weights[lid][r][l]
				//error += Math.abs(this.neurons[lid][l][1]);
			}
		}

		//return error;
	}

	correctWeight(lid, koof) {
		for (let l = 0; l < this.neurons[lid].length; l++) {
			for (let r = 0; r < this.neurons[lid + 1].length; r++) {
				this.weights[lid][r][l] += this.neurons[lid + 1][r][1] * 
					functions[this.type]["measure"](this.neurons[lid + 1][r][0]) *
					this.neurons[lid][l][0] *
					koof;
			}
		}
	}

	train(params) {
		let data       = params["data"];
		let koof       = params["koof"] || 0.5;
		let iterations = params["iterations"] || 1000;
		let log        = params["log"] || false;
		let logPeriod  = params["log period"] || 100;
		let minError   = params["min error"] || 0;

		for (let i = 0; i < iterations; i++) {
			let error = 0;

			for (let d of data) {
				this.run(d["input"]);

				this.getOutputError(d["output"]);
				
				let e = 0;

				for (let j = 0; j < this.neurons[this.neurons.length-1].length; j++) {
					e += this.neurons[this.neurons.length-1][j][1] ** 2;
				}

				error += e / this.neurons[this.neurons.length-1].length;

				if (error <= minError)
					return;

				for (let j = this.neurons.length - 2; j >= 0; j--) {
					this.getError(j);
				}

				for (let j = 0; j < this.neurons.length - 1; j++) {
					this.correctWeight(j, koof);
				}
			}

			error /= data.length;

			if (log && i % logPeriod == 0)
				console.log(`iteration: ${i}, error: ${error}`);
		}
	}
}
