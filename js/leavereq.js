//leaves

//all inputs
var leaveType = document.getElementById("leaveType");
var startLeave = document.getElementById("startLeave");
var endLeave = document.getElementById("endLeave");
var leaveReason = document.getElementById("leaveReason");
var leaveSenior = document.getElementById("leaveSenior");
var leavebtn = document.getElementById("leavebtn")
var leaveRequests = []

//check if local storage empty or not
if(localStorage.getItem('allleaves')==null){
//no excuses
leaveRequests = []   
}
else{
    //has excuses before
    leaveRequests = JSON.parse(localStorage.getItem('allleaves'))
    displayleaveRequests();

}


function sendleaveRequest(){

    //object
    var leaveRequest={
        leaveType : leaveType.value,
        startLeave : startLeave.value,
        endLeave : endLeave.value,
        leaveReason : leaveReason.value,
        leaveSenior : leaveSenior.value
    }


   //put the values in the array
   leaveRequests.push(leaveRequest)
    //save in local storage
    localStorage.setItem('allleaves' , JSON.stringify(leaveRequests))
    //show data
    displayleaveRequests()
    //clear the form
    leaveclearform() ; 
}


function leaveclearform(){
    leaveType.value= null
    startLeave.value = null
    endLeave.value = null
    leaveReason.value = null
    leaveSenior.value= null
}

function displayleaveRequests(){

    var leavecartona = ''

    for(var i = 0 ; i < leaveRequests.length; i++){

        leavecartona+=
                `
                    <tr>
                       
                       <td class="text-center">${leaveRequests[i].leaveType}</td>
                       <td class="text-center">${leaveRequests[i].startLeave}</td>
                       <td class="text-center">${leaveRequests[i].endLeave}</td>
                       <td class="text-center">${leaveRequests[i].leaveReason}</span></td>
                       <td class="text-center">${leaveRequests[i].leaveSenior}</span></td>
                       <td class="text-center"><div class="alert alert-warning m-0 p-0" role="alert">Pending</div></span></td>
                      
                   </tr> `;
        
    }

    document.getElementById('myLeave').innerHTML=leavecartona;
}