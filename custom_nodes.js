class RunNode extends Node
{
	constructor(x = 0, y = 0)
	{
		super("Пуск", x, y, [new OutputSocket("start")], "#fdad5c")

		this.button = new Button("Пуск", {"className" : "controll-button green"})
		this.addWidget(this.button.widget)
		this.button.addEvent("click", () =>
		{
			this.getOutputSocket("start").forward()
		})
	}
}

class ArrayNode extends Node
{
	arr = []

	constructor(x = 0, y = 0)
	{
		super("Массив", x, y, [new InputSocket("start"), new OutputSocket("array")], "pink")

		this.block = new Block({}, {"border" : "1px solid black", "white-space" : "nowrap", "background" : "white", "height" : "80px", "overflow" : "auto"})
		this.addWidget(this.block.widget)


		this.addWidget(Separator.element())

		this.panel = new Block()
		this.addWidget(this.panel.widget)

		this.panel.addWidget(new Label("Размер: "))
		this.count_input = this.panel.addWidget(new Input({"value" : 5, "type" : "number"}, {"width" : "60px"}))
		this.count_input.addEvent("change", () =>
		{
			this.reset(this.count_input.getValue())
		})

		this.addWidget(Separator.element())

		let run_button = new Button("Старт")
		this.addWidget(run_button.widget)
		run_button.addEvent("click", () => {this.forward()})

		this.reset(this.count_input.getValue())
	}

	getData()
	{
		let data = []
		for(let i in this.arr)
		{
			data.push(Number(this.arr[i].getValue()))
		}

		return data
	}

	reset(count)
	{
		this.block.setText("")
		this.arr = []

		for(let i=0; i<count; i++)
		{
			this.block.addWidget(new Label(i + 1 + ": ", {}, {"padding-left" : "5px"}))
			let input = this.block.addWidget(new Input({"value" : 0, "type" : "number"}, { "width" : "80px"}))
			this.block.addWidget(new Break())

			this.arr.push(input)
		}
	}

	forward()
	{
		let data = this.getData()

		if(data)
		{
			let array_socket = this.getOutputSocket("array")
			array_socket.setValue(data)
			array_socket.forward()

			return true
		}
		else
		{
			return false
		}
	}
}

class ConsoleNode extends Node
{
	constructor(x = 0, y = 0)
	{
		super("Консоль", x, y, [new InputSocket("data")], "lightblue")

		this.panel = new Block()
		this.addWidget(this.panel.widget)

		this.panel.addWidget(new Label("Ширина: "))
		this.width_input = this.panel.addWidget(new Input({"type" : "number", "value" : 20}, { "width" : "60px"}))
		this.width_input.addEvent("change", () =>
		{
			this.text.setProperty("cols", this.width_input.getValue())
		})

		this.panel.addWidget(new Break())

		this.panel.addWidget(new Label("Высота: "))
		this.height_input = this.panel.addWidget(new Input({"type" : "number", "value" : 3}, {"width" : "60px"}))
		this.height_input.addEvent("change", () =>
		{
			this.text.setProperty("rows", this.height_input.getValue())
		})

		this.addWidget(Separator.element())

		this.text = new Text("", {"rows" : 3, "cols" : 20}, {"background-color" : "black", "color" : "white", "resize" : "none"})
		this.addWidget(this.text.widget)
	}

	forward()
	{
		let data = this.getInputSocket("data")
		if(data.value)
		{
			this.text.setText(JSON.stringify(data.value))
			return true
		}
		else
		{
			return false
		}
	}
}

class ArrayScalingNode extends Node
{
	constructor(x = 0, y = 0)
	{
		super("Масштаб массива", x, y, [new InputSocket("array"), new OutputSocket("array")], "lightgreen")

		let lab = new Label("Размер: ")
		this.addWidget(lab.widget)

		this.size_input = new Input({"value" : 5, "type" : "number"}, {"width" : "60px"})
		this.addWidget(this.size_input.widget)
	}

	forward()
	{
		let input = this.getInputSocket("array")
		let output = this.getOutputSocket("array")

		let size = this.size_input.getValue()
		let arr = input.getValue()
		let new_arr = []

		if(arr.length > size)
		{
			let part = arr.length - size + 1

			for(let i=0; i<size; i++)
			{
				let value = 0
				for(let j=0; j<part; j++)
				{
					value += arr[i+j]
				}
				value /= part;
				new_arr.push(value)
			}
		}
		else
		{
			new_arr = arr
		}

		output.setValue(new_arr)
		output.forward()
	}
}

class ColorConverterNode extends Node
{
	constructor(x = 0, y = 0)
	{
		super("Конвертер цветов", x, y, [new InputSocket("matrix"), new OutputSocket("matrix")], "lightgreen")

		this.items = new Combobox({}, {}, {"width" : "100%"})

		for(let key in cv)
		{
			if(key.includes("COLOR_"))
			{
				this.items.addItem(key.replace("COLOR_", ""), cv[key])
			}
		}

		this.addWidget(this.items.widget)
	}

	forward()
	{
		let input = this.getInputSocket("matrix")
		let output = this.getOutputSocket("matrix")

		if(input.value)
		{
			let converter = parseInt(this.items.widget.value)
			let result = new cv.Mat();
			cv.cvtColor(input.value, result, converter, 0)
			output.setValue(result)
			output.forward()

			return true
		}

		return false
	}
}

class ImageInputNode extends Node
{
	constructor(x = 0, y = 0)
	{
		super("Изображение", x, y, [new InputSocket("start"), new OutputSocket("matrix")], "pink")

		this.addWidget(Separator.element())

		let lab = new Label("Загрузить", {"htmlFor" : "image-file"}, {"padding-left" : "10px", "padding-right" : "10px", "border" : "2px dashed black", "margin" : "auto", "display" : "block", "cursor" : "pointer", "text-align" : "center"})
		this.addWidget(lab.widget)

		this.file_input = new Input({"type" : "file", "id" : "image-file"}, {"display" : "none"})
		this.addWidget(this.file_input.widget)
		this.file_input.addEvent("change", (e) =>
		{
			let reader = new FileReader()
			reader.onload = () =>
			{
				this.img.setProperty("src", reader.result)

				let img = new Image()
				img.src = reader.result
				img.onload = () =>
				{
					this.value = cv.imread(img)
					this.parent.draw()
				}
			}
			reader.readAsDataURL(e.target.files[0])
		})

		this.addWidget(Separator.element())

		this.img = new Img("", {}, {"width" : "200px"})
		this.addWidget(this.img.widget)
	}

	forward()
	{
		let matrix_socket = this.getOutputSocket("matrix")

		if (this.value)
		{
			matrix_socket.setValue(this.value)
			matrix_socket.forward()
			return true
		}

		alert("Image not loaded!")
		return false
	}
}

class ImageOutputNode extends Node
{
	constructor(x = 0, y = 0)
	{
		super("Изображение Выход", x, y, [new InputSocket("matrix")], "lightblue")

		this.addWidget(Separator.element())

		this.img = new Img("", {}, {"width" : "200px"})
		this.addWidget(this.img.widget)

		this.id = "canv"+Math.random()
		this.canvas = new Canvas({"id" : this.id}, {"display" : "none"})
		this.addWidget(this.canvas.widget)
	}

	forward()
	{
		let matrix_socket = this.getInputSocket("matrix")
		if (matrix_socket.value)
		{
			cv.imshow(this.id, matrix_socket.value)
			let url = this.canvas.widget.toDataURL("png")
			this.img.widget.src = url

			return true
		}

		return false
	}
}

class ColorRangeNode extends Node
{
	constructor(x = 0, y = 0)
	{
		super("Диапазон цветов", x, y, [new InputSocket("matrix"), new OutputSocket("matrix")], "lightblue")

		this.addWidget(Separator.element())

		this.channal_one = new DoubleRange(0, 255, {}, {"margin" : "5px"})
		this.addWidget(this.channal_one.widget)

		this.channal_two = new DoubleRange(0, 255, {}, {"margin" : "5px"})
		this.addWidget(this.channal_two.widget)

		this.channal_three = new DoubleRange(0, 255, {}, {"margin" : "5px"})
		this.addWidget(this.channal_three.widget)

		this.channal_four = new DoubleRange(0, 255, {}, {"margin" : "5px"})
		this.addWidget(this.channal_four.widget)
	}

	forward()
	{
		let input_socket = this.getInputSocket("matrix")
		let output_socket = this.getOutputSocket("matrix")

		let value = input_socket.value
		if (value)
		{
			let ch_1 = this.channal_one.getValues()
			let ch_2 = this.channal_two.getValues()
			let ch_3 = this.channal_three.getValues()
			let ch_4 = this.channal_four.getValues()

			let low = new cv.Mat(value.rows, value.cols, value.type(), [ch_1[0], ch_2[0], ch_3[0], ch_4[0]]);
			let high = new cv.Mat(value.rows, value.cols, value.type(), [ch_1[1], ch_2[1], ch_3[1], ch_4[1]]);
			let result = new cv.Mat();

			cv.inRange(value, low, high, result)

			output_socket.setValue(result)
			output_socket.forward()
		}
	}
}
