class Node
{
	widget = null;
	prev_layer = null;
	next_layer = null;
}

class Layer extends Node
{
	neurons = [];

	constructor(count, func = null)
	{
		super()
		this.init(count, func);
	}

	init(count, func)
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

	backward(arr = [], degree = 0.1)
	{
		var sum = 0;
		for(var i in this.neurons)
		{
			var value = arr[i] - this.neurons[i].getValue();
			this.neurons[i].backward(value, degree)
			sum += Math.pow(value, 2)
		}

		console.log(Math.sqrt(sum / arr.length))
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

				return this.neurons[index]
		}
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

class Matrix extends Layer
{
	width = 0;
	height = 0;

	constructor(width, height, func = null)
	{
		super(width * height)
		this.width = width;
		this.height = height;
	}

	getNeuron(x, y)
	{
		return this.neurons[this.width * y + x]
	}
}

class Canvas extends Node
{
	context = null;

	constructor(id, width, height)
	{
		super();

		var editor = document.querySelector("#" + id);

		this.widget = document.createElement("canvas")
		this.widget.setAttribute("width", width);
		this.widget.setAttribute("height", height);
		editor.appendChild(this.widget);

		this.context = this.widget.getContext('2d');
	}

	join(node)
	{

	}
}