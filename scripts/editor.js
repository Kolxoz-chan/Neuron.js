class Editor
{
	static widget = null;

	static init(selector)
	{
		Editor.widget = document.querySelector(selector);
	}

	static showNodesList(show, node=null, list=[])
	{
		var nodes = document.querySelector("#nodes-list")
		nodes.style.display = show ? "block" : "none";
		var div = nodes.querySelector(".tools");
		div.innerHTML = ""

		for(let i in list)
		{
			var button = document.createElement("button");
			button.style.backgroundColor = list[i].color
			button.onclick = () =>
			{
				Editor.showNodesList(false)
				node.addNode(new list[i]())
			}
			div.appendChild(button)

			var title = document.createElement("h3");
			title.innerHTML = list[i].name
			button.appendChild(title)
		}
	}
}
