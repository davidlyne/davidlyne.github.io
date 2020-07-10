//creating shortcut for less verbose code
var scorm = pipwerks.SCORM;


function SCORMInit(){
	
	//Specify SCORM 1.2:
	scorm.version = "1.2";
	
	show("Initializing course.");
	
	var callSucceeded = scorm.init();
	
	show("Call succeeded? " +callSucceeded);

}


function SCORMSend(){

	var field = document.getElementById("userText"),
		value = "Placeholder text";
	
	if(field.value !== null && field.value !== ""){
		value = field.value;
	}
	
	set('cmi.suspend_data', value);

}


function SCORMSet(param, value){

	show("Sending: '" +value +"'");

	var callSucceeded = scorm.set(param, value);

	show("Call succeeded? " +callSucceeded);

}


function SCORMGet(param){

	var value = scorm.get(param);

	show("Received: '" +value +"'");

}


function SCORMComplete(){

	show("Setting course status to 'completed'.");

	var callSucceeded = scorm.set("cmi.core.lesson_status", "completed");

	show("Call succeeded? " +callSucceeded);

}


function SCORMEnd(){

	show("Terminating connection.");

	var callSucceeded = scorm.quit();

	show("Call succeeded? " +callSucceeded);

}


function show(msg){
        console.log(msg);
	//Can also show data using pipwerks.UTILS.trace
	pipwerks.UTILS.trace(msg);


}


window.onload = function (){
	SCORMInit();
}

window.onunload = function (){
	SCORMEnd();
}
