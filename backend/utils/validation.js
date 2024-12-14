import { ENDING_HOUR, MAX_ALLOWED_EXCUSE_HOURS, STARTING_HOUR } from "./constants.js";

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
