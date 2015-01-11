#!/usr/bin/env node
console.log("Welcome to the MyJourney Server with Node.js. We started the server right now.")

theapp = require('./controller/main_controller')
theapp.startup()