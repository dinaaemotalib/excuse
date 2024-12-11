import { getAllLeavesByUser } from "../controller/Leave.js";
import { STATUS_ACCEPTED, STATUS_DECLINED, STATUS_PENDING } from "../utils/constants.js";
import { LOGGING_USER } from "../utils/global.js";

const leavesTable = document.getElementById("myLeave");

document.addEventListener("DOMContentLoaded", async function () {
  if (LOGGING_USER === null) {
    window.location.href = "loginform.html";
  }
  try {
    const leaves = await getAllLeavesByUser();
    let rows = "";
    leaves.forEach((excuse) => {
      rows += renderLeave(excuse);
    });
    leavesTable.innerHTML += rows;
  } catch (error) {}
});

function renderLeave(leave) {
  let alert = "light";
  if (leave.status === STATUS_PENDING) {
    alert = "warning";
  } else if (leave.status === STATUS_ACCEPTED) {
    alert = "success";
  } else if (leave.status === STATUS_DECLINED) {
    alert = "error";
  }
  return `<tr>
            <td class="text-center">${leave.type}</td>
            <td class="text-center">${leave.date}</td>
            <td class="text-center">${leave.from_date}</td>
            <td class="text-center">${leave.to_date}</span></td>
            <td class="text-center">${leave.reason}</span></td>
            <td class="text-center">${leave.approval_code}</span></td>
            <td class="text-center"><div class="alert alert-${alert} m-0 p-0" role="alert">${leave.status}</div></span></td>
          </tr>
  `;
}
