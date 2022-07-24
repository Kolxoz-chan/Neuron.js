class Widget
{
	constructor(tag, text = "", props = {}, styles = {})
	{
		this.widget = document.createElement(tag)
		this.widget.innerHTML = text
		for(let name in props)
		{
			this.widget[name] = props[name]
		}

		for(let name in styles)
		{
			this.widget.style[name] = styles[name]
		}
	}

	addWidget(obj)
	{
		this.widget.appendChild(obj.widget)
		return obj
	}

	addEvent(name, func)
	{
		$(this.widget).on(name, func)
	}

	setText(text)
	{
		this.widget.innerHTML = text
	}

	remove()
	{
		this.widget.remove()
	}

	setProperty(key, value)
	{
		this.widget[key] = value
	}

	setStyle(key, value)
	{
		this.widget.style[key] = value
	}

	getProperty(name)
	{
		return this.widget[name]
	}

	static create()
	{
		return new this.prototype.constructor(arguments)
	}

	static element()
	{
		let obj = new this.prototype.constructor(arguments)
		return obj.widget
	}
}

class Block extends Widget
{
	constructor(props = {}, styles = {})
	{
		super("div", "", props, styles)
	}
}

class Label extends Widget
{
	constructor(text, props = {}, styles = {})
	{
		super("label", text, props, styles)
	}
}

class Input extends Widget
{
	constructor(value, props = {}, styles = {})
	{
		props.value = value
		super("input", "", props, styles)
	}

	getValue()
	{
		return this.widget.value
	}

	setValue(val)
	{
		this.widget.value = val
	}
}

class Text extends Widget
{
	constructor(text, props = {}, styles = {})
	{
		super("textarea", text, props, styles)
	}
}

class Button extends Widget
{
	constructor(text, props = {}, styles = {})
	{
		super("button", text, props, styles)
	}
}

class Separator extends Widget
{
	constructor(props = {}, styles = {})
	{
		super("hr", "", props, styles)
	}
}

class Break extends Widget
{
	constructor(props = {}, styles = {})
	{
		super("br", "", props, styles)
	}
}

class Combobox extends Widget
{
	constructor(list = {}, props = {}, styles = {})
	{
		super("select", "", props, styles)

		for(let key in list)
		{
			this.addItem(key, list[key])
		}
	}

	addItem(key, value)
	{
		var item = document.createElement("option")
		item.value = value
		item.innerHTML = key

		this.widget.appendChild(item)
	}
}

class Link extends Widget
{
	constructor(text, href, props = {}, styles = {})
	{
		props.href = href
		super("a", text, props, styles)
	}
}

class Img extends Widget
{
	constructor(src, props = {}, styles = {})
	{
		props.src = src
		super("img", "", props, styles)
	}
}

class DoubleRange extends Widget
{
	constructor(min, max, props = {}, styles = {})
	{
		super("div", "", props, styles)

		$(this.widget).slider(
		{
	      range: true,
	      min: min,
	      max: max,
	      values: [ min, max ]
	    })
	    .width(200)

			$(this.widget)
			.children(".ui-slider-handle")
			.css("width", "5px")
			.css("transform", "translateX(100%)")
	}

	getValues()
	{
		return $(this.widget).slider("values");
	}
}

class Canvas extends Widget
{
	constructor(props = {}, styles = {})
	{
		super("canvas", "", props, styles)
		this.context = this.widget.getContext("2d")
	}

	getData()
	{
		return this.context.getImageData(0, 0, this.widget.width, this.widget.height)
	}
}
