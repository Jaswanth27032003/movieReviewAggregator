import React from 'react';
import {
    Box,
    Typography,
    Paper,
    useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface RatingDistribution {
    rating: number; // 1 to 5
    count: number;
    percentage: number; // 0 to 100
}

interface RatingsDistributionProps {
    distributions: RatingDistribution[];
    totalRatings: number;
}

const DistributionContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    height: '100%',
}));

const barHeights: { [key: number]: number } = {
    1: 60, // 1★
    2: 100, // 2★
    3: 150, // 3★
    4: 230, // 4★
    5: 300,  // 5★
};

const RatingBarContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center', // Center the bars
    alignItems: 'flex-end', // Align bars from the bottom
    height: 400, // Increased height to accommodate the tallest bar (300px) with spacing
    marginTop: theme.spacing(4),
    gap: theme.spacing(2), // Equal spacing between bars
}));

const RatingBar = styled(Box)<{ rating: number }>(({ theme, rating }) => ({
    width: 30,
    height: `${barHeights[rating]}px`, // Fixed height based on rating
    backgroundColor: theme.palette.warning.main, // Yellow/pink as per screenshot
    borderRadius: theme.shape.borderRadius,
    transition: 'height 0.3s ease-in-out',
}));

const RatingLabel = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    marginTop: theme.spacing(1),
    color: theme.palette.warning.main, // Match bar color
    fontWeight: 'bold',
}));

const RatingDetails = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
}));

const RatingsDistribution: React.FC<RatingsDistributionProps> = ({ distributions, totalRatings }) => {
    const theme = useTheme();
    console.log('Distributions data:', distributions); // Debug log to check data

    // Ensure all 5 rating levels are included, even with zero counts
    const completeDistributions = Array.from({ length: 5 }, (_, i) => {
        const dist = distributions.find((d) => d.rating === i + 1) || {
            rating: i + 1,
            count: 0,
            percentage: 0,
        };
        return dist;
    }).reverse(); // Reverse to show 5★ to 1★ from left to right

    return (
        <DistributionContainer>
            <Typography variant="h6" gutterBottom>
                Rating Distribution ({totalRatings} total)
            </Typography>
            <RatingBarContainer>
                {completeDistributions.map((dist) => (
                    <Box
                        key={dist.rating}
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <RatingBar rating={dist.rating} />
                        <RatingLabel variant="body2">{dist.rating}★</RatingLabel>
                        <RatingDetails>
                            {dist.count} ({dist.percentage.toFixed(1)}%)
                        </RatingDetails>
                    </Box>
                ))}
            </RatingBarContainer>
        </DistributionContainer>
    );
};

export default RatingsDistribution;