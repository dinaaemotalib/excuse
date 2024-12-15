import { getAllExcusesByUser } from "../controller/Excuse.js";
import { getAllLeavesByUser } from "../controller/Leave.js";
import { calculateDaysBetweenDates, calculateDurationNumbersOnly } from "../utils/calculations.js";
import {
  EXCUSE_TYPE_PERSONAL,
  LEAVE_TYPE_ANNUAL,
  MAX_ALLOWED_ANNUAL_LEAVE_DAYS,
  MAX_ALLOWED_EXCUSE_HOURS,
  ROLE_CO,
  STATUS_ACCEPTED,
  STATUS_PENDING,
} from "../utils/constants.js";
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
    if (LOGGING_USER.role === ROLE_CO) return;
    const excuses = await getAllExcusesByUser();
    const leaves = await getAllLeavesByUser();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed

    // Excuse Monthly Hours
    const totalHoursTaken = excuses
      .filter((excuse) => {
        const statusAcceptOrPend = excuse.status === STATUS_ACCEPTED || excuse.status === STATUS_PENDING;
        const isProfileExcuse = excuse.type === EXCUSE_TYPE_PERSONAL;
        const excuseDate = new Date(excuse.date);
        const inCurrentMonth = excuseDate.getFullYear() === currentYear && excuseDate.getMonth() + 1 === currentMonth;

        return statusAcceptOrPend && isProfileExcuse && inCurrentMonth;
      })
      .map((excuse) => ({
        ...excuse,
        duration: calculateDurationNumbersOnly(excuse.from_time, excuse.to_time),
      }))
      .reduce((acc, curr) => acc + curr.duration, 0);

    document.getElementById("hoursTook").innerHTML = totalHoursTaken;
    document.getElementById("hoursLeft").innerHTML = MAX_ALLOWED_EXCUSE_HOURS - totalHoursTaken;

    // Annual Leaves yearly taken
    const totalDaysTaken = leaves
      .filter((leave) => {
        const statusAcceptOrPend = leave.status === STATUS_ACCEPTED || leave.status === STATUS_PENDING;
        const isLeaveAnnual = leave.type === LEAVE_TYPE_ANNUAL;
        const leaveFromDate = new Date(leave.from_date);
        const leaveToDate = new Date(leave.to_date);
        const inCurrentYear = leaveFromDate.getFullYear() === currentYear || leaveToDate.getFullYear() === currentYear;

        return statusAcceptOrPend && isLeaveAnnual && inCurrentYear;
      })
      .map((_leave) => ({
        ..._leave,
        duration:
          Number(currentYear) === Number(new Date(_leave.from_date).getFullYear())
            ? calculateDaysBetweenDates(_leave.from_date, _leave.to_date)[0]
            : NumbercurrentYear === Number(new Date(_leave.to_date).getFullYear())
            ? calculateDaysBetweenDates(_leave.from_date, _leave.to_date)[1]
            : 0, // This line can't be reached in normal situations
      }))
      .reduce((acc, curr) => acc + curr.duration, 0);

    console.log("totalDaysTaken:", totalDaysTaken);

    document.getElementById("daysTook").innerHTML = totalDaysTaken;
    document.getElementById("daysLeft").innerHTML = MAX_ALLOWED_ANNUAL_LEAVE_DAYS - totalDaysTaken;

    // ----------

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
