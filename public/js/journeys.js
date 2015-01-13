window.onload = function (){
    
}

function deleteJourney(id){
    var xmlhttp;
	xmlhttp=new XMLHttpRequest();
    url=id+".json" 
    xmlhttp.open('DELETE',url,true);
	// TODO: disable "relevant" buttons
	xmlhttp.onreadystatechange=function(){
  		if (xmlhttp.readyState==4){
  			if (xmlhttp.status==200){
				// TODO: enable "relevant" buttons again
                alert("The Journey was deleted correctly");
				location.reload();
			}else{
				debug("Error from the web service for action "+action+": "+xmlhttp.status+": "+xmlhttp.responseText)
			}
    	}
  	}

	xmlhttp.send();
}

function updateJourney(id){
    window.open("/journey/edit/"+id+".html","_self");
}