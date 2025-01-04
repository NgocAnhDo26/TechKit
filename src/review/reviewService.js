import { prisma } from '../config/config.js';
import { getUrl } from '../util/util.js';

async function fetchProductReviewsWithQuery(product_id, query) {
    try {
        if (!product_id) {
            throw new Error('Product ID is required.');
        }

        // Check if query is defined and handle missing page parameter
        // console.log(query.page);
        const currentPage = query && query.page ? Math.max(Number(query.page), 1) : 1;
        // console.log(`Current page from query: ${currentPage}`); // Log to verify the value
        const pageSize = 5; 

        // Get the total number of reviews for the product
        const totalReviews = await prisma.product_review.count({
            where: { product_id: Number(product_id) }
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalReviews / pageSize);

        // Fetch reviews with account name (join using account_id)
        const reviews = await prisma.product_review.findMany({
            where: { product_id: Number(product_id) },
            skip: (currentPage - 1) * pageSize, 
            take: pageSize, 
            orderBy: { create_time: 'desc' },
            include: {
                account: { // Include the associated account information
                    select: {
                        name: true,
                        avatar: true // Get the avatar public ID
                    }
                }
            }
        });

        // Map over the reviews to add the full avatar URL
        const reviewsWithAvatarUrls = reviews.map(review => {
            // Assuming a getUrl function that retrieves the full URL of the avatar
            let avatarUrl;
            if (review.account.avatar) {
                avatarUrl = getUrl(review.account.avatar);
            }
            else {
                avatarUrl = getUrl('Techkit/avatar/default');
            }
             // Replace with actual avatar URL generation logic
            return {
                ...review,
                avatar_url: avatarUrl // Add avatar URL to the review object
            };
        });

        return {
            currentPage: currentPage,
            totalPages: totalPages,
            reviews: reviewsWithAvatarUrls
        };
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw new Error('Could not fetch reviews. Please try again later.');
    }
}



async function addUserReview(product_id, account_id, content) {
    try {
        // Validate input
        if (!product_id || !account_id || !content) {
            throw new Error('Product ID, Account ID, and content are required.');
        }

        // Check if the user has already reviewed this product
        const existingReview = await prisma.product_review.findFirst({
            where: {
                product_id: Number(product_id),
                account_id: Number(account_id)
            }
        });

        if (existingReview) {
            // If the review already exists, throw an error or return a message
            return {
                success: false,
                message: 'Bạn đã đánh giá sản phẩm này rồi'
            };
        }
        // Add the review to the database
        const newReview = await prisma.product_review.create({
            data: {
                product_id: Number(product_id),
                account_id: Number(account_id),
                content: content,
            }, 
            include: {
                account: { // Include account data (name, avatar)
                    select: {
                        name: true,
                        avatar: true
                    }
                }
            }
        });

        let avatarUrl = '';
        if (newReview.account.avatar) {
            avatarUrl = getUrl(newReview.account.avatar); 
        } else {
            avatarUrl = getUrl('avatar/default'); 
        }

        return {
            success: true,
            message: "Successfully added new review",
            review: {
                product_id: newReview.product_id,
                account_id: newReview.account_id,
                content: newReview.content,
                create_time: newReview.create_time,
                account: {
                    name: newReview.account.name,
                    avatar: newReview.account.avatar
                },
                avatar_url: avatarUrl // Attach the avatar URL to the review object
            }
        };

    } catch (error) {
        console.error('Error adding review:', error);
        throw new Error('Could not add review. Please try again later.');
    }
}

export {
    fetchProductReviewsWithQuery,
    addUserReview,
};

