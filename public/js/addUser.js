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
                    alert("The User was registed correctly. An email was sended to you to confirm your registration.");
                    window.open("/journey/all.html","_self");
                }else {
                    alert("Error from the web service for action : "+xmlhttp.status+": "+xmlhttp.responseText)
                }
            }
        };
        xmlhttp.send();
    }
}