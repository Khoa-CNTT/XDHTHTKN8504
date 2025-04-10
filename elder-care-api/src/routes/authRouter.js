import authController from '../controllers/authController.cjs'

const router = require('express').Router()

router.post('/signup', authController.registerUser)

export default router;
