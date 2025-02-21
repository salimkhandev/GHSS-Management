import { 
    Assessment as AssessmentIcon,
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
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper 
                elevation={3}
                sx={{
                    // also for mobile
                    p: 1,
                    // mb: ,
                    background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                    borderRadius: 2,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <AssessmentIcon sx={{ fontSize: 40 }} />
                <Box>
                    <Typography
                        variant="h4"
                        sx={{ 
                            fontSize: {md:'1.8rem', xs:'1.3rem'},
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    >
                        Performance Dashboard
                    </Typography>
                 
                </Box>
            </Paper>

            <Paper 
                elevation={2}
                sx={{
                    position: 'sticky',
                    top: 64,
                    zIndex: 1000,
                    backgroundColor: 'white',
                    mb: 4,
                    borderRadius: 2,
                    p: 2
                }}
            >
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                >
                    {menuItems.map((item) => (
                        <Grid item key={item.id}>
                            <Button
                                variant={activeComponent === item.id ? "contained" : "outlined"}
                                onClick={() => setActiveComponent(item.id)}
                                startIcon={item.icon}
                                sx={{
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '1rem',
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
                    p: 3,
                    borderRadius: 2,
                    minHeight: 400,
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
                            height: 400,
                            gap: 2
                        }}
                    >
                        <SchoolIcon 
                            sx={{ 
                                fontSize: 60,
                                color: theme.palette.grey[400],
                                mb: 2
                            }} 
                        />
                        <Typography 
                            variant="h6" 
                            color="textSecondary"
                            align="center"
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
