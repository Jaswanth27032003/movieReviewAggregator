import React, { useState } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, useTheme, alpha, styled } from '@mui/material';
import TrendingScroller from './TrendingScroller';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import { MediaItem } from '../../types'; // Import the shared MediaItem type


// Usage in TrendingToggle
interface TrendingToggleProps {
    movies: MediaItem[];
    tvShows: MediaItem[];
    loading: boolean;
    genreMap: Record<number, string>;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0.5),
        border: 0,
        borderRadius: theme.shape.borderRadius,
        '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.8),
            color: theme.palette.primary.contrastText,
            fontWeight: 'bold',
            '&:hover': {
                backgroundColor: theme.palette.primary.main,
            },
        },
        '&:not(.Mui-selected)': {
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            '&:hover': {
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
            },
        },
    },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    padding: theme.spacing(1, 3),
    fontWeight: 600,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&:hover': {
        transform: 'translateY(-2px)',
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    position: 'relative',
    display: 'inline-block',
    marginBottom: theme.spacing(2),
    fontWeight: 800,
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: -8,
        left: 0,
        width: '40%',
        height: 4,
        backgroundColor: theme.palette.primary.main,
        borderRadius: 2,
    },
}));

// Wrapper to maintain component state when toggling
const ContentWrapper = styled(Box)({
    width: '100%',
    position: 'relative',
    overflow: 'hidden', // Prevent any potential scroll interference
});

// Container for each content type that preserves its state
const ContentContainer = styled(Box)({
    width: '100%',
    height: '100%',
});

const TrendingToggle: React.FC<TrendingToggleProps> = ({
    movies,
    tvShows,
    loading = false,
    genreMap = {},
}) => {
    const theme = useTheme();
    const [mediaType, setMediaType] = useState<'movies' | 'tv'>('movies');

    const handleMediaTypeChange = (
        event: React.MouseEvent<HTMLElement>,
        newMediaType: 'movies' | 'tv' | null,
    ) => {
        if (newMediaType !== null) {
            setMediaType(newMediaType);
        }
    };

    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <SectionTitle variant="h4">
                    Trending
                </SectionTitle>
                <StyledToggleButtonGroup
                    value={mediaType}
                    exclusive
                    onChange={handleMediaTypeChange}
                    aria-label="media type"
                    size="small"
                >
                    <StyledToggleButton value="movies" aria-label="movies">
                        <MovieIcon fontSize="small" />
                        Movies
                    </StyledToggleButton>
                    <StyledToggleButton value="tv" aria-label="tv shows">
                        <TvIcon fontSize="small" />
                        TV Shows
                    </StyledToggleButton>
                </StyledToggleButtonGroup>
            </Box>

            {/* Both components are always rendered but only one is visible */}
            {/* This preserves the scroll position of each section */}
            <ContentWrapper>
                <ContentContainer sx={{ display: mediaType === 'movies' ? 'block' : 'none' }}>
                    <TrendingScroller
                        key="movies-scroller"
                        movies={movies}
                        loading={loading}
                        genreMap={genreMap}
                    />
                </ContentContainer>
                <ContentContainer sx={{ display: mediaType === 'tv' ? 'block' : 'none' }}>
                    <TrendingScroller
                        key="tv-scroller"
                        movies={tvShows}
                        loading={loading}
                        genreMap={genreMap}
                    />
                </ContentContainer>
            </ContentWrapper>
        </Box>
    );
};

export default TrendingToggle; 