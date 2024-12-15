import { getAllExcuses, getAllExcusesByUser } from "../controller/Excuse.js";
import { calculateDuration, calculateDurationNumbersOnly, formatHours } from "../utils/calculations.js";
import {
  ROLE_CO,
  ROLE_EMPLOYEE,
  ROLE_HR,
  ROLE_SENIOR,
  STATUS_ACCEPTED,
  STATUS_DECLINED,
  STATUS_PENDING,
} from "../utils/constants.js";
import { LOGGING_USER } from "../utils/global.js";

const excusesTable = document.getElementById("myExcuse");

document.addEventListener("DOMContentLoaded", async function () {
  if (LOGGING_USER === null) {
    window.location.href = "loginform.html";
  }
  try {
    if (LOGGING_USER.role === ROLE_EMPLOYEE || LOGGING_USER.role === ROLE_SENIOR || LOGGING_USER.role === ROLE_HR) {
      const excuses = await getAllExcusesByUser();
      excuses.sort((a, b) => new Date(b.date) - new Date(a.date));
      let rows = "";
      excuses.forEach((excuse) => {
        rows += renderExcuse(excuse, false);
      });
      document.getElementById("excuse-table-head").innerHTML = renderExcuseTableHead(false);
      excusesTable.innerHTML += rows;
    }
    if (LOGGING_USER.role === ROLE_CO) {
      const _now = new Date();
      const excuses = await getAllExcuses(_now.getFullYear(), _now.getMonth() + 1);
      excuses.sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log(excuses);
      let rows = "";
      excuses.forEach((excuse) => {
        rows += renderExcuse(excuse, true);
      });
      document.getElementById("excuse-table-head").innerHTML = renderExcuseTableHead(true);
      excusesTable.innerHTML += rows;
    }
  } catch (error) {
    console.log("Failed to Fetch Excuses");
    console.log("ERROR:", error);
  }
});

function renderExcuse(excuse, includeName) {
  let alert = "light";
  if (excuse.status === STATUS_PENDING) {
    alert = "warning";
  } else if (excuse.status === STATUS_ACCEPTED) {
    alert = "success";
  } else if (excuse.status === STATUS_DECLINED) {
    alert = "danger";
  }
  const duration = calculateDurationNumbersOnly(excuse.from_time, excuse.to_time);
  return `<tr>
            ${includeName ? '<td class="text-center">' + excuse.user_code.name + "</td>" : ""}
            <td class="text-center">${excuse.type}</td>
            <td class="text-center">${excuse.date}</td>
            <td class="text-center">${excuse.from_time}</td>
            <td class="text-center">${excuse.to_time}</span></td>
            <td class="text-center">${excuse.reason}</span></td>
            <td class="text-center">${excuse.approval_code.email}</span></td>
            <td class="text-center"><div class="alert alert-${alert} m-0 p-0" role="alert">${
    excuse.status
  }</div></span></td>
            <td class="text-center">${formatHours(duration)}</span></td>
            </tr>
  `;
}

function renderExcuseTableHead(includeName) {
  return `
      <tr>
        ${includeName ? '<th class="text-center">Requester Name</th>' : ""}
        <th scope="col">Excuse Type</th>
        <th scope="col">Excuse Date</th>
        <th scope="col">From Time</th>
        <th scope="col">To Time</th>
        <th scope="col">Reason</th>
        <th scope="col">Approval</th>
        <th scope="col">Status</th>
        <th scope="col" class="text-center">Hours / Duration</th>
      </tr>`;
}
