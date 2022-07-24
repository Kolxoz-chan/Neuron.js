var Module =
{
  'print': function(text) { alert('stdout: ' + text) },
  'printErr': function(text) { alert('stderr: ' + text) },
  'onRuntimeInitialized': function()
  {
    var editor = new NodeEditor("editor", 1000, 600);

		editor.addNode(new RunNode(20, 20))
		editor.addNode(new ColorRangeNode(200, 200))
		editor.addNode(new ImageInputNode(200, 20))
		editor.addNode(new ColorConverterNode(400, 20))
		editor.addNode(new GaussianBlurNode(400, 200))
		editor.addNode(new ImageOutputNode(600, 20))
		editor.addNode(new ColorConverterNode(600, 200))

		editor.draw()
  }
}
