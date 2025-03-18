import axios from 'axios';
import { Review, ReviewFormData, User } from '../types';
import { API_URL } from '../config';

// Interface for the response from the API
interface ReviewResponse {
    reviews: Review[];
    total: number;
}

// Mock users for development (matching User interface)
const mockUsers: User[] = [
    {
        id: 'user1',
        username: 'MovieFan123',
        email: 'moviefan123@example.com',
        profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
        createdAt: '2023-01-15T10:30:00Z',
        updatedAt: '2023-01-15T10:30:00Z'
    },
    {
        id: 'user2',
        username: 'FilmCritic99',
        email: 'filmcritic99@example.com',
        profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
        createdAt: '2023-02-10T14:20:00Z',
        updatedAt: '2023-02-10T14:20:00Z'
    },
    {
        id: 'user3',
        username: 'CinemaLover',
        email: 'cinemalover@example.com',
        profilePicture: 'https://randomuser.me/api/portraits/men/67.jpg',
        createdAt: '2023-03-05T09:15:00Z',
        updatedAt: '2023-03-05T09:15:00Z'
    },
    {
        id: 'user4',
        username: 'DirectorsFan',
        email: 'directorsfan@example.com',
        profilePicture: 'https://randomuser.me/api/portraits/women/17.jpg',
        createdAt: '2023-04-20T16:45:00Z',
        updatedAt: '2023-04-20T16:45:00Z'
    },
    {
        id: 'user5',
        username: 'SciFiEnthusiast',
        email: 'scifienthusiast@example.com',
        profilePicture: 'https://randomuser.me/api/portraits/men/22.jpg',
        createdAt: '2023-05-12T11:30:00Z',
        updatedAt: '2023-05-12T11:30:00Z'
    }
];

// Mock reviews for development
const mockReviews: Review[] = [
    {
        _id: 'review1',
        user: mockUsers[0],
        movie: 'movie1',
        rating: 4.5,
        content: 'This movie was fantastic! Great performances and stunning visuals.',
        likes: ['user2', 'user3'],
        createdAt: '2023-06-15T14:30:00Z',
        updatedAt: '2023-06-15T14:30:00Z'
    },
    {
        _id: 'review2',
        user: mockUsers[1],
        movie: 'movie1',
        rating: 3.5,
        content: 'Good movie, but the pacing was a bit off in the middle.',
        likes: ['user1'],
        createdAt: '2023-06-20T10:15:00Z',
        updatedAt: '2023-06-20T10:15:00Z'
    },
    {
        _id: 'review3',
        user: mockUsers[2],
        movie: 'movie2',
        rating: 5,
        content: 'Absolutely loved it! One of the best films I\'ve seen this year.',
        likes: ['user1', 'user4', 'user5'],
        createdAt: '2023-07-05T16:45:00Z',
        updatedAt: '2023-07-05T16:45:00Z'
    }
];

/**
 * Get reviews for a movie
 * @param movieId - The ID of the movie
 * @param page - The page number (default: 1)
 * @param limit - The number of reviews per page (default: 5)
 * @returns Promise with reviews and total count
 */
export const getMovieReviews = async (
    movieId: string,
    page: number = 1,
    limit: number = 5
): Promise<ReviewResponse> => {
    try {
        // For development, return mock data instead of making API call
        return mockReviewResponse(movieId);

        // Uncomment this when the server is running
        // const response = await axios.get(`${API_URL}/reviews/movie/${movieId}`, {
        //     params: { page, limit },
        // });
        // return response.data;
    } catch (error) {
        console.error('Error fetching movie reviews:', error);
        throw error;
    }
};

/**
 * Create a new review for a movie
 * @param movieId - The ID of the movie
 * @param reviewData - The review data (rating and content)
 * @returns Promise with the created review
 */
export const createReview = async (
    movieId: string,
    reviewData: ReviewFormData
): Promise<Review> => {
    try {
        // For development, return mock data instead of making API call
        return mockCreateReview(movieId, reviewData);

        // Uncomment this when the server is running
        // const response = await axios.post(`${API_URL}/reviews/movie/${movieId}`, reviewData);
        // return response.data;
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};

/**
 * Update an existing review
 * @param reviewId - The ID of the review to update
 * @param reviewData - The updated review data
 * @returns Promise with the updated review
 */
export const updateReview = async (
    reviewId: string,
    reviewData: ReviewFormData
): Promise<Review> => {
    try {
        // For development, return mock data instead of making API call
        return {
            _id: reviewId,
            ...reviewData,
            user: mockUsers[0],
            movie: 'mock-movie-id',
            likes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Uncomment this when the server is running
        // const response = await axios.put(`${API_URL}/reviews/${reviewId}`, reviewData);
        // return response.data;
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};

/**
 * Delete a review
 * @param reviewId - The ID of the review to delete
 * @returns Promise with success status
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
    try {
        // No mock return needed for delete operation

        // Uncomment this when the server is running
        // await axios.delete(`${API_URL}/reviews/${reviewId}`);
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};

/**
 * Like or unlike a review
 * @param reviewId - The ID of the review to like/unlike
 * @returns Promise with the updated review object
 */
export const likeReview = async (reviewId: string): Promise<Review> => {
    try {
        // For development, find the review in mockReviews and update its likes
        const review = mockReviews.find((r: Review) => r._id === reviewId);

        if (!review) {
            throw new Error('Review not found');
        }

        // Toggle like status for current user (using a placeholder user ID)
        const currentUserId = 'current-user-id'; // In a real app, this would come from auth context
        const likes = [...(review.likes || [])];

        const userIndex = likes.indexOf(currentUserId);
        if (userIndex === -1) {
            likes.push(currentUserId);
        } else {
            likes.splice(userIndex, 1);
        }

        // Create updated review with new likes array
        const updatedReview = {
            ...review,
            likes
        };

        // Update the review in mockReviews
        const reviewIndex = mockReviews.findIndex((r: Review) => r._id === reviewId);
        if (reviewIndex !== -1) {
            mockReviews[reviewIndex] = updatedReview;
        }

        return updatedReview;

        // Uncomment this when the server is running
        // const response = await axios.put(`/api/reviews/like/${reviewId}`);
        // return response.data;
    } catch (error) {
        console.error('Error liking review:', error);
        throw error;
    }
};

// Mock data functions for development
const mockReviewResponse = (movieId: string): ReviewResponse => {
    const reviews: Review[] = [
        {
            _id: '1',
            rating: 4.5,
            content: 'This movie was amazing! The visual effects were stunning and the story kept me engaged throughout.',
            user: mockUsers[0],
            movie: movieId,
            likes: ['user2', 'user3'],
            createdAt: '2023-05-15T10:30:00Z',
            updatedAt: '2023-05-15T10:30:00Z',
        },
        {
            _id: '2',
            rating: 3,
            content: 'It was okay. Some parts were good but the pacing was off in the middle.',
            user: mockUsers[1],
            movie: movieId,
            likes: [],
            createdAt: '2023-05-10T14:20:00Z',
            updatedAt: '2023-05-10T14:20:00Z',
        },
        {
            _id: '3',
            rating: 5,
            content: 'One of the best films I\'ve seen this year! The acting was superb and the direction was flawless.',
            user: mockUsers[2],
            movie: movieId,
            likes: ['user1', 'user4', 'user5'],
            createdAt: '2023-05-05T09:15:00Z',
            updatedAt: '2023-05-05T09:15:00Z',
        },
        {
            _id: '4',
            content: 'This movie was amazing! The visual effects were stunning and the story kept me engaged throughout.',
            rating: 4.5,
            createdAt: 'May 15, 2023',
            updatedAt: 'May 15, 2023',
            likes: ['user2', 'user3'],
            movie: movieId,
            user: mockUsers[3],
        },
        {
            _id: '5',
            content: 'Loved the cinematography! The score was also phenomenal.',
            rating: 5,
            createdAt: 'May 5, 2023',
            updatedAt: 'May 5, 2023',
            likes: ['user1', 'user4', 'user5'],
            movie: movieId,
            user: mockUsers[4],

        }
    ];

    return {
        reviews,
        total: reviews.length,
    };
};

const mockCreateReview = (movieId: string, reviewData: ReviewFormData): Review => {
    return {
        _id: Math.random().toString(36).substring(2, 9),
        ...reviewData,
        user: mockUsers[0],
        movie: movieId,
        likes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
};

export default {
    getMovieReviews,
    createReview,
    updateReview,
    deleteReview,
    likeReview,
}; 