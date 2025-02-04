import React, { useState } from 'react';
import { Box, Typography, Button, Container, Grid, LinearProgress } from '@mui/material';

// Lazy load the components
const ClassPerformance = React.lazy(() => import('./Container'));
const AllClassesPerformance = React.lazy(() => import('./AllClassesPerformance'));
const Top50StudentsAtten = React.lazy(() => import('./Top10StudentsAtten'));
const Loader = () => (
  <Box sx={{ width: '100%' }}>
        <LinearProgress color="secondary" />
  </Box>
);
const PerformanceDashboard = () => {
    const [activeComponent, setActiveComponent] = useState(null);

    // Function to handle component rendering
    const renderComponent = () => {
        switch (activeComponent) {
            case 'ClassPerformance':
                return <ClassPerformance />;
            case 'OverallClassPerformance':
                return <AllClassesPerformance />;
            case 'Top50Students':
                return <Top50StudentsAtten />;
            default:
                return (
                    <Typography align="center" sx={{ mt: 3, color: 'gray' }}>
                        Select an option to display the data
                    </Typography>
                );
        }
    };

    return (
        <Container>
            <Typography
                variant="h4"
                align="center"
                sx={{ my: 3, fontWeight: 'bold', color: '#333' }}
            >
                Performance Dashboard
            </Typography>

            <Grid
                container
                spacing={3}
                justifyContent="center"
                sx={{
                    mb: 4,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: 'white',
                    padding: '10px 0',
                }}
            >
                <Grid item>
                    <Button
                        variant="contained"
                        color={activeComponent === 'ClassPerformance' ? 'secondary' : 'primary'}
                        sx={{ textTransform: 'capitalize', fontFamily: '"Roboto", "Arial", sans-serif', px: 2, py: 1 }}
                        onClick={() => setActiveComponent('ClassPerformance')}
                    >
                        Classes Performance
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color={activeComponent === 'OverallClassPerformance' ? 'secondary' : 'primary'}
                        sx={{ textTransform: 'capitalize', fontFamily: '"Roboto", "Arial", sans-serif', px: 2, py: 1 }}
                        onClick={() => setActiveComponent('OverallClassPerformance')}
                    >
                        Overall Classes Performance
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color={activeComponent === 'Top50Students' ? 'secondary' : 'primary'}
                        sx={{ textTransform: 'capitalize', fontFamily: '"Roboto", "Arial", sans-serif', px: 2, py: 1 }}
                        onClick={() => setActiveComponent('Top50Students')}
                    >
                        Top 10 Ranked Students
                    </Button>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
                <React.Suspense
                    fallback={<Loader/> }
                >
                    {renderComponent()}
                </React.Suspense>
            </Box>
        </Container>
    );
};

// Make sure this is at the bottom of the file
export default PerformanceDashboard;
