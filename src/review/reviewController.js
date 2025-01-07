import express from 'express';
import * as service from './reviewService.js';

const router = express.Router();

router.get('/:product_id', async (req, res) => {
    const { product_id } = req.params;

    try {
        if (!product_id) {
            return res.status(400).json({ error: 'Product ID is required.' });
        }

        // Fetch reviews using the service function
        const reviews = await service.fetchProductReviewsWithQuery(product_id,req.query);
        // Send response
        // if (reviews.reviews.length === 0) {
        //     return res.status(404).json({ message: 'No reviews found for this product.' });
        // }

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

router.post('/', (req, res, next) => {
    req.user
        ? next()
        : res.redirect('/auth/login');
    },
    async (req, res) => {
    const { product_id, content } = req.body;
    const account_id = req.user.id; 
    try {
        if (!product_id || !content) {
            return res.status(400).json({ error: 'Product ID and content are required.' });
        }

        const result = await service.addUserReview(product_id, account_id, content);

        // Send success response
        res.status(201).json(result); // HTTP 201 Created
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Could not add review. Please try again later.' });
    }
});

export async function renderReviews(req,res) {

}

export default router;