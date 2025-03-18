import React from 'react';
import {
    Typography,
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Avatar,
    useTheme
} from '@mui/material';
import { Cast } from '../../types';
import { getImageUrl } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

interface CastListProps {
    cast: Cast[];
    title?: string;
}

const CastCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: theme.shadows[8]
    },
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden'
}));

const CastImage = styled(CardMedia)(({ theme }) => ({
    height: 0,
    paddingTop: '150%', // 2:3 aspect ratio
    backgroundSize: 'cover',
    backgroundPosition: 'center'
}));

const CastAvatar = styled(Avatar)(({ theme }) => ({
    width: '100%',
    height: 0,
    paddingTop: '150%',
    borderRadius: 0,
    backgroundColor: theme.palette.grey[200]
}));

const CastName = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(0.5)
}));

const CharacterName = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.875rem'
}));

const CastList: React.FC<CastListProps> = ({ cast, title = 'Top Cast' }) => {
    const theme = useTheme();

    // Only show the top 6 cast members
    const displayCast = cast.slice(0, 6);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                {title}
            </Typography>
            <Grid container spacing={2}>
                {displayCast.map((person) => (
                    <Grid item xs={6} sm={4} md={2} key={person.id}>
                        <CastCard>
                            {person.profile_path ? (
                                <CastImage
                                    image={getImageUrl(person.profile_path, 'w300')}
                                    title={person.name}
                                />
                            ) : (
                                <CastAvatar>
                                    {person.name.charAt(0)}
                                </CastAvatar>
                            )}
                            <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                                <CastName variant="subtitle2" noWrap>
                                    {person.name}
                                </CastName>
                                <CharacterName variant="body2" noWrap>
                                    {person.character}
                                </CharacterName>
                            </CardContent>
                        </CastCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CastList; 