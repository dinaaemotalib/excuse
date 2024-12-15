import { getAllAcceptedExcuses, getAllExcuses } from "../controller/Excuse.js";
import { getAllAcceptedLeaves, getAllLeaves } from "../controller/Leave.js";
import { calculateDaysBetweenDates, calculateDuration, calculateDurationNumbersOnly } from "../utils/calculations.js";
import {
  EXCUSE_TYPE_OFFICIAL,
  EXCUSE_TYPE_PERSONAL,
  LEAVE_TYPE_ANNUAL,
  LEAVE_TYPE_DEATH,
  LEAVE_TYPE_HAJJ,
  LEAVE_TYPE_LABOR,
  LEAVE_TYPE_SICK,
  MAX_ALLOWED_ANNUAL_LEAVE_DAYS,
  MAX_ALLOWED_DEATH_LEAVE_DAYS,
  MAX_ALLOWED_EXCUSE_HOURS,
  MAX_ALLOWED_HAJJ_LEAVE_DAYS,
  MAX_ALLOWED_LABOR_LEAVE_DAYS,
  MAX_ALLOWED_SICK_LEAVE_DAYS,
  ROLE_HR,
} from "../utils/constants.js";
import { LOGGING_USER } from "../utils/global.js";

let targetYear;
let targetMonth;

document.addEventListener("DOMContentLoaded", async function () {
  if (LOGGING_USER === null) {
    window.location.href = "loginform.html";
  }
  if (LOGGING_USER.role !== ROLE_HR) {
    alert("Only HR/s can access this route, you will get redirected to login");
    window.location.href = "loginform.html";
  }
  const currentDate = new Date();
  targetYear = Number(currentDate.getFullYear());
  targetMonth = Number(currentDate.getMonth() + 1); // Ensure 2-digit format

  await doAll(targetYear, targetMonth);

  document.getElementById("requests-report-title").innerHTML = `Excuse Requests for ${new Date(
    `${targetYear}-${targetMonth}`
  ).toLocaleString("default", { month: "long" })} | ${new Date(`${targetYear}-${targetMonth}`).getFullYear()}`;

  document.getElementById("pills-Excuses-tab").addEventListener("click", async () => {
    const selectedDate = document.getElementById("month-select").value || `${targetYear}-${targetMonth}`;

    const [currentYear, currentMonth] = String(selectedDate).split("-");
    if (currentYear.toString() === targetYear.toString() && currentMonth.toString() === targetMonth.toString()) {
      return;
    }
    targetYear = Number(currentYear);
    targetMonth = Number(currentMonth);
    await doAll(targetYear, targetMonth);
    document.getElementById("requests-report-title").innerHTML = `Excuse Requests for ${new Date(
      `${targetYear}-${targetMonth}`
    ).toLocaleString("default", { month: "long" })} | ${new Date(`${targetYear}-${targetMonth}`).getFullYear()}`;
  });
  document.getElementById("pills-leaves-tab").addEventListener("click", async () => {
    const selectedDate = document.getElementById("month-select").value || `${targetYear}-${targetMonth}`;

    const [currentYear, currentMonth] = String(selectedDate).split("-");
    if (currentYear.toString() === targetYear.toString()) {
      return;
    }
    targetYear = Number(currentYear);
    targetMonth = Number(currentMonth);
    await doAll(targetYear, targetMonth);

    document.getElementById("requests-report-title").innerHTML = `Leave Requests for year ${
      targetYear || new Date().getFullYear()
    } `;
  });

  document.getElementById("filter-button").addEventListener("click", async () => {
    targetYear = currentYear;
    targetMonth = currentMonth;
    document.getElementById("requests-report-title").innerHTML = `Excuse Requests for ${new Date(
      selectedDate
    ).toLocaleString("default", { month: "long" })} | ${new Date().getFullYear()}`;
  });
});

// ------------
async function doAll(_targetYear, _targetMonth) {
  try {
    // Excuses
    const excuses = await getAllAcceptedExcuses(_targetYear, _targetMonth);
    console.log("excuses:", excuses);
    const mergedExcusesPersonal = filterAndMergeExcuses(
      excuses.filter((excuse) => excuse.type === EXCUSE_TYPE_PERSONAL),
      EXCUSE_TYPE_PERSONAL
    );
    const mergedExcusesOfficial = filterAndMergeExcuses(
      excuses.filter((excuse) => excuse.type === EXCUSE_TYPE_OFFICIAL),
      EXCUSE_TYPE_OFFICIAL
    );
    const allMergedExcuses = [...mergedExcusesPersonal, ...mergedExcusesOfficial];
    allMergedExcuses.sort((a, b) => a.userCode.localeCompare(b.userCode));

    let rows = "";
    allMergedExcuses.forEach((request) => {
      rows += renderRequest(
        request.name,
        request.type,
        request.category.split(" ")[0],
        request.date,
        request.from,
        request.to,
        formatHours(request.totalDuration),
        isNaN(Number(request.remaining)) ? request.remaining : formatHours(request.remaining)
      );
    });
    document.getElementById("hr-excuse-report-table-body").innerHTML = rows;

    // Leaves
    const leaves = await getAllAcceptedLeaves(targetYear);
    console.log("leaves:", leaves);
    const targetYearLeaves = leaves.filter((leave) => {
      if (!leave.from_date || !leave.to_date) return false;

      const yearFrom = leave.from_date.split("-").map(Number)[0];
      const yearTo = leave.to_date.split("-").map(Number)[0];
      return yearFrom === _targetYear || yearTo === _targetYear;
    });

    const mergedLeavesAnnual = filterAndMergeLeaves(
      targetYearLeaves.filter((leave) => leave.type === LEAVE_TYPE_ANNUAL),
      LEAVE_TYPE_ANNUAL,
      MAX_ALLOWED_ANNUAL_LEAVE_DAYS,
      targetYear
    );
    const mergedLeavesSick = filterAndMergeLeaves(
      targetYearLeaves.filter((leave) => leave.type === LEAVE_TYPE_SICK),
      LEAVE_TYPE_SICK,
      MAX_ALLOWED_SICK_LEAVE_DAYS,
      targetYear
    );
    const mergedLeavesHajj = filterAndMergeLeaves(
      targetYearLeaves.filter((leave) => leave.type === LEAVE_TYPE_HAJJ),
      LEAVE_TYPE_HAJJ,
      MAX_ALLOWED_HAJJ_LEAVE_DAYS,
      targetYear
    );
    const mergedLeavesLabor = filterAndMergeLeaves(
      targetYearLeaves.filter((leave) => leave.type === LEAVE_TYPE_LABOR),
      LEAVE_TYPE_LABOR,
      MAX_ALLOWED_LABOR_LEAVE_DAYS,
      targetYear
    );
    const mergedLeavesDeath = filterAndMergeLeaves(
      targetYearLeaves.filter((leave) => leave.type === LEAVE_TYPE_DEATH),
      LEAVE_TYPE_DEATH,
      MAX_ALLOWED_DEATH_LEAVE_DAYS,
      targetYear
    );

    const allMergedLeaves = [
      ...mergedLeavesAnnual,
      ...mergedLeavesSick,
      ...mergedLeavesHajj,
      ...mergedLeavesLabor,
      ...mergedLeavesDeath,
    ];
    allMergedLeaves.sort((a, b) => a.userCode.localeCompare(b.userCode));

    rows = "";
    allMergedLeaves.forEach((request) => {
      rows += renderRequest(
        request.name,
        request.type,
        request.category.split(" ")[0],
        request.from,
        request.from,
        request.to,
        `${request.totalDuration} days`,
        `${request.remaining} days`
      );
    });
    document.getElementById("hr-leave-report-table-body").innerHTML = rows;
  } catch (error) {
    console.log("Failed to Fetch Leaves");
    console.log("ERROR:", error);
  }
}

// ----------

function renderRequest(name, type, category, date, from, to, duration, remaining) {
  return `<tr>
            <td class="text-center">${name}</td>
            <td class="text-center">${type}</td>
            <td class="text-center">${category}</td>
            <td class="text-center">${date}</td>
            <td class="text-center">${from}</span></td>
            <td class="text-center">${to}</span></td>
            <td class="text-center">${duration}</span></td>
            <td class="text-center">${remaining}</span></td>
          </tr>
  `;
}

// utils
function filterAndMergeExcuses(excuses, type) {
  const mappedData = excuses.map((element) => ({
    name: element.user_code.name,
    type: "Excuse",
    category: element.type,
    date: element.date,
    from: element.from_time,
    to: element.to_time,
    duration: calculateDurationNumbersOnly(element.from_time, element.to_time),
    userCode: element.user_code.user_code, // Keep for merging later
  }));

  const mergedData = Object.values(
    mappedData.reduce((acc, curr) => {
      const userCode = curr.userCode;
      if (!acc[userCode]) {
        acc[userCode] = { ...curr, totalDuration: curr.duration };
        return acc;
      }
      acc[userCode].totalDuration += curr.duration; // Accumulate duration
      acc[userCode].date += `<br />${curr.date}`;
      acc[userCode].from += `<br />${curr.from}`;
      acc[userCode].to += `<br />${curr.to}`;
      return acc;
    }, {})
  ).map((user) => ({
    ...user,
    remaining: type === EXCUSE_TYPE_PERSONAL ? MAX_ALLOWED_EXCUSE_HOURS - user.totalDuration : "---", // Calculate remaining
  }));

  return mergedData;
}

function filterAndMergeLeaves(leaves, leaveType, maxDaysAllowed, targetYear) {
  const mappedData = leaves.map((element) => ({
    name: element.user_code.name,
    type: "Leave",
    category: leaveType,
    from: element.from_date,
    to: element.to_date,
    duration:
      targetYear === Number(new Date(element.from_date).getFullYear())
        ? calculateDaysBetweenDates(element.from_date, element.to_date)[0]
        : targetYear === Number(new Date(element.to_date).getFullYear())
        ? calculateDaysBetweenDates(element.from_date, element.to_date)[1]
        : 0, // This line can't be reached in normal situations
    userCode: element.user_code.user_code, // Keep for merging later
  }));

  const mergedData = Object.values(
    mappedData.reduce((acc, curr) => {
      const userCode = curr.userCode;
      if (!acc[userCode]) {
        acc[userCode] = { ...curr, totalDuration: curr.duration };
        return acc;
      }
      acc[userCode].totalDuration += curr.duration; // Accumulate duration
      acc[userCode].from += `<br />${curr.from}`;
      acc[userCode].to += `<br />${curr.to}`;
      return acc;
    }, {})
  ).map((user) => ({
    ...user,
    remaining: maxDaysAllowed - user.totalDuration, // Calculate remaining
  }));

  return mergedData;
}

function formatHours(decimalHours) {
  const hours = Math.floor(decimalHours); // Get the whole number part (hours)
  const minutes = Math.round((decimalHours - hours) * 60); // Convert the decimal part to minutes
  return minutes === 0 ? `${hours} Hours` : `${hours} Hours ${minutes} min`;
}
