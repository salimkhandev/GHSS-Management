import {
    BarChart as BarChartIcon,
    Leaderboard as LeaderboardIcon,
    PieChart as PieChartIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Container,
    Grid,
    LinearProgress,
    Paper,
    Typography,
    useScrollTrigger,
    useTheme
} from '@mui/material';
import React, { Suspense, useState } from 'react';

// Lazy load the components
const ClassPerformance = React.lazy(() => import('./Container'));
const AllClassesPerformance = React.lazy(() => import('./AllClassesPerformance'));
const Top50StudentsAtten = React.lazy(() => import('./Top10StudentsAtten'));

const Loader = () => (
    <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress
            sx={{
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                    backgroundImage: 'var(--gradient-primary)',
                }
            }}
        />
    </Box>
);

const PerformanceDashboard = () => {
    const theme = useTheme();
    const [activeComponent, setActiveComponent] = useState(null);
    const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 60 });

    const menuItems = [
        {
            id: 'ClassPerformance',
            label: 'Classes Performance',
            icon: <BarChartIcon />,
            component: <ClassPerformance />
        },
        {
            id: 'OverallClassPerformance',
            label: 'Overall Classes Performance',
            icon: <PieChartIcon />,
            component: <AllClassesPerformance />
        },
        {
            id: 'Top50Students',
            label: 'Top 30 Ranked Students',
            icon: <LeaderboardIcon />,
            component: <Top50StudentsAtten />
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 } }}>
            {/* Removed title banner for a cleaner look */}

            <Paper
                elevation={16}
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: 'rgba(255, 255, 255, 0.99)',
                    backdropFilter: 'blur(20px)',
                    mb: { xs: 3, sm: 4, md: 5 },
                    borderRadius: 4,
                    p: scrolled ? { xs: 1, sm: 1, md: 1 } : { xs: 1.5, sm: 2, md: 2.5 },
                    maxWidth: { xs: '100%', sm: 900, md: 1000 },
                    mx: 'auto',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                    transition: 'padding 0.2s ease',
                }}
            >
                <Grid
                    container
                    spacing={{ xs: 1, sm: 1.5, md: 2 }}
                    justifyContent="center"
                >
                    {menuItems.map((item) => (
                        <Grid item key={item.id} xs={12} sm="auto">
                            <Button
                                variant={activeComponent === item.id ? "contained" : "outlined"}
                                onClick={() => setActiveComponent(item.id)}
                                startIcon={item.icon}
                                fullWidth
                                sx={{
                                    px: { xs: 2, sm: 2.5, md: 3 },
                                    py: scrolled ? { xs: 0.8, sm: 1, md: 1 } : { xs: 1.2, sm: 1.4, md: 1.6 },
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontFamily: '"Poppins", sans-serif',
                                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                                    whiteSpace: 'nowrap',
                                    minWidth: 'fit-content',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    ...(activeComponent === item.id ? {
                                        background: 'var(--gradient-primary)',
                                        color: 'white',
                                        boxShadow: '0 4px 16px rgba(26, 35, 126, 0.3)',
                                        '&:hover': {
                                            background: 'var(--gradient-primary)',
                                            boxShadow: '0 8px 24px rgba(26, 35, 126, 0.4)',
                                            transform: 'translateY(-2px)',
                                        },
                                    } : {
                                        borderColor: 'var(--color-primary)',
                                        color: 'var(--color-primary)',
                                        '&:hover': {
                                            background: 'rgba(26, 35, 126, 0.05)',
                                            borderColor: 'var(--color-primary)',
                                            transform: 'translateY(-2px)',
                                        }
                                    }),
                                }}
                            >
                                {item.label}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            <Paper
                elevation={16}
                sx={{
                    p: { xs: 2.5, sm: 3, md: 3.5 },
                    borderRadius: 4,
                    minHeight: { xs: 350, sm: 400, md: 450 },
                    backgroundColor: 'linear-gradient(to bottom, var(--color-surface), var(--color-surface-raised))',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
            >
                {!activeComponent ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: { xs: 350, sm: 400, md: 450 },
                            gap: { xs: 2, sm: 2.5 }
                        }}
                    >
                        <SchoolIcon
                            sx={{
                                fontSize: { xs: 64, sm: 72, md: 80 },
                                color: 'var(--color-primary)',
                                filter: 'drop-shadow(0 4px 8px rgba(26, 35, 126, 0.15))',
                            }}
                        />
                        <Typography
                            variant="h6"
                            color="textSecondary"
                            align="center"
                            sx={{
                                fontFamily: '"Poppins", sans-serif',
                                fontWeight: 600,
                                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' },
                                px: { xs: 2, sm: 0 },
                                color: 'var(--color-text-secondary)'
                            }}
                        >
                            Select an option above to view performance data
                        </Typography>
                    </Box>
                ) : (
                    <Suspense fallback={<Loader />}>
                        {menuItems.find(item => item.id === activeComponent)?.component}
                    </Suspense>
                )}
            </Paper>
        </Container>
    );
};

export default PerformanceDashboard;
