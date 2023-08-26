# [MissingLink](https://missinglink.link)

MissingLink is a project designed to track the performance of Metlink's buses over time. It consists of a back-end that polls Metlink's APIs every 20 minutes to collect and display data on Metlink's bus movements and performance.

I found the stats interesting and thought they should be shared with the world, so I built a site to display the information.

<p align="center">
  <img src="public/preview.png">
</p>

https://user-images.githubusercontent.com/18430086/196853160-8ed89ae5-3da6-40d3-b974-b0166b4c0391.mp4

## Tech

The front-end is built with React using the NextJS framework and it's hosted on Vercel.

The back-end is built in C# using .Net Core and Postgres for the database, hosted on an EC2 instance in AWS, with Nginx in front.

## Data Challenges

**Missing data**

If you poke around the data long enough, you will find days where there's no statistics. This was usually for 1 of 2 reasons: either I've made a mistake in my coding, or MetLink/Auckland Transport have a mistake on their end.

I had to re-write the backend because MetLink have an untyped backend that was sending me bad data on occasion. My API is now more flexible and that issue shouldn't crop up again.

Apologies for the gaps, I'm doing my best!

**Auckland Transport**

Auckland Transport's API data is a little funky (at least to me). They report trips that are going to happen in the future, and also report multiple trips for one vehicle. As a result of this, I have to "clean" the Auckland data somewhat. 

I don't like muddling about with the data, as I want it to come straight from the horse's mouth. However, it wouldn't be genuine for me to say trips aren't reporting their time, when in fact they don't run for another 24 hours. Or to double report a vehicle that is running late if it appears on the list of trips twice.

As such, I follow these two steps: 1) I will only take the latest trip if it's 1 vehicle on 2 trips 2) no trip updates with a start date in the future are taken into account in the data.
