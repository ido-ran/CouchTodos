// ==========================================================================
// Project:   Todos.Task
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Todos */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Todos.Task = SC.Record.extend(
/** @scope Todos.Task.prototype */ {

	primaryKey: "_id",

	isDone: SC.Record.attr(Boolean),
	description: SC.Record.attr(String),
	projectCode: SC.Record.attr(String),

	project: SC.Record.toOne("Todos.Project", {
		inverse: "tasks", isMaster: NO
	}),
	
	 isTask: function(){return YES;},

	// TreeView related properties.
	// In better world it will be a mixin or someone else, not in the model.
	treeItemIsExpanded: NO,

	 treeItemChildren: function(){
	    return null;
	 }.property('guid').cacheable(),

	 name: function(){
	    return this.get("description");
	 }.property('description').cacheable(),

}) ;
