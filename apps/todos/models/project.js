// ==========================================================================
// Project:   Todos.Project
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Todos */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Todos.Project = SC.Record.extend(
/** @scope Todos.Project.prototype */ {

	primaryKey: "_id",

	name: SC.Record.attr(String),
	description: SC.Record.attr(String),
	
	tasks: SC.Record.toMany("Todos.Task", {
		inverse: "project", isMaster: YES
	}),
	
	isProject: function(){return YES;},
	

	// TreeView related properties.
	// In better world it will be a mixin or someone else, not in the model.
	treeItemIsExpanded: NO,

	treeItemChildren: function(){
	   return this.get("tasks");
	}.property(),

}) ;
