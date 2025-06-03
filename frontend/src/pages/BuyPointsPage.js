import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
  Paper,
  keyframes,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Star, LocalOffer, TrendingUp, Diamond, Rocket, WorkspacePremium } from '@mui/icons-material';

// Enhanced Animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.5; }
`;

const gradientText = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shine = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255,215,0,0.2)'
      : '0 20px 40px rgba(0,0,0,0.2), 0 0 20px rgba(255,215,0,0.1)',
  },
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, rgba(26,26,26,0.9) 0%, rgba(45,45,45,0.9) 100%)'
    : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.9) 100%)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
    backgroundSize: '200% 200%',
    animation: `${gradientText} 3s ease infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
    backgroundSize: '200% 200%',
    animation: `${shine} 3s linear infinite`,
    pointerEvents: 'none',
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700)',
  backgroundSize: '200% 200%',
  animation: `${gradientText} 3s ease infinite`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  textShadow: '0 2px 10px rgba(255,215,0,0.3)',
}));

const FloatingIcon = styled(Box)(({ theme }) => ({
  animation: `${float} 4s ease-in-out infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))',
}));

const pointsPackages = [
  {
    id: 1,
    points: 1000,
    price: 1000,
    description: 'Perfect for getting started with your first points purchase.',
    savings: 0,
    icon: <Star sx={{ fontSize: 50, color: '#FFD700' }} />,
    features: ['Basic Support', 'Standard Processing', '24/7 Access'],
    gradient: 'linear-gradient(45deg, #FFD700, #FFA500)',
  },
  {
    id: 2,
    points: 2000,
    price: 1500,
    description: 'Best value! More points for less with premium features.',
    savings: 500,
    icon: <Diamond sx={{ fontSize: 50, color: '#FFD700' }} />,
    features: ['Priority Support', 'Faster Processing', 'Exclusive Deals'],
    popular: true,
    gradient: 'linear-gradient(45deg, #FFD700, #FF4500)',
  },
  {
    id: 3,
    points: 5000,
    price: 3000,
    description: 'Go big or go home. Maximize your earnings potential.',
    savings: 2000,
    icon: <Rocket sx={{ fontSize: 50, color: '#FFD700' }} />,
    features: ['VIP Support', 'Instant Processing', 'Special Rewards'],
    gradient: 'linear-gradient(45deg, #FFD700, #FF1493)',
  },
];

const BuyPointsPage = () => {
  const theme = useTheme();

  const handleBuyPoints = (packageId) => {
    console.log(`Attempting to buy package ${packageId}`);
    alert(`You selected package ${packageId}. Payment gateway coming soon!`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        px: { xs: 2, sm: 3, md: 4 },
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(145deg, #f5f5f5 0%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0) 70%)',
          animation: `${pulse} 4s ease-in-out infinite`,
        },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8, position: 'relative' }}>
          <WorkspacePremium 
            sx={{ 
              fontSize: 60, 
              color: '#FFD700',
              position: 'absolute',
              top: -30,
              left: '50%',
              transform: 'translateX(-50%)',
              filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))',
              animation: `${float} 4s ease-in-out infinite`,
            }} 
          />
          <GradientText 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 4,
              textShadow: '0 2px 10px rgba(255,215,0,0.3)',
            }}
          >
            Buy Points
          </GradientText>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              maxWidth: '800px',
              mx: 'auto',
              mb: 2,
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            Choose a points package below to boost your balance and unlock more opportunities.
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 1,
              background: 'linear-gradient(45deg, rgba(76,175,80,0.1), rgba(76,175,80,0.2))',
              borderRadius: '20px',
              py: 1,
              px: 3,
              mx: 'auto',
              maxWidth: 'fit-content',
            }}
          >
            <TrendingUp sx={{ color: '#4CAF50' }} />
            <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              Most popular: 2000 Points Package
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {pointsPackages.map((pkg) => (
            <Grid item xs={12} md={4} key={pkg.id}>
              <StyledCard elevation={3}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                  <FloatingIcon>
                    {pkg.icon}
                  </FloatingIcon>
                  <GradientText 
                    variant="h3" 
                    component="div" 
                    sx={{ 
                      mt: 2, 
                      mb: 1,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                    }}
                  >
                    {pkg.points}
                  </GradientText>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                      fontWeight: 'bold',
                    }}
                  >
                    Points
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                      mb: 3,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    {pkg.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {pkg.features.map((feature, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{
                          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                          fontSize: { xs: '0.8rem', md: '0.9rem' },
                        }}
                      >
                        <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                        {feature}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 1,
                        fontSize: { xs: '1.75rem', md: '2rem' },
                      }}
                    >
                      ₹{pkg.price}
                    </Typography>
                    {pkg.savings > 0 && (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          mb: 2,
                          background: 'linear-gradient(45deg, rgba(76,175,80,0.1), rgba(76,175,80,0.2))',
                          borderRadius: '15px',
                          py: 0.5,
                          px: 2,
                          mx: 'auto',
                          maxWidth: 'fit-content',
                        }}
                      >
                        <LocalOffer sx={{ color: '#4CAF50', mr: 0.5 }} />
                        <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                          Save ₹{pkg.savings}!
                        </Typography>
                      </Box>
                    )}
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={() => handleBuyPoints(pkg.id)}
                      sx={{
                        background: pkg.gradient,
                        color: 'white',
                        py: 1.5,
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '10px',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                          transition: '0.5s',
                        },
                        '&:hover::before': {
                          left: '100%',
                        },
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px rgba(255,215,0,0.4)',
                        },
                      }}
                    >
                      Buy Now
                    </Button>
                  </Box>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BuyPointsPage; 