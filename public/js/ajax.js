window.onload = function() 
{
	// set js-action for retriefing the LIST of songs
	document.getElementById('searchButton').onclick = function(){ajaxCall("search");};  // search 
	document.getElementById('getAllButton').onclick = function(){ajaxCall("loadAll");   };	// refresh (=getAll)
	
	// set jsc-action for CRUD-functions: create-read-update-delete a SINGLE song
	document.getElementById('postButton').onclick   = function(){ajaxCall("create");};	// create

	 // refresh the list on startup	
	ajaxCall("loadAll");
}

// helper method: format a single song...
function journeyToHTML(){
	var JourneyHtml = "<li id=\""+journey.id+"\">"
	//aLineOfHtmlForTheSong += "<form>id="+song.id+":" // better hide the id from the user
	JourneyHtml += "<input id=\"journey_"+journey.id+"_name\" type=\"text\" value=\""+journey.name+"\" >"
	JourneyHtml += ": "
	JourneyHtml += "<input id=\"journey_"+journey.id+"_country\" type=\"text\" value=\""+journey.country+"\" >"
	JourneyHtml += "<button id=\"putButton_"+journey.id+"\" >Update</button>"
	JourneyHtml += "<button id=\"deleteButton_"+journey.id+"\" title=\"Delete the Journey "+journey.title+"...\">Delete</button>"
	JourneyHtml += "<button id=\"getButton_"+journey.id+"\">Refresh</button>"
	//aLineOfHtmlForTheSong += "</form>"
	JourneyHtml += "</li>"
	return JourneyHtml
}

function setJavaScriptActionsForButtons(journeys){
	for (var j in journeys){
		var curr_journey=journeys[j]
		console.log("curr-journey: ", curr_journey)
		document.getElementById('putButton_'+curr_journey.id).setAttribute(	'onClick',"javascript:ajaxCall(\"update\","+curr_journey.id+")")	
		document.getElementById('deleteButton_'+curr_journey.id).setAttribute(	'onClick',"javascript:ajaxCall(\"delete\","+curr_journey.id+")")	
		document.getElementById('getButton_'+curr_journey.id).setAttribute(	'onClick',"javascript:ajaxCall(\"refresh\","+curr_journey.id+")")
	}
}

function debug(msg){
	document.getElementById('message').innerHTML = new Date()+": "+ msg+"<br/>"+document.getElementById('message').innerHTML;
}

// for search, loadAll, create we update the list
function updateTheList(xmlhttp,action){
	try {
		journeys=JSON.parse(xmlhttp.responseText)
		if (journey instanceof Array){
			journeyHTML="";
			for (var i in journeys){
				journey=journeys[i]
				journeyHTML += journeyToHTML(journey)
			}
			document.getElementById('listOfJourneys').innerHTML=journeyHTML;
			setJavaScriptActionsForButtons(journeys)	
			debug("INFO: for "+action+" we got: '"+xmlhttp.responseText+"': ");
		}else{
			debug("Error: for "+action+" we did not get a list??: '"+xmlhttp.responseText+"': ");
		}
	}catch(err) {
		debug("Error: for "+action+" we got: '"+xmlhttp.responseText+"': "+err);
	}
	
}
// for update, refresh we update the current item only
function updateSingleItem(xmlhttp,action){
	journey=JSON.parse(xmlhttp.responseText)	
	debug("INFO: for "+action+" we got: '"+xmlhttp.responseText+"': ",journey);
	document.getElementById('journey_'+journey.id+'_name').value = journey.name
	document.getElementById('journey_'+journey.id+'_start').value = journey.start
    document.getElementById('journey_'+journey.id+'_end').value = journey.end
    document.getElementById('journey_'+journey.id+'_country').value = journey.country
    document.getElementById('journey_'+journey.id+'_summary').value = journey.summary
    document.getElementById('journey_'+journey.id+'_image').value = journey.image
}


function updateThePageWithNewData(xmlhttp,action){
	debug("INFO: for "+action+" we update the page now...	");
	if ( (action=='search') || (action=='loadAll') || (action=='create') ){ // update the list
		updateTheList(xmlhttp,action)
	}else if (action=='delete'){
		debug("INFO: for action '"+action+"' we got: '"+xmlhttp.responseText+"'.");
		ajaxCall("loadAll");
	}else{ // update a single line (a single song)
		updateSingleItem(xmlhttp,action)
	}
}

function ajaxCall(action,id){
	debug("Button-Click: action="+action+" for id="+id)
	var xmlhttp;
	xmlhttp=new XMLHttpRequest();
		
	if (action=="search"){
		var searchTerm = encodeURIComponent(document.getElementById('searchterm').value)
		url="search.json?searchterm=" + searchTerm
		xmlhttp.open('get',url,true);
        
	}else if (action=="loadAll"){
		url="all.json"
		xmlhttp.open('get',url,true);
        
	}else if (action=="create"){
		var name =encodeURIComponent(document.getElementById('newjourney_name').value)
		var start=encodeURIComponent(document.getElementById('newjourney_start').value)
        var end =encodeURIComponent(document.getElementById('newjourney_end').value)
		var country=encodeURIComponent(document.getElementById('newjourney_country').value)
        var summary =encodeURIComponent(document.getElementById('newjourney_summary').value)
		var image=encodeURIComponent(document.getElementById('newjourney_image').value)
		url="create.json?name=" + name + "&start=" + start + "&end=" + end + "&country=" + country + "&summary=" + summary + "&image=" + image;
		xmlhttp.open('POST',url,true);
	}else if (action=="update"){
        var name =encodeURIComponent(document.getElementById('journey_'+id+'_name').value)
		var start=encodeURIComponent(document.getElementById('journey_'+id+'_start').value)
        var end =encodeURIComponent(document.getElementById('journey_'+id+'_end').value)
		var country=encodeURIComponent(document.getElementById('journey_'+id+'_country').value)
        var summary =encodeURIComponent(document.getElementById('journey_'+id+'_summary').value)
		var image=encodeURIComponent(document.getElementById('journey_'+id+'_image').value)
		url=id+".json?name=" + name + "&start=" + start + "&end=" + end + "&country=" + country + "&summary=" + summary + "&image=" + image;
		xmlhttp.open('PUT',url,true);		
	}else if (action=="delete"){
		url=id+".json" 
		xmlhttp.open('DELETE',url,true);
	}else if (action=="refresh"){
		url=id+".json"
		xmlhttp.open('GET',url,true);
	}else{
		debug("Error: action '"+action+"' unknown!");
		return;
	}
	// TODO: disable "relevant" buttons
	xmlhttp.onreadystatechange=function(){
  		if (xmlhttp.readyState==4){
  			if (xmlhttp.status==200){
				// TODO: enable "relevant" buttons again
				updateThePageWithNewData(xmlhttp,action)
			}else{
				debug("Error from the web service for action "+action+": "+xmlhttp.status+": "+xmlhttp.responseText)
			}
    	}
  	}

	xmlhttp.send();
    
}

function previewFile(){
       var preview = document.querySelector('img'); //selects the query named img
       var file    = document.querySelector('input[type=file]').files[0]; //sames as here
       var reader  = new FileReader();

       reader.onloadend = function () {
           preview.src = reader.result;
           console.log(reader.result);
       }

       if (file) {
           reader.readAsDataURL(file); //reads the data as a URL
       } else {
           preview.src = "";
       }
}
