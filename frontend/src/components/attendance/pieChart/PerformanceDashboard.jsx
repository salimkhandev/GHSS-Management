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
                height: 6,
                borderRadius: 3,
                '& .MuiLinearProgress-bar': {
                    backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                }
            }}
        />
    </Box>
);

const PerformanceDashboard = () => {
    const theme = useTheme();
    const [activeComponent, setActiveComponent] = useState(null);

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
            label: 'Top 10 Ranked Students',
            icon: <LeaderboardIcon />,
            component: <Top50StudentsAtten />
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 } }}>
            {/* Removed title banner for a cleaner look */}

            <Paper
                elevation={2}
                sx={{
                    position: 'sticky',
                    top: { xs: 56, sm: 64, md: 68 },
                    zIndex: 1000,
                    backgroundColor: 'white',
                    mb: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 2,
                    p: { xs: 0.75, sm: 1.25, md: 1.5 },
                    maxWidth: { xs: '100%', sm: 900, md: 1000 },
                    mx: 'auto',
                    border: `1px solid ${theme.palette.divider}`
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
                                    px: { xs: 1.5, sm: 2, md: 2.5 },
                                    py: { xs: 0.85, sm: 1.1, md: 1.25 },
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.82rem', sm: '0.9rem', md: '0.95rem' },
                                    whiteSpace: 'nowrap',
                                    minWidth: 'fit-content',
                                    ...(activeComponent === item.id ? {
                                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                                    } : {
                                        borderColor: theme.palette.primary.main,
                                        '&:hover': {
                                            background: 'rgba(25, 118, 210, 0.04)',
                                            borderColor: theme.palette.primary.main,
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
                elevation={2}
                sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    borderRadius: 2,
                    minHeight: { xs: 300, sm: 350, md: 400 },
                    backgroundColor: theme.palette.background.default
                }}
            >
                {!activeComponent ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: { xs: 300, sm: 350, md: 400 },
                            gap: { xs: 1.5, sm: 2 }
                        }}
                    >
                        <SchoolIcon
                            sx={{
                                fontSize: { xs: 48, sm: 54, md: 60 },
                                color: theme.palette.grey[400],
                                mb: { xs: 1, sm: 2 }
                            }}
                        />
                        <Typography
                            variant="h6"
                            color="textSecondary"
                            align="center"
                            sx={{
                                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                                px: { xs: 2, sm: 0 }
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
