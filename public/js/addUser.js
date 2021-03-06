window.onload = function(){
    loadDOM();
    document.getElementById("addUser").onclick = function(){
        createUser();};
    document.getElementById("signIn").onclick = function(){
        signIn();};
};

function createUser(){
    var xmlhttp;
    xmlhttp=new XMLHttpRequest();
    if (confirm("Are you sure?")){
        var email     = encodeURIComponent(document.getElementById('new_email').value);
        var user_name = encodeURIComponent(document.getElementById('new_user_name').value);
        var password  = encodeURIComponent(document.getElementById('new_password').value);
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        alert(re.test(email));
        if (re.test(email)){
            url = "create.json?email=" + email + "&user_name=" + user_name + "&password=" + password;
            xmlhttp.open('POST',url,true);

            xmlhttp.onreadystatechange=function(){
                if (xmlhttp.readyState == 4){
                    if (xmlhttp.status == 200){
                        // TODO: enable "relevant" buttons again
                        alert("The User was registed correctly. An email was sended to you to confirm your registration.");
                        window.open("/","_self");
                    }else {
                        alert("Error from the web service for action : "+xmlhttp.status+": "+xmlhttp.responseText)
                    }
                }
            };
            xmlhttp.send();
        }else{
            alert("INCORRECT EMAIL");
        }
    }
}

function signIn(){
    var xmlhttp;
    xmlhttp=new XMLHttpRequest();
    if (confirm("Are you sure?")){
        var user_name = encodeURIComponent(document.getElementById('user_name').value);
        var password  = encodeURIComponent(document.getElementById('password').value);

        if (user_name != "" || password != ""){
            url = "auth.json?user_name=" + user_name + "&password=" + password;
            xmlhttp.open('POST',url,true);

            xmlhttp.onreadystatechange=function(){
                if (xmlhttp.readyState == 4){
                    if (xmlhttp.status == 200){
                        // TODO: enable "relevant" buttons again
                        alert("Login was successful");
                        window.open("/journey/all.html","_self");
                    }else {
                        alert("Error from the web service for action : "+xmlhttp.status+": "+xmlhttp.responseText)
                    }
                }
            };
            xmlhttp.send();
        }else{
                alert("Please include a Username and a Password");
            }
    }
}