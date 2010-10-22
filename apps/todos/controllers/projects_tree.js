// ==========================================================================
// Project:   Todos.projectsTreeController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Todos */

/** @class

  (Document Your Controller Here)

  @extends SC.TreeController
*/
Todos.projectsTreeController = SC.TreeController.create(
/** @scope Todos.projectsTreeController.prototype */ {

	populate: function() {
		var rootNode = SC.Object.create({
			treeItemIsExpanded: YES,
			name: "root",
			treeItemChildren: function() {
				var projectQuery = Todos.PROJECTS_QUERY;
				var projects = Todos.store.find(projectQuery);
				return projects;
			}.property()
		});
		this.set('content', rootNode);
	},

}) ;
