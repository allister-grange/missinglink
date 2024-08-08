const nzstOptions = { timeZone: "Pacific/Auckland", hour12: false };

export function formateDateForInput(date: Date) {
  const inputTime = date
    .toLocaleString("en-NZ", nzstOptions)
    .replaceAll(" ", "");

  // Split the input time into date and time parts
  const parts = inputTime.split(",");
  let datePart = parts[0];
  let timePart = parts[1];

  // Split the date part into day, month, and year
  const dateComponents = datePart.split("/");
  let day = dateComponents[0].padStart(2, "0");
  let month = dateComponents[1].padStart(2, "0");
  let year = dateComponents[2];

  // Split the time part into hours, minutes, and seconds
  const timeComponents = timePart.split(":");
  let hours = timeComponents[0].padStart(2, "0");
  let minutes = timeComponents[1].padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatDateForBackend(inputDate: Date) {
  const inputTime = inputDate
    .toLocaleString("en-NZ", nzstOptions)
    .replaceAll(" ", "");

  // Split the input time into date and time parts
  const parts = inputTime.split(",");
  let datePart = parts[0];
  let timePart = parts[1];

  // Split the date part into day, month, and year
  const dateComponents = datePart.split("/");
  let day = dateComponents[0].padStart(2, "0");
  let month = dateComponents[1].padStart(2, "0");
  let year = dateComponents[2];

  // Split the time part into hours, minutes, and seconds
  const timeComponents = timePart.split(":");
  let hours = timeComponents[0].padStart(2, "0");
  let minutes = timeComponents[1].padStart(2, "0");
  let seconds = timeComponents[2].padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}
