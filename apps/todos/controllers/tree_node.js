// ==========================================================================
// Project:   Todos.treeNodeController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Todos */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Todos.treeNodeController = SC.ObjectController.create(
/** @scope Todos.treeNodeController.prototype */ {

	projectName: null,

	contentBinding: SC.Binding.single('Todos.projectsTreeController.selection'),
	
	observeContent: function() {
		var record = this.get('content');
		if (record.isTask) {
			var project = record.get('project');
			var name = project.get('name');
			this.set("projectName", name);
			Todos.tasksArrayController.selectObject(record);
		} else if (record.isProject) {
			var name = record.get("name");
			this.set("projectName", name);
		}
	}.observes("content"),

}) ;
