const CONFIG = require('./config')
const express = require('express')
const standardizeResponse = require('./middlewares/standardizeResponse')
const errorHandler = require('./middlewares/errorHandler')
const app = express()

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
