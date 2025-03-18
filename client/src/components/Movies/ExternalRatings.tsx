import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    LinearProgress,
    Tooltip,
    Divider,
    useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ExternalRating {
    source: string;
    value: string;
    score?: number; // Normalized score out of 5
    logo?: string;
}

interface ExternalRatingsProps {
    ratings: ExternalRating[];
}

const RatingContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    height: '100%',
}));

const RatingItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const RatingLogo = styled('img')(({ theme }) => ({
    width: 40,
    height: 40,
    objectFit: 'contain',
    marginRight: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
}));

const RatingScore = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'center',
    color: theme.palette.text.primary,
}));

const ScoreProgress = ({ score }: { score: number }) => {
    const theme = useTheme();
    const normalizedScore = Math.min(Math.max(score, 0), 100); // Ensure 0-100 range

    let color = theme.palette.error.main;
    if (normalizedScore >= 70) color = theme.palette.success.main;
    else if (normalizedScore >= 40) color = theme.palette.warning.main;

    return (
        <LinearProgress
            variant="determinate"
            value={normalizedScore}
            sx={{
                height: 8,
                borderRadius: 4,
                width: '100%',
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': { backgroundColor: color },
            }}
        />
    );
};

const ratingLogos: { [key: string]: string } = {
    IMDb: 'https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg',
    TMDb: 'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef4b7d7e580b5c5f619b8c6f3d6f87c2c6e1e6a3d6e.svg',
    'Rotten Tomatoes': 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg',
    Metacritic: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Metacritic_logo.svg/1200px-Metacritic_logo.svg.png',
};

const ExternalRatings: React.FC<ExternalRatingsProps> = ({ ratings }) => {
    const theme = useTheme();

    const normalizedRatings = ratings.map((rating) => ({
        ...rating,
        score: rating.score !== undefined && !isNaN(rating.score) ? rating.score * 20 : 0, // Convert 0-5 to 0-100
    }));

    const validScores = normalizedRatings
        .filter((rating) => rating.score !== undefined && !isNaN(rating.score))
        .map((rating) => rating.score!);
    const averageScore = validScores.length > 0 ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length) : 0;
    console.log('Normalized ratings for average:', normalizedRatings, 'Average score:', averageScore);

    if (!ratings || ratings.length === 0) {
        return (
            <RatingContainer elevation={2}>
                <Typography variant="h6" gutterBottom>
                    Ratings & Reviews
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    No external ratings available.
                </Typography>
            </RatingContainer>
        );
    }

    return (
        <RatingContainer elevation={2}>
            <Typography variant="h6" gutterBottom>
                Ratings & Reviews
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor:
                                averageScore >= 70
                                    ? theme.palette.success.main
                                    : averageScore >= 40
                                        ? theme.palette.warning.main
                                        : theme.palette.error.main,
                            color: 'white',
                        }}
                    >
                        <Typography variant="h6">{averageScore}</Typography>
                    </Box>
                </Box>
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Average Score
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Based on {normalizedRatings.length} external source{normalizedRatings.length !== 1 ? 's' : ''}
                    </Typography>
                </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                {normalizedRatings.map((rating, index) => (
                    <Grid item xs={12} key={index}>
                        <RatingItem>
                            {rating.logo ? (
                                <RatingLogo src={rating.logo} alt={rating.source} />
                            ) : (
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        mr: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: theme.palette.grey[200],
                                        borderRadius: theme.shape.borderRadius,
                                    }}
                                >
                                    <Typography variant="subtitle2">{rating.source.charAt(0)}</Typography>
                                </Box>
                            )}
                            <Box sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="subtitle2">{rating.source}</Typography>
                                    <Tooltip title={`${rating.score}/100`}>
                                        <RatingScore variant="body2">{rating.value}</RatingScore>
                                    </Tooltip>
                                </Box>
                                <ScoreProgress score={rating.score || 0} />
                            </Box>
                        </RatingItem>
                    </Grid>
                ))}
            </Grid>
        </RatingContainer>
    );
};

export default ExternalRatings;