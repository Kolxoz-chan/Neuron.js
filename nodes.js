class Node
{
	widget = null;
	prev_layer = null;
	next_layer = null;

	join(layer)
	{
		this.next_layer = layer;
		layer.prev_layer = this;
		if(this.onJoin) this.onJoin(layer);
	}

	getWidget()
	{
		return this.widget;
	}

	addNode(obj)
	{
		this.nodes.appendChild(obj.getWidget());
	}
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

	onJoin(layer)
	{
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

class BinarizerNode extends Node
{
	channels_count = 4;

	constructor()
	{
		super();

		// Block
 		this.widget = document.createElement("div")

 		// Node
		var node = document.createElement("div")
		node.classList.add("node", "yellow");
		this.widget.appendChild(node);

		// Output
		var out = document.createElement("div")
		out.classList.add("node-out");
		this.widget.appendChild(out);

		var div = document.createElement("div")
		div.classList.add("add-button")
		div.onclick = () =>
		{
			this.addNode(new BinarizerNode())
		}
		out.appendChild(div);

		// Nodes
		this.nodes = document.createElement("div");

		// Add button
		var button = document.createElement("h3");
		button.innerHTML = "+ADD"
		div.appendChild(button);
		out.appendChild(this.nodes);

		// Title
		var title = document.createElement("h3");
		title.innerHTML = "Binarizer"
		node.appendChild(title);

		// Separator
		node.appendChild(document.createElement("hr"));

		// Red
		var row = document.createElement("p")
		node.appendChild(row);

		var input = document.createElement("input")
		input.type = "checkbox"
		input.checked = true;
		row.appendChild(input);

		var label = document.createElement("label")
		label.innerHTML = "red"
		row.appendChild(label);

		// Green
		var row = document.createElement("p")
		node.appendChild(row);

		var input = document.createElement("input")
		input.type = "checkbox"
		input.checked = true;
		row.appendChild(input);

		var label = document.createElement("label")
		label.innerHTML = "green"
		row.appendChild(label);

		// Blue
		var row = document.createElement("p")
		node.appendChild(row);

		var input = document.createElement("input")
		input.type = "checkbox"
		input.checked = true;
		row.appendChild(input);

		var label = document.createElement("label")
		label.innerHTML = "blue"
		row.appendChild(label);

		// Alpha
		var row = document.createElement("p")
		node.appendChild(row);

		var input = document.createElement("input")
		input.type = "checkbox"
		input.checked = true;
		row.appendChild(input);

		var label = document.createElement("label")
		label.innerHTML = "alpha"
		row.appendChild(label);

	}
}

class Canvas extends Node
{
	static items = {"Binarizer" : BinarizerNode}
	context = null;
	nodes = null;

	constructor(id, width = 100, height = 100)
	{
		super();

		var editor = document.querySelector("#" + id);
 
 		// Block
 		this.widget = document.createElement("div")
 		editor.appendChild(this.widget);

 		// Node
		var node = document.createElement("div")
		node.classList.add("node", "orange");
		this.widget.appendChild(node);

		// Output
		var out = document.createElement("div")
		out.classList.add("node-out");
		this.widget.appendChild(out);

		var div = document.createElement("div")
		div.classList.add("add-button")
		div.onclick = () =>
		{
			this.addNode(new BinarizerNode())
		}
		out.appendChild(div);

		// Nodes list 
		/*var select = document.createElement("select");
		for(var i in Canvas.items)
		{
			var option = document.createElement("option");
			option.innerHTML = i;
			select.appendChild(option);
		}
		div.appendChild(select);*/

		// Nodes
		this.nodes = document.createElement("div");

		// Add button
		var button = document.createElement("h3");
		button.innerHTML = "+ADD"
		div.appendChild(button);
		out.appendChild(this.nodes);
		

		// Title
		var title = document.createElement("h3");
		title.innerHTML = "Canvas"
		node.appendChild(title);

		// Separator
		node.appendChild(document.createElement("hr"));

		// Canvas
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", width);
		canvas.setAttribute("height", height);
		canvas.innerHTML = "Error"
		node.appendChild(canvas);
		//this.context = this.widget.getContext('2d');

		// Width
		var input = document.createElement("input");
		input.type = "number";
		input.value = width;
		input.onchange = function()
		{
			canvas.setAttribute("width", this.value);
		}
		node.appendChild(input);

		// Height
		var input = document.createElement("input");
		input.type = "number";
		input.value = height;
		input.onchange = function()
		{
			canvas.setAttribute("height", this.value);
		}
		node.appendChild(input);

		// Background color
		var bg = document.createElement("div");
		bg.style.textAlign = "center"

		var label = document.createElement("label");
		label.innerHTML = "BG color: "
		bg.appendChild(label);

		var input = document.createElement("input");
		input.type = "color"
		input.value = "#ffffff"
		input.onchange = function()
		{
			canvas.style.backgroundColor = this.value;
		}
		bg.appendChild(input);
		node.appendChild(bg);

		var button = document.createElement("button");
		button.innerHTML = "Forward ->"
		node.appendChild(button);
	}
}