const express = require('express')
const axios = require('axios')
const Event = require("../models/Event");
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

router.get("/events", (req, res, next) => {
  upcomingEvents()
    .then(data => {
      res.render("events", { data });
      helperFunction(data);
    })
    .catch(err => console.error("Meetup API page failed"));
});


const helperFunction = data => {
  Object.keys(data.events).forEach(key => {
    const event = data.events[key];
    const eventObject = {
      id: event.id,
      name: event.name,
      link: event.link,
      local_date: event.local_date,
      local_time: event.local_time,
      city: event.venue.city,
      address: event.venue.address_1,
      company: event.venue.name,
      visibility: event.visibility
    };
    
    const newEvent = new Event(eventObject);
      newEvent.save(function(err) {
      if (err) return handleError(err);
    });
  });
};

module.exports = router
