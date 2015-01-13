window.onload = function (){
}

function editJourney(id){
	var xmlhttp;
	xmlhttp=new XMLHttpRequest();
    var name =encodeURIComponent(document.getElementById('newjourney_name').value)
    console.log(name);
    var start=encodeURIComponent(document.getElementById('newjourney_start').value)
    var end =encodeURIComponent(document.getElementById('newjourney_end').value)
    var country=encodeURIComponent(document.getElementById('newjourney_country').value)
    var summary =encodeURIComponent(document.getElementById('newjourney_summary').value)
    var image=encodeURIComponent(document.getElementById('newjourney_image').value)
    url=id+".json?name=" + name + "&start=" + start + "&end=" + end + "&country=" + country + "&summary=" + summary + "&image=" + image;
    xmlhttp.open('PUT',url,true);		
	// TODO: disable "relevant" buttons
	xmlhttp.onreadystatechange=function(){
  		if (xmlhttp.readyState==4){
  			if (xmlhttp.status==200){
				// TODO: enable "relevant" buttons again
                alert("The Journey was edited correctly");
				window.open("/journey/all.html","_self");			
            }else{
				debug("Error from the web service for action "+action+": "+xmlhttp.status+": "+xmlhttp.responseText)
			}
    	}
  	}

	xmlhttp.send();
    
}