// ==========================================================================
// Project:   Todos.TaskDataSource
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Todos */

Todos.TASKS_QUERY = SC.Query.local(Todos.Task, {
	orderBy: 'isDone,description'
});

/** @class

  (Document Your Data Source Here)

  @extends SC.DataSource
*/
Todos.TaskDataSource = SC.DataSource.extend(
/** @scope Todos.TaskDataSource.prototype */ {

  // ..........................................................
  // QUERY SUPPORT
  // 

  fetch: function(store, query) {
	
	if (query === Todos.TASKS_QUERY) {
		$.ajax({
			dataType: "jsonp",
			url: "http://localhost:5984/todos/_design/app/_view/allTasks?callback=?",
			success: function(data, status, xmlhttp) {
				var recs = data.rows.getEach('value');
				console.log(recs);
				store.loadRecords(Todos.Task, recs);
				store.dataSourceDidFetchQuery(query);
			},
			error: function(xmlhttp, textStatus, errorThrown) {
				console.log("error");
				store.dataSourceDidErrorQuery(query, textStatus);
			},
			complete: function(xmlhttp, textStatus) {
				console.log("all done");
			}
		});
		return YES;
	}

    return NO ; // return YES if you handled the query
  },

  // ..........................................................
  // RECORD SUPPORT
  // 
  
  retrieveRecord: function(store, storeKey) {
    
	if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
		var id = store.idFor(storeKey);
		$.ajax({
			dataType: "jsonp",
			url: "http://localhost:5984/todos/_design/app/_view/allTasks?key=%@callback=?".fmt(id),
			success: function(data, status, xmlhttp) {
				var rec = data.rows.getEach('value')[0];
				console.log(recs);
				store.dataSourceDidComplete(storeKey, rec);
			},
			error: function(xmlhttp, textStatus, errorThrown) {
				console.log("error");
				store.dataSourceDidErrorQuery(query, textStatus);
			},
			complete: function(xmlhttp, textStatus) {
				console.log("all done");
			}
		});
		
		return YES;
	}
    
    return NO ; // return YES if you handled the storeKey
  },
  
  createRecord: function(store, storeKey) {
	
	if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
		var rec = store.readDataHash(storeKey);
		$.ajax({
			type: "PUT",
			dataType: "jsonp",
			url: "http://localhost:5984/todos",
			contentType: "application/json",
			data: rec,
			success: function(data, status, xmlhttp) {
				var rec = data.rows.getEach('value')[0];
				console.log(recs);
				store.dataSourceDidComplete(storeKey, rec);
			},
			error: function(xmlhttp, textStatus, errorThrown) {
				console.log("error");
				store.dataSourceDidErrorQuery(query, textStatus);
			}
		});		
		return YES;
    }
    
    return NO ; // return YES if you handled the storeKey
  },
  
  updateRecord: function(store, storeKey) {
    
	console.log('update was here');
    
	return NO ; // return YES if you handled the storeKey
  },
  
  destroyRecord: function(store, storeKey) {
    
	console.log('destroy was here');
    
    return NO ; // return YES if you handled the storeKey
  }
  
}) ;
