# Dasho

Simple and customizable Dashboard, made with Ionic, angular5, Node.JS and GraphQL (former [CAS_FEE@HSR](https://www.hsr.ch) Diploma thesis 2016).

![Heroku](http://heroku-badge.herokuapp.com/?app=dasho&style=flat&svg=1) <img src="https://github.com/pbachman/dasho/workflows/Node%20CI/badge.svg" />

<img src="https://user-images.githubusercontent.com/393635/61664879-06e18d00-acd4-11e9-8c3a-6bfae3db12c2.gif" />

## Getting Started

### Prerequisites

- Node >= 10.0

### Used external Libraries

* [Draggabilly](https://draggabilly.desandro.com)
* [Highcharts](https://github.com/highcharts/highcharts)
* [day.js](https://day.js.org)
* [Packery](https://packery.metafizzy.co)

### Installing

```
npm install -g ionic mocha
```

```
yarn install
```

## How to start

Frontend

```
ionic serve
```

Backend

```
node server
```

## Features (Tiles)

* Clock
* Currency (from **[Fixer](https://fixer.io)**)
* Github
* Google Pagespeed
* News (from **[NewsApi](https://newsapi.org)**)
* Twitter
* Water Temperature (from **[Wiewarm.ch](https://www.wiewarm.ch)**)
* Weather (from **[OpenWeatherMap](https://openweathermap.org)**)

## Missing a Tile ? How to add your own Tile(s) ?

* Create a new Tile Component, extends the Component with TileBaseComponent and add it to the TilesModules (under src\app\modules\tiles)
* Create a new GraphQL Schema File (under api) and define your own Resolve Logic (in schema.js)

## Configuration

All important settings like ApiKeys, Mailserver Settings, etc. are contained in the .env file. Please look at the .env.example file.

## Running the tests

```
npm test
```
## DEMO

You will find a productive Version under **[https://dasho.herokuapp.com](https://dasho.herokuapp.com)**. Login with Username *hi@dasho.co* and Password *test1234*.

## Authors

* **[Phil](https://github.com/pbachman)** - *Initial work*
* **[jonnitto](https://github.com/jonnitto)** - *Initial work* 

## License

This project is licensed under the **[MIT license](http://opensource.org/licenses/mit-license.php)**.

## Acknowledgments

Special thanks to [jonnitto](https://github.com/jonnitto) for the support and his incredible work.
