//excuse

var form = document.getElementById('excuseType')
var excuseType = document.getElementById("excuseType");
var excuseDate = document.getElementById("excuseDate");
var startexcuse = document.getElementById("fromTime");
var endexcuse = document.getElementById("toTime");
var excuseReason = document.getElementById("excuseReason");
var excuseSenior = document.getElementById("excuseSenior");
var submitexcusebtn = document.getElementById("excusebtn")
var excuseRequests = []


function sendExcuseRequest(){

    var excuseRequest={
        excuseType : excuseType.value,
        excuseDate : excuseDate.value,
        startexcuse : startexcuse.value,
        endexcuse : endexcuse.value,
        excuseReason : excuseReason.value,
        excuseSenior : excuseSenior.value
    }
   
    excuseRequests.push(excuseRequest)
    localStorage.setItem('allexcuses' , JSON.stringify(excuseRequests))
    displayRequests()
    
// document.addEventListener("DOMContentLoaded", function() {
//     displayRequests();
// });


// document.addEventListener("DOMContentLoaded", function() {
//     if (document.getElementById('myExcuse')) {
//         displayRequests();
//     } else {
//         console.error("Element with id myExcuse not found.");
//     }
// });

    console.log(excuseRequests);  
    excuseclearform() ; 
}


function excuseclearform(){
    excuseType.value= null
    excuseDate.value = null
    startexcuse.value = null
    endexcuse.value = null
    excuseReason.value= null
    excuseSenior.value = null
}


var requests=[
    {excuseType:'annual' , excuseDate:'2/5' , startexcuse:'2:00' , endexcuse:'4:00' , excuseReason:'no' , excuseSenior:'dina@g.edu'},
    {excuseType:'annual' , excuseDate:'2/5' , startexcuse:'2:00' , endexcuse:'4:00' , excuseReason:'no' , excuseSenior:'dina@g.edu'},
    {excuseType:'annual' , excuseDate:'2/5' , startexcuse:'2:00' , endexcuse:'4:00' , excuseReason:'no' , excuseSenior:'dina@g.edu'},
    {excuseType:'annual' , excuseDate:'2/5' , startexcuse:'2:00' , endexcuse:'4:00' , excuseReason:'no' , excuseSenior:'dina@g.edu'},
]
var cartona = ''

for(var i = 0 ; i < requests.length ; i++){

   cartona+=`
                    <tr>
                       
                       <td class="text-center">${requests[i].excuseType}</td>
                       <td class="text-center">${requests[i].excuseDate}</td>
                       <td class="text-center">${requests[i].startexcuse}</td>
                       <td class="text-center">${requests[i].endexcuse}</span></td>
                       <td class="text-center">${requests[i].excuseReason}</span></td>
                       <td class="text-center">${requests[i].excuseSenior}</span></td>
                       <td class="text-center"><div class="alert alert-warning m-0 p-0" role="alert">Pending</div></span></td>
                      
                   </tr> `
    
}
console.log(cartona);





//my excuse requests

function displayRequests(){

    var cartona = ''


    for(var i = 0 ; i < excuseRequests.length; i++){

        cartona+=`
                   <tr>
                       
                       <td class="text-center">Excuse</td>
                       <td class="text-center">3/12/2016</td>
                       <td class="text-center">30 mins</span></td>
                       <td class="text-center"><div class="alert alert-warning m-0 p-0" role="alert">Pending</div></span></td>
                      
                   </tr> 
 `
        
    }

    document.getElementById('myExcuse').innerHTML=cartona
}

