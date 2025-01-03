import express from 'express';
import apiRoute from './api.js';
import serviceRoute from './users.js';

const router = express.Router();

router.use(`/api`, apiRoute);
router.use('', serviceRoute);

// Handle 404 - Not Found
router.use((req, res, next) => {
  res.status(404).render('error', {
    message: 'Xin lỗi, trang bạn yêu cầu không tồn tại',
    status: 404,
  });
});
export default router;
