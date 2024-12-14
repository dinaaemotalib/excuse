import { getAllAcceptedExcuses, getAllExcuses } from "../controller/Excuse.js";
import { getAllAcceptedLeaves, getAllLeaves } from "../controller/Leave.js";
import { calculateDaysBetweenDates, calculateDuration, calculateDurationNumbersOnly } from "../utils/calculations.js";
import {
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

document.addEventListener("DOMContentLoaded", async function () {
  if (LOGGING_USER === null) {
    window.location.href = "loginform.html";
  }
  if (LOGGING_USER.role !== ROLE_HR) {
    alert("Only HR/s can access this route, you will get redirected to login");
    window.location.href = "loginform.html";
  }
  try {
    // Excuses
    const excuses = await getAllAcceptedExcuses();
    const mergedExcuses = filterAndMergeExcuses(excuses);
    let rows = "";
    mergedExcuses.forEach((request) => {
      rows += renderRequest(
        request.name,
        request.type,
        request.category.split(" ")[0],
        request.date,
        request.from,
        request.to,
        formatHours(request.totalDuration),
        formatHours(request.remaining)
      );
    });
    document.getElementById("hr-excuse-report-table-body").innerHTML = rows;

    // Leaves
    const leaves = await getAllAcceptedLeaves();
    console.log("leaves:", leaves);
    const currentYearLeaves = leaves.filter((leave) => {
      if (!leave.from_date || !leave.to_date) return false;

      const today = new Date();
      const currentYear = today.getFullYear();

      const yearFrom = leave.from_date.split("-").map(Number)[0];
      const yearTo = leave.to_date.split("-").map(Number)[0];
      return yearFrom === currentYear || yearTo === currentYear;
    });

    const mergedLeavesAnnual = filterAndMergeLeaves(
      currentYearLeaves.filter((leave) => leave.type === LEAVE_TYPE_ANNUAL),
      LEAVE_TYPE_ANNUAL,
      MAX_ALLOWED_ANNUAL_LEAVE_DAYS
    );
    const mergedLeavesSick = filterAndMergeLeaves(
      currentYearLeaves.filter((leave) => leave.type === LEAVE_TYPE_SICK),
      LEAVE_TYPE_SICK,
      MAX_ALLOWED_SICK_LEAVE_DAYS
    );
    const mergedLeavesHajj = filterAndMergeLeaves(
      currentYearLeaves.filter((leave) => leave.type === LEAVE_TYPE_HAJJ),
      LEAVE_TYPE_HAJJ,
      MAX_ALLOWED_HAJJ_LEAVE_DAYS
    );
    const mergedLeavesLabor = filterAndMergeLeaves(
      currentYearLeaves.filter((leave) => leave.type === LEAVE_TYPE_LABOR),
      LEAVE_TYPE_LABOR,
      MAX_ALLOWED_LABOR_LEAVE_DAYS
    );
    const mergedLeavesDeath = filterAndMergeLeaves(
      currentYearLeaves.filter((leave) => leave.type === LEAVE_TYPE_DEATH),
      LEAVE_TYPE_DEATH,
      MAX_ALLOWED_DEATH_LEAVE_DAYS
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
    console.log("allMergedLeaves:", allMergedLeaves);
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
});

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
function filterAndMergeExcuses(excuses) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Months are 0-based in JavaScript

  const mappedData = excuses
    .filter((excuse) => {
      if (!excuse.date) return false;

      const [year, month] = excuse.date.split("-").map(Number);
      return year === currentYear && month === currentMonth && excuse.type === EXCUSE_TYPE_PERSONAL;
    })
    .map((element) => ({
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
    remaining: MAX_ALLOWED_EXCUSE_HOURS - user.totalDuration, // Calculate remaining
  }));

  return mergedData;
}

function filterAndMergeLeaves(leaves, leaveType, maxDaysAllowed) {
  console.log(leaves);
  const today = new Date();
  const currentYear = today.getFullYear();

  const mappedData = leaves.map((element) => ({
    name: element.user_code.name,
    type: "Leave",
    category: leaveType,
    from: element.from_date,
    to: element.to_date,
    duration:
      Number(currentYear) === Number(new Date(element.from_date).getFullYear())
        ? calculateDaysBetweenDates(element.from_date, element.to_date)[0]
        : Number(currentYear) === Number(new Date(element.to_date).getFullYear())
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
