const nzstOptions = { timeZone: "Pacific/Auckland", hour12: false };

export function formatDateToLocalString(date: Date) {
  const NZST = date.toLocaleString("en-NZ", nzstOptions).replaceAll(" ", "");
  return convertTimeFormatForInput(NZST);
}

function convertTimeFormatForInput(inputTime: string) {
  // 10/11/2023,08:39:30
  // Split the input time into date and time parts
  const parts = inputTime.split(",");
  let datePart = parts[0];
  let timePart = parts[1];

  // Split the date part into day, month, and year
  const dateComponents = datePart.split("/");
  let day = dateComponents[0];
  let month = dateComponents[1];
  let year = dateComponents[2];

  // Split the time part into hours, minutes, and seconds
  const timeComponents = timePart.split(":");
  let hours = timeComponents[0];
  let minutes = timeComponents[1];

  // Pad with leading zeros if necessary
  day = +day < 10 ? "0" + day : day;
  month = +month < 10 ? "0" + month : month;

  const newFormat = `${year}-${month}-${day}T${hours}:${minutes}`;
  return newFormat;
}

export function formatDateToIsoString(date: Date) {
  return date.toLocaleString("en-NZ", nzstOptions).slice(0, -1);
}
