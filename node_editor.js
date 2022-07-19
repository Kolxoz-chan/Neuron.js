class NodeEditor
{
	active_node = null
	nodes = []
	context = null
	current_socket = null

	constructor(id, width=640, height=480)
	{
		// Widget  --------------------------------------------------------- //
		this.widget = document.getElementById(id)
		this.widget.onmouseup = (e) =>
		{
			this.active_node = null
		}

		this.widget.onmousemove = (e) =>
		{
			if(this.active_node)
			{
				this.active_node.style.left = this.active_node.offsetLeft + e.movementX + "px";
    			this.active_node.style.top = this.active_node.offsetTop  + e.movementY + "px";

				this.draw()
			}
		}

		// Canvas panel ----------------------------------------------------- //
		this.canvas = document.createElement("canvas")
		this.canvas.className = "node-canvas"
		this.canvas.width = width
		this.canvas.height = height
		this.widget.appendChild(this.canvas)

		this.context = this.canvas.getContext("2d")

		// Controll panel --------------------------------------------------- //
		this.panel = document.createElement("div")
		this.panel.className = "controll-panel"
		this.panel.style.width = "200px"
		this.widget.appendChild(this.panel)

		let rub_button = document.createElement("button")
		rub_button.innerHTML = "Старт"
		rub_button.className = "controll-button green"
		this.panel.appendChild(rub_button)
		rub_button.onclick = () =>
		{
			this.run()
		}
	}

	run()
	{
		for(let i in this.nodes)
		{
			let node = this.nodes[i]
			console.log(node.forward())
		}
	}

	draw()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
		for(let i in this.nodes)
		{
			this.nodes[i].draw(this)
		}
	}

	setActiveNode(node)
	{
		this.active_node = node.widget
	}

	addNode(node)
	{
		node.parent = this
		this.nodes.push(node)
		this.widget.appendChild(node.widget)
		node.widget.onmousedown = (e) =>
		{
			editor.setActiveNode(node)
		}
		return node
	}

	deleteNode(node)
	{
		node.unjoin()
		let index = this.nodes.indexOf(this)
		this.nodes.splice(index, 1)
		node.widget.remove()
		this.draw()
	}
}

class Node
{
	activated = false
	value = null
	parent = null
	inputs = {}
	outputs = {}

	constructor(name, x=0, y=0, sockets=[], color="cyan")
	{
		this.widget = document.createElement("div")
		this.widget.className = "node"
		this.widget.style.top = y + "px"
		this.widget.style.left = x + "px"
		this.widget.style.backgroundColor = color

		let header = document.createElement("div")
		this.widget.appendChild(header)

		let title = document.createElement("label")
		title.innerHTML = name
		header.appendChild(title)

		this.widget.appendChild(document.createElement("hr"))

		let button = document.createElement("label")
		button.innerHTML = "&#10060;"
		button.style.position = "absolute"
		button.style.right = "5px"
		button.style.fontSize = "8pt"
		button.style.cursor = "pointer"
		button.onclick = () =>
		{
			this.parent.deleteNode(this)
			return false
		}
		header.appendChild(button)

		this.node_inputs = document.createElement("div")
		this.node_inputs.className = "node-inputs"
		this.widget.appendChild(this.node_inputs)

		this.node_content = document.createElement("div")
		this.node_content.className = "node-content"
		this.widget.appendChild(this.node_content)

		this.node_outputs = document.createElement("div")
		this.node_outputs.className = "node-outputs"
		this.node_outputs.align = "right"
		this.widget.appendChild(this.node_outputs)

		for(let i in sockets)
		{
			let socket = sockets[i]
			socket.parent = this

			if (socket.type == "input")
			{
				this.inputs[socket.name] = socket
				this.node_inputs.appendChild(socket.widget)
			}

			if (socket.type == "output")
			{
				this.outputs[socket.name] = socket
				this.node_outputs.appendChild(socket.widget)
			}
		}
	}

	activate()
	{
		if(!this.activated)
		{
			this.activated = true

			return this.forward()
		} 
	}

	addWidget(widget)
	{
		this.node_content.appendChild(widget)
	}

	join(node, output, input)
	{
		let out_socket = this.getOutputSocket(output)
		let in_socket = node.getInputSocket(input)

		out_socket.addOutput(in_socket)
		in_socket.setInput(out_socket)
	}

	unjoin()
	{
		for(let i in this.inputs)
		{
			this.inputs[i].unjoin()
		}

		for(let i in this.outputs)
		{
			this.outputs[i].unjoin()
		}
	}

	getOutputSocket(name)
	{
		return this.outputs[name]
	}

	getInputSocket(name)
	{
		return this.inputs[name]
	}

	forward()
	{
		// Abstract method
	}

	draw(editor)
	{
		for(let i in this.outputs)
		{
			let socket = this.outputs[i]
			let A = socket.getPosition()
			A.x -= editor.widget.offsetLeft
			A.y -= editor.widget.offsetTop

			for(let j in socket.outputs)
			{
				let out = socket.outputs[j]
				let B = out.getPosition()
				B.x -= editor.widget.offsetLeft
				B.y -= editor.widget.offsetTop

				editor.context.lineWidth = 2
				editor.context.beginPath();
			    editor.context.moveTo(A.x, A.y);
			    editor.context.bezierCurveTo(A.x + 50, A.y, B.x - 50, B.y, B.x, B.y);
			    editor.context.stroke();
			}
		}
	}
}

class Socket
{
	parent = null
	value = null

	constructor(name, color="yellow")
	{
		this.name = name

		this.widget = document.createElement("div")

		this.label = document.createElement("label")
		this.label.style = "margin-left: 5px; margin-right: 5px;"
		this.label.innerHTML = name

		this.icon = document.createElement("div")
		this.icon.className = "node-socket"
		this.icon.style.backgroundColor = color
		this.icon.onclick = () =>
		{
			let editor = this.parent.parent
			let curr_sock = editor.current_socket

			if(curr_sock)
			{
				if(curr_sock.type != this.type && curr_sock.parent != this.parent)
				{
					this.join(curr_sock)
					editor.draw()
					editor.current_socket = null
					return
				}
			}
			editor.current_socket = this
		}
		this.icon.oncontextmenu = () =>
		{
			this.unjoin()
			editor.draw()
			editor.current_socket = null
			return false
		}
	}

	setValue(val)
	{
		this.value = val
	}

	getValue()
	{
		return this.value
	}

	getPosition()
	{
		let widget = this.icon
		let x = widget.offsetWidth / 2
		let y = widget.offsetHeight / 2

		do
		{
	        x += widget.offsetLeft;
	        y += widget.offsetTop;

	        widget = widget.offsetParent;
	  	}
	  	while(widget)

		return {"x" : x, "y" : y};
	}

	forward()
	{
		if(this.outputs)
		{
			for(let i in this.outputs)
			{
				this.outputs[i].setValue(this.value)
			}
		}
	}
}

class InputSocket extends Socket
{
	input = null
	type = "input"

	constructor(name, color="yellow")
	{
		super(name, color)

		this.widget.appendChild(this.icon)
		this.widget.appendChild(this.label)

	}

	setInput(value)
	{
		this.input = value
	}

	join(socket)
	{
		this.unjoin()
		socket.parent.join(this.parent, socket.name, this.name)
	}

	unjoin()
	{
		if (this.input)
		{
			let index = this.input.outputs.indexOf(this)
			if(index >= 0)
			{
				this.input.outputs.splice(index,1)
				this.input = null
			}
		}
	}
}

class OutputSocket extends Socket
{
	outputs = []
	type = "output"

	constructor(name, color="yellow")
	{
		super(name, color)

		this.widget.appendChild(this.label)
		this.widget.appendChild(this.icon)
	}

	addOutput(value)
	{
		this.outputs.push(value)
	}

	join(socket)
	{
		socket.unjoin()
		this.parent.join(socket.parent, this.name, socket.name)
	}

	unjoin()
	{
		for(let i in this.outputs)
		{
			let out = this.outputs[i]
			out.input = null
		}
		this.outputs = []
	}
}
