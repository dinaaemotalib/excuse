import { getAllExcusesByUser } from "../controller/Excuse.js";
import { getAllLeavesByUser } from "../controller/Leave.js";
import { STATUS_ACCEPTED, STATUS_PENDING } from "../utils/constants.js";
import { LOGGING_USER } from "../utils/global.js";

document.addEventListener("DOMContentLoaded", async function () {
  const requestedByUserList = document.getElementById("requested-by-user");
  if (LOGGING_USER === null) {
    window.location.href = "loginform.html";
  }
  document.getElementById("userName").innerHTML = LOGGING_USER.name;
  document.getElementById("userPosition").innerHTML = LOGGING_USER.role;
  document.getElementById("userEmail").innerHTML = LOGGING_USER.email;

  try {
    const excuses = await getAllExcusesByUser();
    const leaves = await getAllLeavesByUser();
    let requests = [
      ...excuses.map((excuse) => ({
        type: "Excuse",
        date: excuse.createdAt,
        status: excuse.status,
      })),
      ...leaves.map((leave) => ({
        type: "Leave",
        date: leave.createdAt,
        status: leave.status,
      })),
    ];

    requests = requests
      .filter((request) => request.status !== STATUS_PENDING)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    let render = "";
    requestedByUserList.innerHTML = "";

    requests.forEach((request) => {
      render += renderRequest(request.type, request.date, request.status);
    });
    requestedByUserList.innerHTML += render;
  } catch (error) {}
});

function renderRequest(type, date, status) {
  return `<div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <span class="font-weight-bold">${type}</span>
              <span class="text-muted ml-2">${new Date(date).toDateString()}</span>
            </div>
            <div class="d-flex align-items-center">
              <span class="badge badge-${status === STATUS_ACCEPTED ? "success" : "danger"}">${status}</span>
              <i class="fas fa-check-circle ml-3 text-${status === STATUS_ACCEPTED ? "success" : "danger"}"></i>
            </div>
          </div>`;
}
