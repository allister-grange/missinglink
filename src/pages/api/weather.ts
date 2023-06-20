import {
  ForecastdayEntity,
  WeatherCondition,
  WeatherData,
  WeatherResponse,
} from "@/types/weather";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (
      !req.query.city ||
      req.query.city === "undefined" ||
      req.query.city === ""
    ) {
      res.status(204).send("Can't find empty city");
    }

    let data;
    data = await getWeatherConditions(req.query.city as string);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err);
  }
}

export const getWeatherConditions = async (city: string) => {
  const weatherAPIToken = process.env.WEATHERAPI_TOKEN;

  if (!weatherAPIToken) {
    throw new Error("Missing weather api environment config data");
  }

  try {
    const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${weatherAPIToken}&q=${city}&days=1&aqi=no&alerts=no`;

    const weatherRes = await fetch(weatherUrl, {
      headers: { "Content-Type": "application/json" },
    });

    if (weatherRes.status !== 200) {
      throw new Error("Bad request to weather api");
    }

    const data = (await weatherRes.json()) as WeatherResponse;

    const weatherConditionFromApi = getWeatherCondition(
      data.forecast.forecastday![0]
    );

    const transformedData: WeatherData = {
      currentTemp: data.current.temp_c,
      dailyMaxTemp: data.forecast.forecastday![0].day.maxtemp_c,
      dailyMinTemp: data.forecast.forecastday![0].day.mintemp_c,
      condition: weatherConditionFromApi,
      date: data.forecast.forecastday![0].date,
    };

    return transformedData;
  } catch (err) {
    throw new Error(err as string);
  }
};

const getWeatherCondition = (forecast: ForecastdayEntity) => {
  let weatherCondition: WeatherCondition = "sunny";
  const weatherConditionFromApi = forecast.day.condition.text;

  if (
    weatherConditionFromApi === "Sunny" ||
    weatherConditionFromApi == "Clear"
  ) {
    weatherCondition = "sunny";
  } else if (weatherConditionFromApi === "Partly cloudy") {
    weatherCondition = "partly cloudy";
  } else if (
    weatherConditionFromApi === "Cloudy" ||
    weatherConditionFromApi == "Overcast"
  ) {
    weatherCondition = "cloudy";
  } else if (
    forecast.day.condition.text.includes("rain") ||
    forecast.day.condition.text.includes("Rain")
  ) {
    weatherCondition = "rain";
  }

  return weatherCondition;
};
