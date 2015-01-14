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

        if (name != ""){
            url="create.json?name=" + name + "&start=" + start + "&end=" + end + "&country=" + country + "&summary=" + summary + "&image=" + image;
            xmlhttp.open('POST',url,true);

            xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4){
                if (xmlhttp.status==200){
                    // TODO: enable "relevant" buttons again
                    alert("The Journey was created correctly");
                    window.open("/journey/all.html","_self");
                }else{
                    alert("Error from the web service for action "+xmlhttp.status+": "+xmlhttp.responseText)
                }
            }
        }

        xmlhttp.send();
        }else{
            alert("Please add a Name to this Journey");   
        }
    }else{
        
    }


}

function previewFile(){
    if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.

       var preview = document.getElementById("img_newjourney"); //selects the query named img
       var file    = document.querySelector('input[type=file]').files[0]; //sames as here
       var reader  = new FileReader();

       reader.onload = function (e) {
           preview.src = reader.result;
           alert(reader.result);
   }
       
       

       if (file) {
           reader.readAsDataURL(file); //reads the data as a URL
       } else {
           preview.src = "";
       }
    }else {
        alert('The File APIs are not fully supported in this browser.');
}
}