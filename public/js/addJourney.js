window.onload = function(){
    loadDOM();
    document.getElementById("addJourney").onclick = function(){
        createJourney();};
}

function createJourney(){
	var xmlhttp;
	xmlhttp=new XMLHttpRequest();
    if (confirm("Are you sure?")){
        var name =encodeURIComponent(document.getElementById('newjourney_name').value)
        var start=encodeURIComponent(document.getElementById('newjourney_start').value)
        var end =encodeURIComponent(document.getElementById('newjourney_end').value)
        var country=encodeURIComponent(document.getElementById('newjourney_country').value)
        var summary =encodeURIComponent(document.getElementById('newjourney_summary').value)
        var image=encodeURIComponent(document.getElementById('newjourney_image').value)
        url="create.json?name=" + name + "&start=" + start + "&end=" + end + "&country=" + country + "&summary=" + summary + "&image=" + image;
        xmlhttp.open('POST',url,true);
    
    	xmlhttp.onreadystatechange=function(){
  		if (xmlhttp.readyState==4){
  			if (xmlhttp.status==200){
				// TODO: enable "relevant" buttons again
				alert("The Journey was created correctly");
				window.open("/journey/all.html","_self");
			}else{
				debug("Error from the web service for action "+action+": "+xmlhttp.status+": "+xmlhttp.responseText)
			}
    	}
  	}

	xmlhttp.send();
    }else{
        
    }


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