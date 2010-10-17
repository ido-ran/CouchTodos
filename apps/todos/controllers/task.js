// ==========================================================================
// Project:   Todos.taskController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Todos */

/** @class

  (Document Your Controller Here)

  @extends SC.ObjectController
*/
Todos.taskController = SC.ObjectController.create(
/** @scope Todos.taskController.prototype */ 

function() {
	
	//Private variables
	var RELATIVE_PATH_TO_FORM = "mainPage.mainPane.middleView.bottomRightView";
	var PATH_TO_FORM = "Todos." + RELATIVE_PATH_TO_FORM;
	var REGEX_MATCH_PROJECT_CODE = /[a-z]{3}-[a-z]{3}/i;
	
	//Private methods
	    var loadForm = function() {
	        return Todos.getPath(RELATIVE_PATH_TO_FORM);
	    }
	    var projectCodeText = function() {
	        return loadForm().get("projectCodeText");
	    } 
	
	
	return { //returns object literal

	contentBinding: SC.Binding.single('Todos.tasksArrayController.selection'),

	isSaveOk: NO,
	projectCodeMessage: "message goes here",
	isProjectCodeMessageOn: NO,


   saveTask: function() {
        var taskRecord = this.get("content");
        if (taskRecord && taskRecord.isRecord && this.validateProjectCodeField()) {
            taskRecord.commitRecord();
		}
    },

	observeRecordState: function() {
		var taskRec = this.get('content');
		if (taskRec && taskRec.isRecord &&
			(taskRec.get('status') === SC.Record.READY_DIRTY ||
			 taskRec.get('status') === SC.Record.READY_NEW)) {
				this.set('isSaveOk', YES);
			} else {
				this.set('isSaveOk', NO);
			}
		this.clearValidationMessages();
	}.observes("*content.status"),
	
	clearValidationMessages: function() {
	        this.set("projectCodeMessage", "");
	        this.set("isProjectCodeMessageOn", NO);                     
	    },

		validateProjectCodeField: function() {
		        var taskRecord = this.get("content");
		        if (!taskRecord || !taskRecord.isRecord) {
		            return YES;
		        }
		        var projectCode = taskRecord.get("projectCode");
		        if (projectCode) {
		            //check to see if the project code matches our regex rule
		            if (!projectCode.match(REGEX_MATCH_PROJECT_CODE)) {
		                this.set("projectCodeMessage", "invalid project code: must be 3 letters dash 3 letters");
		                this.set("isProjectCodeMessageOn", YES);
		                return NO;              
		            } else {
		                this.clearValidationMessages();
		                return YES;
		            }
		        }else {
		               return YES;
		        }      
		    },

		    observeProjectCodeKeyResponder: function() {
		        var component = projectCodeText();
		        //We just left the project code field, let's validate
		        if (component.get("isKeyResponder")==NO) {
		            this.validateProjectCodeField();
		        }
		    }.observes(PATH_TO_FORM + ".projectCodeText.isKeyResponder"),

	}}()
) ;
