export const getServiceProviderFromCity = (
  city: string,
  firstLetterCapital: boolean = false
) => {
  let serviceProvider = "";

  switch (city) {
    case "wellington":
      serviceProvider = "metlink";
      break;
    case "auckland":
      serviceProvider = firstLetterCapital ? "AT" : "at";
      break;
    default:
      serviceProvider = "metlink";
  }

  return firstLetterCapital
    ? serviceProvider.charAt(0).toUpperCase() + serviceProvider.slice(1)
    : serviceProvider;
};

// https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
export const convertSecondsToMinutes = (
  seconds: number,
  includeSign: boolean
): string => {
  let negative = false;
  if (seconds < 0) {
    seconds *= -1;
    negative = true;
  }
  // Hours, minutes and seconds
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds) % 60;

  let ret = "";

  if (hrs > 0) {
    ret += `${hrs}:${mins < 10 ? "0" : ""}`;
  }

  ret += `${mins}m:${secs < 10 ? "0" : ""}`;
  ret += `${secs}s`;
  if (negative && includeSign) {
    return `-${ret}`;
  }
  return ret;
};

export function formatDelay(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  } else {
    return `${minutes}m ${remainingSeconds}s`;
  }
}

export const convertSecondsToMinutesSentence = (seconds: number): string => {
  let negative = false;
  if (seconds < 0) {
    seconds *= -1;
    negative = true;
  }
  // Hours, minutes and seconds
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds) % 60;

  let ret = "I am ";

  if (hrs > 0) {
    ret += `${hrs}:${mins < 10 ? "0" : ""}`;
  }

  ret += `${mins} minutes and ${secs < 10 ? "0" : ""}`;
  ret += `${secs} seconds`;
  if (negative) {
    return `${ret} early`;
  }

  return `${ret} late`;
};

export default convertSecondsToMinutes;
