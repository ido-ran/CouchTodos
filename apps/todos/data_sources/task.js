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

	_dbpath: 'todos',

	 getServerPath: function(resourceName) {
	   var path = '/' + this._dbpath + "//" + resourceName;
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
		SC.Request.getUrl(this.getServerPath(id))
		          .header('Accept', 'application/json').json()
		      .notify(this, 'didRetrieveTask', store, storeKey)
		      .send();

		return YES;
	}
    
    return NO ; // return YES if you handled the storeKey
  },

  didRetrieveTask: function(response, store, storeKey) {
    if (SC.ok(response)) {
      var dataHash = response.get('body').content;
      store.dataSourceDidComplete(storeKey, dataHash);

    } else store.dataSourceDidError(storeKey, response);
  }, 

  /**
  Process response from CouchDB of create, update, delete operations.

  @returns id,rev for success, null for failure.
  */
  processResponse: function(response) {
	 if (SC.ok(response)) {
		var body = response.get('encodedBody'); 
		var couchResponse = SC.json.decode(body);
		var ok = couchResponse.ok;
		if (ok != YES) return {"error":true, "response":couchResponse};

		var id = couchResponse.id;
		var rev = couchResponse.rev;
		return {"ok":true, "id": id, "rev": rev};
     } else {
    	return {"error":true, "response":response};
	 }
  },

  /**
  Get the latest revision of the document.
  For docs which were fetch from the server we use _rev field,
  and for docs that were modified we use the local _docsRev dictionary.
  */
  getDocRev: function(doc) {
	return doc._rev;
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
	 var couchRes = this.processResponse(response);
     if (couchRes.ok) {
		// Add _id and _rev to the local document for further server interaction.
		var localDoc = store.readDataHash(storeKey);
		localDoc._id = couchRes.id;
		localDoc._rev = couchRes.rev;
        store.dataSourceDidComplete(storeKey, localDoc, couchRes.id);
     } else {
        store.dataSourceDidError(storeKey, response);
     }
  },

  updateRecord: function(store, storeKey) {
    
  if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
	var id = store.idFor(storeKey);
    var dataHash = store.readDataHash(storeKey);
    SC.Request.putUrl(this.getServerPath(id)).json()
              .header('Accept', 'application/json')
              .notify(this, this.didUpdateTask, store, storeKey)
              .send(dataHash);
     return YES;
   }
   return NO;
 },

 didUpdateTask: function(response, store, storeKey) {
   var couchRes = this.processResponse(response);
   if (couchRes.ok) {
	 // Update the local _rev of this document.
	 var localDoc = store.readDataHash(storeKey);
	 localDoc._rev = couchRes.rev;
     store.dataSourceDidComplete(storeKey, localDoc) ;
   } else {
     store.dataSourceDidError(storeKey);
   }
 },
  
  destroyRecord: function(store, storeKey) {
    
    if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
	  var id = store.idFor(storeKey);
	  //var rev = this._docsRev[id];	
	  var dataHash = store.readDataHash(storeKey);
	  var rev = this.getDocRev(dataHash);
      SC.Request.deleteUrl(this.getServerPath(id + "?rev=" + rev)).json()
                .header('Accept', 'application/json')
                .notify(this, this.didDeleteTask, store, storeKey)
                .send();
       return YES;
     }	
    
     return NO ; // return YES if you handled the storeKey
  },

  didDeleteTask: function(response, store, storeKey) {
	var couchRes = this.processResponse(response);  
	if (couchRes.ok) {
	    store.dataSourceDidDestroy(storeKey);
	  } else {
		store.dataSourceDidError(response);	
	  }
  }
  
}) ;
