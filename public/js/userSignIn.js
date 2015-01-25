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
        var re = /\S+%40\S+\.\S+/;
        if (re.test(email)){
            if (user_name != "" && password != ""){
                url = "create.json?email=" + email + "&user_name=" + user_name + "&password=" + password;
                xmlhttp.open('POST',url,true);

                xmlhttp.onreadystatechange=function(){
                    if (xmlhttp.readyState == 4){
                        if (xmlhttp.status == 200){
                            // TODO: enable "relevant" buttons again
                            alert("The User was registed correctly. An email was sended to you to confirm your registration.");
                            window.open("/journey/all.html","_self");
                        }else {
                            alert("Username not found");
                        }
                    }
                };
                xmlhttp.send();
            }else{
                alert("Please include a Username and a Password");
            }
        }else{
            alert("Incorrect email format, ex: myjourney@gmail.com");
        }
    }
}
function signIn(){
    var xmlhttp;
    xmlhttp=new XMLHttpRequest();
    if (confirm("Are you sure?")){
        var user_name = encodeURIComponent(document.getElementById('user_name').value);
        var password  = encodeURIComponent(document.getElementById('password').value);
        if (user_name != "" && password != ""){
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