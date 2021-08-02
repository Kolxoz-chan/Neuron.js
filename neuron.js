class Layer
{
	neurons = [];
	prev_layer = null;
	next_layer = null;

	constructor(count, func = null)
	{
		for(let i=0; i<count; i++)
		{
			this.neurons[i] = new Neuron(func);
		}
	}

	join(layer)
	{
		this.next_layer = layer;
		layer.prev_layer = this;

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

	backward(arr = [])
	{
		// Getting error
		var sum = 0;
		for(var i in arr)
		{
			var value = this.neurons[i].getValue();
			sum += Math.pow(arr[i] - value, 2)
		}

		console.log(Math.sqrt(sum / arr.length))
	}

	getValues()
	{
		var arr = [];

		for(var i in this.neurons)
		{
			arr[i] = this.neurons[i].getValue();
		}

		return arr;
	}
}

class Link
{
	value = 0.0
	input = null;
	output = null;
	weight = Math.random() - 0.5;

	constructor(first, second)
	{
		this.input = first;
		this.output = second;
	}

	setValue(value)
	{
		this.value = value;
	}

	getValue()
	{
		return this.weight * this.value;
	}
}

class Neuron
{
	func = null;
	value = 0.0;
	inputs = [];
	outputs = [];

	constructor(func)
	{
		this.func = func;
	}

	forward(value = 0)
	{
		this.setValue(value);
		for(let link of this.inputs.values())
		{
			var value = link.getValue();
			this.addValue(value);
		}
		
		var value = this.getValue();
		for(let link of this.outputs.values())
		{
			link.setValue(value);
		}
	}

	backward(delta)
	{
		

	}

	setValue(value)
	{
		this.value = value;
	}

	getValue()
	{
		if(this.func) 
		{
			return func(this.value);
		}
		else
		{
			return this.value;
		}
	}

	addValue(value)
	{
		this.value += value;
	}

	addInput(link)
	{
		this.inputs.push(link);
	}

	addOutput(link)
	{
		this.outputs.push(link);
	}

	join(neuron)
	{
		var link = new Link(this, neuron);
		this.addOutput(link)
		neuron.addInput(link)
	}
}