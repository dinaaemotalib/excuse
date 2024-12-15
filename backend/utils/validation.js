import { calculateDaysBetweenDates } from "./calculations.js";
import {
  ENDING_HOUR,
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
  STARTING_HOUR,
} from "./constants.js";

export const isValidDate = (date) => {
  const givenDate = new Date(date);
  const currentDate = new Date(); // Today's date

  // Set the time part of both dates to midnight for the comparison
  givenDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  return givenDate >= currentDate;
};

export const isValidExcuseTime = (from_time, to_time) => {
  const fromTime = Number(from_time.split(":")[0]);
  const toTime = Number(to_time.split(":")[0]);
  const startTime = Number(STARTING_HOUR.split(":")[0]);
  const endTime = Number(ENDING_HOUR.split(":")[0]);

  if (fromTime < startTime) {
    return { isValid: false, message: `starting time is smaller than starting time (${STARTING_HOUR})` };
  }
  if (toTime > endTime) {
    return { isValid: false, message: `to time is greater than ending time (${ENDING_HOUR})` };
  }
  if (endTime < startTime) {
    return { isValid: false, message: `to time ${to_time} is smaller than from time ${from_time}` };
  }
  if (endTime === startTime) {
    return { isValid: false, message: `to time ${to_time} equals from time ${from_time}` };
  }
  if (toTime - fromTime > MAX_ALLOWED_EXCUSE_HOURS || toTime - fromTime < 0) {
    return {
      isValid: false,
      message: `excuse hours exceeds maximum allowed hours (${MAX_ALLOWED_EXCUSE_HOURS} hours)`,
    };
  }

  return { isValid: true, message: `excuse hours is valid` };
};

export const isLeaveNotPassingMax = (from_date, to_date, type) => {
  const fromDate = new Date(from_date);
  const toDate = new Date(to_date); // Today's date

  // Set the time part of both dates to midnight for the comparison
  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(0, 0, 0, 0);

  if (fromDate >= toDate) {
    return { isValid: false, message: `to_date is smaller than or equals from_date` };
  }

  const [daysInCurrentYear, daysInNextYear] = calculateDaysBetweenDates(from_date, to_date);

  const limit =
    type === LEAVE_TYPE_ANNUAL
      ? MAX_ALLOWED_ANNUAL_LEAVE_DAYS
      : type === LEAVE_TYPE_DEATH
      ? MAX_ALLOWED_DEATH_LEAVE_DAYS
      : type === LEAVE_TYPE_HAJJ
      ? MAX_ALLOWED_HAJJ_LEAVE_DAYS
      : type === LEAVE_TYPE_LABOR
      ? MAX_ALLOWED_LABOR_LEAVE_DAYS
      : type === LEAVE_TYPE_SICK
      ? MAX_ALLOWED_SICK_LEAVE_DAYS
      : Number.MAX_VALUE;

  if (daysInCurrentYear + daysInNextYear > limit) {
    return { isValid: false, message: `${type} can't exceeds ${limit} days at max` };
  }
  console.log("Here");
  return { isValid: true, message: "" };
};
