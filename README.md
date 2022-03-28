# [MissingLink](https://missinglink.link)

I wanted to see what Metlink's performance looked like over time, so I initially built an API to poll Metlink's buses every 20 minutes.

I found the stats interesting and thought they should be shared with the world, so I built a front end to display the information.

There's quite a few days when the backend wasn't recording data, this was due to the MetLink API being down during COVID lockdowns, or just plain broken. They obviously use an untyped language on their backed as a few times they had strings in number fields returned in their API which was messing with my C# backend.

<p align="center">
  <img src="public/preview.png">
</p>

## Tech

### Front End

The front end is written with React using the [NextJS](https://nextjs.org/) framework, I absolutely love it. It's hosted up in Vercel as it's integrated and much easier than me spinning anything myself.

I didn't use any component libraries or anything, for something as small as this site I prefer to personally style the site to keep my css sharp.

### Backend

The back end is written in C# in dotnet core. It's hosted in an EC2 instance in AWS, with Nginx in front. The database is Postgres. It's all packed into one little micro EC2 haha. I don't plan on open-sourcing the backend but can if anyone expresses interest.

It's a pretty simple backend, just the one controller. In saying that, to pull together the info that I need for the front end from MetLink's API, I have to make 6 calls I believe, it's pretty convoluted.
