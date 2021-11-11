class Layer
{
	neurons = [];
	next_layer = null

	constructor(count, func = null)
	{
		this.init(count, func);
	}

	init(count, func)
	{
		for(let i=0; i<count; i++)
		{
			this.neurons[i] = new Neuron(func);
		}
	}

	info()
	{
		var result = ""
		for(var i in this.neurons)
		{
			result += this.neurons[i].info() + "\n"
		}

		return result;
	}

	join(layer)
	{
		this.next_layer = layer
		for(var obj_1 of this.neurons.values())
		{
			for(var obj_2 of layer.neurons.values())
			{
				obj_1.join(obj_2);
			}
		}

		return layer;
	}

	reset()
	{
		for (var i in this.neurons)
		{
			this.neurons[i].reset()
		}
	}

	award(arr)
	{ 
		for(var i=0; i<this.neurons.length; i++)
		{
			this.neurons[i].award(arr[i])
		}
	}

	forward(arr = [])
	{
		for (var i in this.neurons)
		{
			if(arr[i] != undefined)
			{
				this.neurons[i].forward(arr[i]);
			}
			else
			{
				this.neurons[i].forward();
			}
		}
		if(this.next_layer) this.next_layer.forward();
	}

	backward(arr = [], degree = 0.1)
	{
		var sum = 0;
		for(var i in this.neurons)
		{
			if(arr[i] != null)
			{
				var value = arr[i] - this.neurons[i].getValue();
				this.neurons[i].backward(value, degree)
				sum += Math.pow(value, 2)
			}
		}

		return Math.sqrt(sum / arr.length)
	}

	getNeuron(index)
	{
		return this.neurons[index];
	}

	getStrongestNeuron()
	{
		var index = 0;
		var max = -100000;
		for(let i in this.neurons)
		{
			var value = this.neurons[i].getValue()
			if(max < value)
			{
				max = value
				index = i
			}	
		}
		return index
	}

	getValues(count = 7)
	{
		var arr = [];
		var num = Math.pow(10, count)

		for(var i in this.neurons)
		{
			arr[i] = Math.round(this.neurons[i].getValue() * num) / num;
		}

		return arr;
	}
}

class Perceptron
{
	layers = []
	input_layer = null
	output_layer = null

	constructor(arr = [])
	{
		for(let i in arr)
		{
			let layer = new Layer(arr[i])
			if(!this.input_layer) this.input_layer = layer
			if(this.output_layer) this.output_layer.join(layer)
			this.output_layer = layer
			this.layers.push(layer)
		}
	}

	forward(arr)
	{
		this.input_layer.forward(arr)
	}

	backward(arr)
	{
		return this.output_layer.backward(arr)
	}

	backward_id(index, value, default_value = null)
	{
		let arr = []
		for(let i=0; i<this.input_layer.neurons.length; i++)
		{
			arr.push(default_value)
		}
		arr[index] = value;
		return this.backward(arr)
	}

	reset()
	{
		for(var i=0; i<this.layers.length; i++)
		{
			this.layers[i].reset()
		}
	}

	award(arr)
	{ 
		this.output_layer.award(arr)
	}

	getValues()
	{
		return this.output_layer.getValues()
	}

	getStrongestNeuron()
	{
		return this.output_layer.getStrongestNeuron();
	}

	getNeuron(i, j)
	{
		return this.layers[i].getNeuron(j)
	}

	getLayer(i)
	{
		return this.layers[i]
	}
} 