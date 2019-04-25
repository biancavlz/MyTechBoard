const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { authenticationCheck } = require('./tools/index')
const LearningMaterial = require('../models/LearningMaterial')
const Video = require('../models/Video')
const News = require('../models/News')
const Event = require('../models/Event')
const mongoose = require('mongoose')

const getLearningMaterialsQuery = function(techboard) {
    const learningMaterialIds = techboard.learningMaterials
    const objectIds = learningMaterialIds.map(id => {
        if (id) return mongoose.Types.ObjectId(id)
    })
    const query = LearningMaterial.where('_id').in(objectIds)
    return query
}

const getVideosQuery = function(techboard) {
    const videoIds = techboard.videos
    const objectIds = videoIds.map(id => {
        if (id) return mongoose.Types.ObjectId(id)
    })
    const query = Video.where('_id').in(objectIds)
    return query
}

const getNewsQuery = function(techboard) {
    const newsIds = techboard.news
    const objectIds = newsIds.map(id => {
        if (id) return mongoose.Types.ObjectId(id)
    })
    const query = News.where('_id').in(objectIds)
    return query
}

const getEventQuery = function(techboard) {
    const eventIds = techboard.events
    // console.log(eventIds)
    const objectIds = eventIds.map(id => {
        if (id) return mongoose.Types.ObjectId(id)
    })
    const query = Event.where('_id').in(objectIds)
    return query
}

router.get('/techboard', authenticationCheck, (req, res, next) => {
    if (!req.user.techboard) return res.render('techboard', { materials: [] })

    const queryLearning = getLearningMaterialsQuery(req.user.techboard)
    const queryVideo = getVideosQuery(req.user.techboard)
    const queryNews = getNewsQuery(req.user.techboard)
    const queryEvent = getEventQuery(req.user.techboard)

    Promise.all([queryLearning, queryVideo, queryNews, queryEvent])
        .then(([materials, videos, news, events]) => {
            res.render('techboard', { materials, videos, news, events })
        })
        .catch(err => {
            console.error('Error displaying techboard materials', err)
        })
})

router.post('/techboard', authenticationCheck, (req, res, next) => {
    const user = req.user
    if (typeof user.techboard === 'undefined') {
        const techboard = {
            learningMaterials: [],
            news: [],
            videos: [],
            events: []
        }
        user.techboard = techboard
    }
    if (req.body.resourceType === 'learningMaterial') {
        user.techboard.learningMaterials.push(req.body.resourceId)
    } else if (req.body.resourceType === 'video') {
        user.techboard.videos.push(req.body.resourceId)
    } else if (req.body.resourceType === 'news') {
        user.techboard.news.push(req.body.resourceId)
    } else if (req.body.resourceType === 'event') {
        console.log(req.body.resourceId)
        user.techboard.events.push(req.body.resourceId)
    }
    user.save()
        .then(() => {
            res.redirect('/techboard')
        })
        .catch(err => {
            console.error('Failed to save techboard', err)
        })
})

router.post('/techboard/delete', authenticationCheck, (req, res, next) => {
    const user = req.user

    if (req.body.resourceType === 'learningMaterial') {
        let indexToDeleted = user.techboard.learningMaterials.indexOf(req.body.resourceId)
        user.techboard.learningMaterials.splice(indexToDeleted, 1)
    } else if (req.body.resourceType === 'video') {
        let indexToDeleted = user.techboard.videos.indexOf(req.body.resourceId)
        user.techboard.videos.splice(indexToDeleted, 1)
    } else if (req.body.resourceType === 'news') {
        let indexToDeleted = user.techboard.news.indexOf(req.body.resourceId)
        user.techboard.news.splice(indexToDeleted, 1)
    } else if (req.body.resourceType === 'event') {
        let indexToDeleted = user.techboard.events.indexOf(req.body.resourceId)
        user.techboard.events.splice(indexToDeleted, 1)
    }
    user.save()
        .then(() => {
            res.redirect('/techboard')
        })
        .catch(err => {
            console.error('Failed to save techboard', err)
        })
})

module.exports = router
