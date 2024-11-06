//   // Set request_type to 'Leave' when the Leave Request card is clicked
//   document.getElementById('leaveRequestCard').addEventListener('click', function() {
//     document.getElementById('requestType').value = 'Leave';
//   });

const { log } = require("console");

// const { jar } = require("request");


//   // Set leave_type based on selected leave type
//   document.getElementById('leaveType').addEventListener('change', function() {
//     const selectedLeaveType = this.value;
//     document.getElementById('leaveTypeEnum').value = selectedLeaveType;
//   });

//   // Function to submit the form (optional)
//   function submitForm() {
//     document.getElementById('leaveForm').submit();
//   }



//    // Set leave type ENUM value on change
//    document.getElementById('leaveType').addEventListener('change', function() {
//     document.getElementById('leaveTypeEnum').value = this.value;
//   });

//   // Set request date and submission date on modal open
//   document.getElementById('exampleModal1').addEventListener('show.bs.modal', function() {
//     const today = new Date().toISOString().split('T')[0];
//     document.getElementById('requestDate').value = today;
//     document.getElementById('submitDate').value = today;
//   });

//   // Function to submit the form and calculate duration
//   function submitLeaveRequest() {
//     const start = new Date(document.getElementById('startLeave').value);
//     const end = new Date(document.getElementById('endLeave').value);
//     const duration = (end - start) / (1000 * 60 * 60); // Duration in hours
//     document.getElementById('leaveForm').request_duration = duration;

//     // Submit form
//     document.getElementById('leaveForm').submit();
//   }








//   document.getElementById("leaveForm").addEventListener("submit", function(event) {
//     event.preventDefault();  // Prevent the form from submitting normally

//     // Collect form data
//     const leaveType = document.getElementById("leaveType").value;
//     const startLeave = document.getElementById("startLeave").value;
//     const endLeave = document.getElementById("endLeave").value;
//     const leaveReason = document.getElementById("leaveReason").value;
//     const leaveSenior = document.getElementById("leaveSenior").value;

//     // Save data to local storage
//     localStorage.setItem("leaveRequest", JSON.stringify({
//         leaveType,
//         startLeave,
//         endLeave,
//         leaveReason,
//         leaveSenior
//     }));

//     alert("Leave request saved to local storage!");
// });



var form = document.getElementById('leaveForm')
var leaveType = document.getElementById("leaveType");
var startLeave = document.getElementById("startLeave");
var endLeave = document.getElementById("endLeave");
var leaveReason = document.getElementById("leaveReason");
var leaveSenior = document.getElementById("leaveSenior");
var submitbtn = document.getElementById("leavebtn")
// var requests = []


function sendRequest(){

    var request={
        leaveType: leaveType.value,
        startLeave: startLeave.value,
        endLeave: endLeave.value,
        leaveReason: leaveReason.value,
        leaveSenior: leaveSenior.value,
    }
    console.log(request);
    
    
}

