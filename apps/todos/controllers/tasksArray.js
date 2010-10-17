// ==========================================================================
// Project:   Todos.tasksArrayController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Todos */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
Todos.tasksArrayController = SC.ArrayController.create(
  SC.CollectionViewDelegate,

/** @scope Todos.tasksArrayController.prototype */ {

	summary: function() {
		var len = this.get('length'), ret;
		
		if (len && len > 0) {
			ret = len === 1 ? "1 task" : "%@ tasks".fmt(len);
		} else ret = "No tasks";
		
		return ret;
	}.property('length').cacheable(),
	

	collectionViewDeleteContent: function(view, content, indexes) {

	    // destroy the records
	    var records = indexes.map(function(idx) {
	      return this.objectAt(idx);
	    }, this);
	    records.invoke('destroy');

	    var selIndex = indexes.get('min')-1;
	    if (selIndex<0) selIndex = 0;
	    this.selectObject(this.objectAt(selIndex));
	  },
	
	addTask: function() {
	    var task;

	    // create a new task in the store
	    task = Todos.store.createRecord(Todos.Task, {
	      "description": "New Task", 
	      "isDone": false
	    });

	    // select new task in UI
	    this.selectObject(task);

	    // activate inline editor once UI can repaint
	    this.invokeLater(function() {
	      var contentIndex = this.indexOf(task);
	      var list = Todos.mainPage.getPath('mainPane.middleView.topLeftView.contentView');
	      var listItem = list.itemViewForContentIndex(contentIndex);
	      listItem.beginEditing();
	    });

	    return YES;
	  },
	
	toggleDone: function() {
		var sel = this.get('selection');
		sel.setEach('isDone', !sel.everyProperty('isDone'));
		return YES;
	}

}) ;
