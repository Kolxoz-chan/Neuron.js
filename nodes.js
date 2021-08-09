class Node
{
	widget = null;
	prev_layer = null;
	next_layers = [];

	init(name, color)
	{
		this.name = name;
		this.color = color;
	}

	join(layer)
	{
		this.next_layers.push(layer);
		layer.prev_layer = this;
		if(this.onJoin) this.onJoin(layer);
	}

	createTemplate(arr = {})
	{
		// Block
 		this.widget = document.createElement("div")
		this.widget.classList.add("block")

 		// Node
		var node = document.createElement("div")
		node.classList.add("node");
		node.style.backgroundColor = this.constructor.color;
		this.widget.appendChild(node);

		// Output
		var out = document.createElement("div")
		out.classList.add("node-out");
		this.widget.appendChild(out);

		// Nodes
		this.nodes = document.createElement("div");
		out.appendChild(this.nodes);

		var div = document.createElement("button")
		div.innerHTML = "add node"
		div.classList.add("add-button")
		div.onclick = () =>
		{
			Editor.showNodesList(true, this, arr)
		}
		out.appendChild(div);

		// Title
		var title = document.createElement("h3");
		title.innerHTML = this.constructor.name
		node.appendChild(title);

		// Separator
		node.appendChild(document.createElement("hr"));

		return node;
	}

	getWidget()
	{
		return this.widget;
	}

	addNode(obj)
	{
		this.join(obj)
		this.nodes.appendChild(obj.getWidget());
	}
}

class LayerNode extends Node
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

class MatrixCoverterNode extends LayerNode
{
	static name = "In Matrix Converter"
	static color = "yellow"
	width = 0;
	height = 0;

	constructor(width = 100, height = 100, func = null)
	{
		super(width * height)

		this.width = width;
		this.height = height;

		var node = this.createTemplate([MatrixScalerNode])

		// Width
		var input = document.createElement("input");
		input.type = "number";
		input.value = width;
		input.onchange = function()
		{
			this.width = this.value
		}
		node.appendChild(input);

		// Height
		var input = document.createElement("input");
		input.type = "number";
		input.value = height;
		input.onchange = function()
		{
			this.height = this.value
		}
		node.appendChild(input);

	}
} 

class MatrixScalerNode extends LayerNode
{
	static name = "Matrix Scaler"
	static color = "yellow"
	width = 0;
	height = 0;

	constructor(width = 100, height = 100, func = null)
	{
		super(width * height)

		this.width = width;
		this.height = height;

		var node = this.createTemplate([MatrixScalerNode])

		// Width
		var input = document.createElement("input");
		input.type = "number";
		input.value = width;
		input.onchange = function()
		{
			this.width = this.value
		}
		node.appendChild(input);

		// Height
		var input = document.createElement("input");
		input.type = "number";
		input.value = height;
		input.onchange = function()
		{
			this.height = this.value
		}
		node.appendChild(input);

	}
}

class ImageBinarizerNode extends Node
{
	static name = "Image Binarizer"
	static color = "yellow"
	with_alpha = true;

	constructor()
	{
		super();

		var node = this.createTemplate([AutoCutterNode])

		// Alpha
		var row = document.createElement("p")
		node.appendChild(row);

		var input = document.createElement("input")
		input.type = "checkbox"
		input.checked = true;
		input.onchange = () =>
		{
			this.with_alpha = input.checked;
		}
		row.appendChild(input);

		var label = document.createElement("label")
		label.innerHTML = "alpha"
		row.appendChild(label);
	}

	forward(image)
	{
		var result = new Matrix(image.width, image.height);
		for(let i=0; i<image.data.length; i+=4)
		{
			var value = (image.data[i] + image.data[i+2] + image.data[i+2]) / 255;
			if(this.with_alpha) value *= image.data[i+3] / 255;
			if(value > 0) console.log(value)
			result.data.push(value)
		}
		for(let i in this.next_layers)
		{
			this.next_layers[i].forward(result)
		}
		console.log(result)
	}
}

class AutoCutterNode extends Node
{
	static name = "Auto Cutter"
	static color = "yellow"
	with_alpha = true;

	constructor()
	{
		super();

		var node = this.createTemplate([MatrixCoverterNode])

		// Alpha
		var row = document.createElement("p")
		node.appendChild(row);
/*
		var input = document.createElement("input")
		input.type = "checkbox"
		input.checked = true;
		input.onchange() =>
		{
			this.with_alpha = input.checked;
		}
		row.appendChild(input);

		var label = document.createElement("label")
		label.innerHTML = "alpha"
		row.appendChild(label);*/
	}

	forward(matrix)
	{
		var ax = matrix.width;
		var ay = matrix.height;
		var bx = 0;
		var by = 0;

		for(let y=0; y<matrix.height; y++)
		{
			for(let x=0; x<matrix.width; x++)
			{
				if(matrix.getValue(x, y) > 0)
				{
					if(ax > x) ax = x;
					if(ay > y) ay = y;
					if(bx < x) bx = x;
					if(by < y) by = y;
				}
			}
		}

		var result = new Matrix(Math.max(bx-ax, 0), Math.max(by-ay, 0))

		for(let y=ay; y<=by; y++)
		{
			for(let x=ax; x<=bx; x++)
			{
				result.data.push(matrix.getValue(x, y))
			}
		}
		console.log(result)
	}
}

class CanvasNode extends Node
{
	static name = "Canvas"
	static color = "orange"
	context = null;
	nodes = null;

	constructor(width = 100, height = 100)
	{
		super();

		// Node
 		var node = this.createTemplate([ImageBinarizerNode])

		// Canvas
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", width);
		canvas.setAttribute("height", height);
		canvas.innerHTML = "Error"
		node.appendChild(canvas);

		var context = canvas.getContext('2d');
		var mouse = { x:0, y:0};
   		var draw = false;
         
        canvas.addEventListener("mousedown", function(e){
             
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
            draw = true;
            context.beginPath();
            context.moveTo(mouse.x, mouse.y);
        });
        canvas.addEventListener("mousemove", function(e){
             
            if(draw==true){
             
                mouse.x = e.pageX - this.offsetLeft;
                mouse.y = e.pageY - this.offsetTop;
                context.lineTo(mouse.x, mouse.y);
                context.stroke();
            }
        });
        canvas.addEventListener("mouseup", function(e){
             
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
            context.lineTo(mouse.x, mouse.y);
            context.stroke();
            context.closePath();
            draw = false;
        });

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
		button.onclick = () =>
		{
			var arr = context.getImageData(0, 0, canvas.width, canvas.height)
			for(let i in this.next_layers)
			{
				this.next_layers[i].forward(arr)
			}
		}
		node.appendChild(button);
	}
}
