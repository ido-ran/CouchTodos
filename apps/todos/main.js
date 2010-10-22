// ==========================================================================
// Project:   Todos
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Todos */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
Todos.main = function main() {

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.  
  Todos.getPath('mainPage.mainPane').append() ;

	//var query = SC.Query.local(Todos.Task, { orderBy: 'isDone, description'});
	var query = Todos.TASKS_QUERY;
	var tasks = Todos.store.find(query);
	Todos.tasksArrayController.set('content', tasks);
	
	Todos.projectsTreeController.populate();
} ;

function main() { Todos.main(); }
