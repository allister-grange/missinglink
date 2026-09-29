const newZealandTimeZone = "Pacific/Auckland";

const newZealandDateTimeFormatter = new Intl.DateTimeFormat("en-NZ", {
  timeZone: newZealandTimeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function getNewZealandDateTimeParts(date: Date) {
  const parts = Object.fromEntries(
    newZealandDateTimeFormatter
      .formatToParts(date)
      .map(({ type, value }) => [type, value])
  );

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
  };
}

export function formatDateForInput(date: Date) {
  const { year, month, day, hour, minute } = getNewZealandDateTimeParts(date);
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export function formatDateTimeDaysAgoForInput(daysAgo: number) {
  const now = getNewZealandDateTimeParts(new Date());
  const date = new Date(
    Date.UTC(
      Number(now.year),
      Number(now.month) - 1,
      Number(now.day) - daysAgo,
      Number(now.hour),
      Number(now.minute)
    )
  );
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate()
  )}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

export function formatDateForBackend(
  inputDateTime: string,
  endOfMinute = false
) {
  if (!inputDateTime) {
    return "";
  }

  const [date, time] = inputDateTime.split("T");
  const timeWithSeconds = time.length === 5
    ? `${time}:${endOfMinute ? "59" : "00"}`
    : time;

  return `${date.replaceAll("-", "/")} ${timeWithSeconds}`;
}
