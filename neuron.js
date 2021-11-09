class Matrix
{
	width = 0;
	height = 0;
	data = [];

	constructor(width = 0, height = 0, data=[])
	{
		this.width = width;
		this.height = height;
		this.data = data;
	}

	getValue(x, y)
	{
		return this.data[this.width * y + x]
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

	info()
	{
		var result = ""

		result += this.value
		result += "("
		for(var i in this.outputs)
		{
			result += this.outputs[i].weight + ", "
		}
		result += ")"

		return result
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

	backward(delta, degree = 0.1)
	{
		for(let i in this.inputs)
		{
			let error = delta * this.inputs[i].input.value;
			this.inputs[i].weight += error * degree;
			this.inputs[i].input.backward(error, degree)
		}
	}

	award(value)
	{
		for(let i in this.inputs)
		{
			let award = value * this.inputs[i].input.value;
			this.inputs[i].weight += award;
			this.inputs[i].input.award(award)
		}
	}

	reset()
	{
		this.value = 0;
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

class Link
{
	value = 0.0
	input = null;
	output = null;
	weight = 0; 

	constructor(first, second, weight = Math.random() - 0.5)
	{
		this.input = first;
		this.output = second;
		this.weight = weight
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
