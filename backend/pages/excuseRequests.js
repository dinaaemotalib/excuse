import { getAllExcusesByUser } from "../controller/Excuse.js";
import { STATUS_ACCEPTED, STATUS_DECLINED, STATUS_PENDING } from "../utils/constants.js";
import { LOGGING_USER } from "../utils/global.js";

const excusesTable = document.getElementById("myExcuse");

document.addEventListener("DOMContentLoaded", async function () {
  if (LOGGING_USER === null) {
    window.location.href = "loginform.html";
  }
  try {
    const excuses = await getAllExcusesByUser();
    let rows = "";
    excuses.forEach((excuse) => {
      rows += renderExcuse(excuse);
    });
    excusesTable.innerHTML += rows;
  } catch (error) {}
});

function renderExcuse(excuse) {
  let alert = "light";
  if (excuse.status === STATUS_PENDING) {
    alert = "warning";
  } else if (excuse.status === STATUS_ACCEPTED) {
    alert = "success";
  } else if (excuse.status === STATUS_DECLINED) {
    alert = "error";
  }
  return `<tr>
            <td class="text-center">${excuse.type}</td>
            <td class="text-center">${excuse.date}</td>
            <td class="text-center">${excuse.from_time}</td>
            <td class="text-center">${excuse.to_time}</span></td>
            <td class="text-center">${excuse.reason}</span></td>
            <td class="text-center">${excuse.approval_code}</span></td>
            <td class="text-center"><div class="alert alert-${alert} m-0 p-0" role="alert">${excuse.status}</div></span></td>
          </tr>
  `;
}
