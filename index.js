const CONFIG = require('./config')
const express = require('express')
require('./database') // initialize db
require('./cronjobs/clean_stale_mixer_request')()
const standardizeResponse = require('./middlewares/standardizeResponse')
const errorHandler = require('./middlewares/errorHandler')
// require('./utils/web3/functions/index').getInfoFromTxnHash('0xa80095ea598e3b4d3df39722973a58d79d1207c3718429537a5b981d21635f48').then((res)=>{
// 	console.log(res)
// })
const app = express()
app.use(express.json())
app.use(standardizeResponse)

app.use('/api', require('./routes'))

app.use(express.static('public'))
app.get('*', (req, res, next) => {
	if (req.url.startsWith('/api')) next(); // exclude api routes
	try {
		res.sendFile(require('path').join(__dirname, 'public', 'index.html'));
	} catch (err) {
		next(err);
	}
});

app.use(errorHandler)

app.listen(CONFIG.PORT, ()=>{
    console.log(`⚡️[server]: Server is running at http://localhost:${CONFIG.PORT}`);
})
