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
			var value = arr[i] - this.neurons[i].getValue();
			this.neurons[i].backward(value, degree)
			sum += Math.pow(value, 2)
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