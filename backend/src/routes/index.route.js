const express = require('express');

const router = express.Router();
const authRouter = require('./auth.route');
const teacherRouter = require('./teacher.route');
const userRouter = require('./user.route');
const vocabularyRouter = require('./vocabulary.route');
const classroomRouter = require('./classroom.route');
const reviewRouter = require('./review.route');
const adminRouter = require('./admin.route');

router.use('/auth', authRouter);
router.use('/teacher', teacherRouter);
router.use('/user', userRouter);
router.use('/vocabulary', vocabularyRouter);
router.use('/classroom', classroomRouter);
router.use('/review', reviewRouter);
router.use('/admin', adminRouter);

module.exports = router;
