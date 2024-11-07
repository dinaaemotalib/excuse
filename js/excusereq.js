//excuse

//all inputs
var form = document.getElementById('excuseType')
var excuseType = document.getElementById("excuseType");
var excuseDate = document.getElementById("excuseDate");
var startexcuse = document.getElementById("fromTime");
var endexcuse = document.getElementById("toTime");
var excuseReason = document.getElementById("excuseReason");
var excuseSenior = document.getElementById("excuseSenior");
var submitexcusebtn = document.getElementById("excusebtn")
var excuseRequests = []

//check if local storage empty or not
if(localStorage.getItem('allexcuses')==null){
//no excuses
excuseRequests = []   
}
else{
    //has excuses before
    excuseRequests = JSON.parse(localStorage.getItem('allexcuses'))
    displayRequests();

}


function sendExcuseRequest(){

    //object
    var excuseRequest={
        excuseType : excuseType.value,
        excuseDate : excuseDate.value,
        startexcuse : startexcuse.value,
        endexcuse : endexcuse.value,
        excuseReason : excuseReason.value,
        excuseSenior : excuseSenior.value
    }


   //put the values in the array
    excuseRequests.push(excuseRequest)
    //save in local storage
    localStorage.setItem('allexcuses' , JSON.stringify(excuseRequests))
    //show data
    displayRequests()
    //clear the form
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

function displayRequests(){

    var cartona = ''

    for(var i = 0 ; i < excuseRequests.length; i++){

        cartona+=
                `
                    <tr>
                       
                       <td class="text-center">${excuseRequests[i].excuseType}</td>
                       <td class="text-center">${excuseRequests[i].excuseDate}</td>
                       <td class="text-center">${excuseRequests[i].startexcuse}</td>
                       <td class="text-center">${excuseRequests[i].endexcuse}</span></td>
                       <td class="text-center">${excuseRequests[i].excuseReason}</span></td>
                       <td class="text-center">${excuseRequests[i].excuseSenior}</span></td>
                       <td class="text-center"><div class="alert alert-warning m-0 p-0" role="alert">Pending</div></span></td>
                      
                   </tr> `;
        
    }

    document.getElementById('myExcuse').innerHTML=cartona;
}
