const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Paolo'
  })
})
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    name: 'Paolo',
    metaTitle: 'About'
  })
})
app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    name: 'Paolo',
    text: 'help me please',
    metaTitle: 'Help'
  })
})

app.get('/weather', (req, res) => {
  const { query } = req
  const location = query.address
  if (!location) {
    return res.send({
      error: 'You must provide an address'
    })
  }

  geocode(location, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error })
    }

    forecast(
      latitude,
      longitude,
      (error, { temperature, precipProbability } = {}) => {
        if (error) {
          return res.send({ error })
        }

        res.send({
          metaTitle: 'Weather',
          forecast: `It is currently ${temperature} degrees out in ${location}. There is a ${precipProbability}% chance of rain.`,
          location,
          temperature,
          precipProbability,
          address: query.address
        })
      }
    )
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: 'Help article not found',
    text: 'Search again for another article',
    name: 'Paolo',
    metaTitle: 'Help'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404 not found',
    text: 'Try again',
    name: 'Paolo',
    metaTitle: '404'
  })
})

app.listen(3000, () => {
  console.log('Server is up on port 3000.')
})
