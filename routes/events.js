const express = require('express')
const axios = require('axios')
const router = express.Router()

const upcomingEvents = () => {
    const query = `?key=${process.env.MEETUP_SECRET_KEY}&sign=true&text=javascript`
    const url = `https://api.meetup.com/find/upcoming_events` + query

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
        })
        .catch(err => console.error('erro'))
})

module.exports = router
