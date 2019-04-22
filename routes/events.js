const express = require('express')
const axios = require('axios')
const router = express.Router()

const upcomingEvents = () => {
    const BASE_URL = `https://api.meetup.com/find/upcoming_events?`
    const params   = `key=${process.env.MEETUP_SECRET_KEY}&sign=true&text=javascript`
    const url      = `${BASE_URL}${params}`

    return axios
        .get(url)
        .then(response => {
            const { data } = response
            return data
        })
        .catch(err => {
            console.error(err)
        })
}

router.get('/events', (req, res) => {
    upcomingEvents()
        .then(data => {
            console.log(data)
            res.render('events', { data })
        })
        .catch(err => console.error('Meetup API page failed'))
})

module.exports = router
