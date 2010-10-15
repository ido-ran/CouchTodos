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

/**
Store the document revisions of CouchDB.
*/
	_docsRev: null,
	
	_dbpath: 'todos',

	 getServerPath: function(resourceName) {
	   var path = '/' + this._dbpath + "/" + resourceName;
	   return path;
	 },
	
	getServerView: function(viewName) {
		var path = '/' + this._dbpath + "/_design/app/_view/" + viewName;
		return path;
	},

  // ..........................................................
  // QUERY SUPPORT
  // 

  fetch: function(store, query) {
	
	if (this._docsRev == null) {
		this._docsRev = {};
	}
	
	if (query === Todos.TASKS_QUERY) {
		SC.Request.getUrl(this.getServerView('allTasks')).json()
		          .header('Accept', 'application/json')
		          .notify(this, 'didFetchTasks', store, query)
		          .send();
		
		return YES;
	}

    return NO ; // return YES if you handled the query
  },

  didFetchTasks: function(response, store, query) {
      if(SC.ok(response)) {
		var body = response.get('encodedBody');
		var couchResponse = SC.json.decode(body);
		var records = couchResponse.rows.getEach('value');

         store.loadRecords(Todos.Task, records);
         store.dataSourceDidFetchQuery(query);
      } else {
         store.dataSourceDidErrorQuery(query, response);
      }
    },  


  // ..........................................................
  // RECORD SUPPORT
  // 
  
  retrieveRecord: function(store, storeKey) {
    
	if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
		var id = store.idFor(storeKey);
		throw "Not Implemented Yet";
		/*$.ajax({
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
		});*/
		
		return YES;
	}
    
    return NO ; // return YES if you handled the storeKey
  },
  
  createRecord: function(store, storeKey) {
	
	if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
		SC.Request.postUrl(this.getServerPath('/')).json()
		           .header('Accept', 'application/json')
		           .notify(this, this.didCreateTask, store, storeKey)
		           .send(store.readDataHash(storeKey));

		return YES;
    }
    
    return NO ; // return YES if you handled the storeKey
  },
  
  didCreateTask: function(response, store, storeKey) {
     if (SC.ok(response)) {
		var body = response.get('encodedBody'); 
		var couchResponse = SC.json.decode(body);
		var id = couchResponse.id;
		var rev = couchResponse.rev;
        store.dataSourceDidComplete(storeKey, null, id); // update id to url
		this._docsRev[id] = rev;
     } else {
        store.dataSourceDidError(storeKey, response);
     }
  },

  updateRecord: function(store, storeKey) {
    
  if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
	var id = store.idFor(storeKey);
    var dataHash = store.readDataHash(storeKey);
	dataHash["_rev"] = this._docsRev[id];	
	console.log(dataHash);
     SC.Request.putUrl(this.getServerPath('/')+'/'+id).json()
               .header('Accept', 'application/json')
               .notify(this, this.didUpdateTask, store, storeKey)
               .send(dataHash);
     return YES;
   }
   return NO;
 },
 didUpdateTask: function(response, store, storeKey) {
   if (SC.ok(response)) {
     var data = response.get('body');
     if (data)
       data = data.content; // if hash is returned; use it.
     store.dataSourceDidComplete(storeKey, null) ;
   } else {
     store.dataSourceDidError(storeKey);
   }
 },
  
  destroyRecord: function(store, storeKey) {
    
	console.log('destroy was here');
    
    return NO ; // return YES if you handled the storeKey
  }
  
}) ;
