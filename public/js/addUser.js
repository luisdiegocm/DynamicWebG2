//var crypto = require('crypto');

window.onload = function(){
    loadDOM();
    document.getElementById("addUser").onclick = function(){
        createUser();};
};

function createUser(){
    var xmlhttp;
    xmlhttp=new XMLHttpRequest();
    if (confirm("Are you sure?")){
        var email     = encodeURIComponent(document.getElementById('email').value);
        var user_name = encodeURIComponent(document.getElementById('user_name').value);
        var password  = encodeURIComponent(document.getElementById('password').value);

        url = "create.json?email=" + email + "&user_name=" + user_name + "&password=" + password;
        xmlhttp.open('POST',url,true);

        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState == 4){
                if (xmlhttp.status == 200){
                    // TODO: enable "relevant" buttons again
                    alert("The User was created correctly");
                    window.open("/journey/all.html","_self");
                }else {
                    debug("Error from the web service for action "+action+": "+xmlhttp.status+": "+xmlhttp.responseText)
                }
            }
        };
        xmlhttp.send();
    }
}