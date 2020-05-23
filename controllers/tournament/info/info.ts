import express from 'express'

const router = express.Router()

router.route('/info')
.get((req, res) => { // get selected tournament details

})
.put((req, res) => { // modify selected tournament details

})
.post((req, res) => { // create new tournament

})

export default router