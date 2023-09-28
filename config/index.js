/* eslint-disable no-undef */
require('dotenv').config()

const RUNTIME_ENV = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 3000
module.exports = {
    RUNTIME_ENV,
    PORT
}