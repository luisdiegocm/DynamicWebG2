window.onload = function(){
    loadDOM();
    document.getElementById("addJourney").onclick = function(){
        ajaxCall("create");};
}

