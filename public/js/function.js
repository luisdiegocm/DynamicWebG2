function writeDate(){
    var now = new Date()
    var day = now.getDay()
    var month = now.getMonth()
    var year = now.getYear()
    var date

    //El día de la semana
    if(day==0){
     date="Sunday, ";
    }else if(day==1){
     date="Monday, ";
    }else if(day==2){
     date="Tuesday, ";
    }else if(day==3){
     date="Wednesday, ";
    }else if(day==4){
     date="Thursday, ";
    }else if(day==5){
     date="Friday, ";
    }else{
     date="Saturday, ";
    }

    date = date + now.getDate() + ", "
    //El nombre del mes
    if(month==0){
     date=date + "January"
    }else if(month==1){
     date=date + "February"
    }else if(month==2){
     date=date + "March"
    }else if(month==3){
     date=date + "April"
    }else if(month==4){
     date=date + "May"
    }else if(month==5){
     date=date + "June"
    }else if(month==6){
     date=date + "July"
    }else if(month==7){
     date=date + "August"
    }else if(month==8){
     date=date + "September"
    }else if(month==9){
     date=date + "Octuber"
    }else if(month==10){
     date=date + "November"
    }else{
     date=date + "December"
    }

    var year = now.getFullYear()

    date = date + ", " + year

    document.getElementById("idDate").innerHTML = "<h4>"+date+"</h4>";
    
    document.getElementById('searchButton').innerHTML = "NADA";
}

writeDate();