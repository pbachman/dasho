# Dasho

Simple and customizable Dashboard, made with Ionic, angular5, Node.JS and GraphQL (former [CAS_FEE@HSR](https://www.hsr.ch) Diploma thesis 2016).

![Heroku](http://heroku-badge.herokuapp.com/?app=dasho&style=flat&svg=1)

<img src="https://user-images.githubusercontent.com/393635/61664879-06e18d00-acd4-11e9-8c3a-6bfae3db12c2.gif" />

## Getting Started

### Prerequisites

- Node >= 10.0

### Used external Libraries

* [Draggabilly](https://draggabilly.desandro.com)
* [Highcharts](https://github.com/highcharts/highcharts)
* [Moment.js](https://momentjs.com)
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
* Google Pagespeed
* News (from **[NewsApi](https://newsapi.org)**)
* Twitter
* Weather (from **[OpenWeatherMap](https://openweathermap.org)**)
* Water Temperature (from **[Wiewarm.ch](https://www.wiewarm.ch)**)

## Missing a Tile ? How to add your own Tile(s) ?

* Create a new Tile Component and extends it with TileBaseComponent (under src/app/tiles)
* Define the GraphQL Schema (under api/schema) and add the Resolve Logic in the Schema File

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
