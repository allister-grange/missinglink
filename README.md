# [MissingLink](https://missinglink.link)

MissingLink is an application to visualise and collate data on various public transport agencies in New Zealand.

It consists of a backend that polls various sources of transport data across New Zealand every 15 minutes, and a front end to visualise said data. I found the stats interesting and thought they should be shared, so I built the site.

<p align="center">
  <img src="public/preview.png">
</p>

https://user-images.githubusercontent.com/18430086/196853160-8ed89ae5-3da6-40d3-b974-b0166b4c0391.mp4

## Tech

The front-end is built with React using the NextJS framework and it's hosted on Vercel.

The back-end is built in C# using .Net and Postgres for the database, hosted on an EC2 instance in AWS, with Nginx in fronting the server.

## Environment Variables

To run this project, you will need to add the following environment variables to your `appsettings.json` file.

`MetlinkApiConfig.ApiKey`, this can be retrieved from [Metlink's API](https://opendata.metlink.org.nz/apis).

I use two keys for the `AtApiConfig` and bounce the requests between them so as not to hit API quota limites too quickly. The key used for the request is randomly selected between the two configuration items at runtime.

`AtApiConfig.ApiKey1` and `AtApiConfig.ApiKey2` will be created with your account for [AT's API](https://dev-portal.at.govt.nz/).


## API Reference

All services are refreshed every 15 minutes.

Dates are formatted `YYYY-MM-DDTHH:MM:SS`

| Path                                                             | Method | Tags            | Description                               |
| ---------------------------------------------------------------- | ------ | --------------- | ----------------------------------------- |
| `/api/v1/at/services`                                            | GET    | AtServices      | Retrieve latest batch of AT services      |
| `/api/v1/at/statistics?startDate={<DATE>}&endDate={<DATE>}`      | GET    | AtServices      | Retrieve statistics (with date filters)   |
| `/api/v1/at/worstServices`                                       | GET    | AtServices      | Retrieve list of worst services           |
| `/api/v1/metlink/services`                                       | GET    | MetlinkServices | Retrieve latest batch of Metlink services |
| `/api/v1/metlink/statistics?startDate={<DATE>}&endDate={<DATE>}` | GET    | MetlinkServices | Retrieve statistics (with date filters)   |
| `/api/v1/metlink/worstServices`                                  | GET    | MetlinkServices | Retrieve list of worst services           |

## Data Challenges

**Missing data**

If you poke around the data long enough, you will find days where there's no statistics. This was usually for 1 of 2 reasons: either I've made a mistake in my coding, or MetLink/Auckland Transport have a mistake on their end.

There was an extended period of no data as I had to re-write the due to MetLink having an untyped backend that was sending numbers as strings. The MissingLink API is now more flexible at dealing with incorrect data types and that issue shouldn't crop up again.

**Auckland Transport**

Auckland Transport includes trip updates that are going to happen in the future, they also report multiple trips for one vehicle when there is a turnaround point for the service. As a result of this, I "clean" the Auckland data somewhat, to be more fair on them.

I don't like muddling about with the data, as I want it to come straight from the horse's mouth. However, it wouldn't be genuine for me to say trips aren't reporting their time, when in fact they don't run for another 24 hours. Or to double report a vehicle that is running late if it appears on the list of trips twice, as it is both late in it's current route, and will be late again when it turns around.

As such, I follow these two steps: 1) I will only take the most recent trip update if it's 1 vehicle represented by more than 1 trip 2) no trip updates with a start date in the future are taken into account in the data.

## Contributing

Contributions are always welcome! Go hard and open a pull request. Flicking me an email, or opening up a GitHub issue with critiques would be much appreciated.
