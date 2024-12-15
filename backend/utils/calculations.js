export function calculateDuration(from_time, to_time) {
  console.log(from_time);
  console.log(to_time);

  // Parse input strings
  const [startH, startM] = from_time.split(":").map(Number);
  const [endH, endM] = to_time.split(":").map(Number);

  // Convert to total seconds
  const startTotalSeconds = startH * 3600 + startM;
  const endTotalSeconds = endH * 3600 + endM;

  // Calculate the difference in seconds
  let durationSeconds = endTotalSeconds - startTotalSeconds;

  // Handle negative durations by adding 24 hours
  if (durationSeconds < 0) {
    durationSeconds += 24 * 3600; // 24 hours in seconds
  }

  // Convert back to HH:MM
  const hours = Math.floor(durationSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((durationSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");

  let duration = "";
  if (hours > 0) {
    duration += hours + " hours ";
  }
  if (minutes > 0) {
    duration += minutes + " mins ";
  }
  return duration;
}

export function calculateDurationNumbersOnly(fromTime, toTime) {
  const [fromHours, fromMinutes] = fromTime.split(":").map(Number);
  const [toHours, toMinutes] = toTime.split(":").map(Number);
  return toHours - fromHours + (toMinutes - fromMinutes) / 60;
}

export function formatHours(decimalHours) {
  const hours = Math.floor(decimalHours); // Get the whole number part (hours)
  const minutes = Math.round((decimalHours - hours) * 60); // Convert the decimal part to minutes
  const hoursString = hours === 0 ? "" : `${hours} Hours`;
  const minutesString = minutes === 0 ? "" : `${minutes} min`;
  return hoursString + " " + minutesString;
}

export function calculateDaysBetweenDates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Ensure start is before end
  if (start > end) {
    [start, end] = [end, start];
  }

  const startYearEnd = new Date(start.getFullYear(), 11, 31); // End of start year
  const endYearStart = new Date(end.getFullYear(), 0, 1); // Start of end year

  let daysInStartYear = 0;
  let daysInEndYear = 0;

  if (start.getFullYear() === end.getFullYear()) {
    // Both dates in the same year
    daysInStartYear = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  } else {
    /*
      - Start is incremented by 1 to take the from_date into consideration
      - ceil one and floor the other to not ceil two times results in 1 day addition
      - ceiling the start will work as it will get subtracted from `startYearEnd` so as to increment the last day in the year too
      - floor the end so that to not accumilate the excess hours in the first day in the new year, resulting in addition of new day
    */
    daysInStartYear = Math.ceil((startYearEnd - start) / (1000 * 60 * 60 * 24)) + 1;
    daysInEndYear = Math.floor((end - endYearStart) / (1000 * 60 * 60 * 24));
  }

  return [daysInStartYear, daysInEndYear];
}
