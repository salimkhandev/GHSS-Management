import {
    Assessment as AssessmentIcon,
    CalendarMonth as CalendarIcon,
    Class as ClassIcon,
    DateRange as DateRangeIcon,
    Error as ErrorIcon,
    School as SchoolIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';
import { Box, Button, Card, CardContent, CircularProgress, Grid, Paper, Skeleton, Typography, useTheme } from "@mui/material";
import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import apiBase from '../../../config/api';

// Lazy load the Pie Chart components
const DailyAttenPieChart = lazy(() => import("./DailyAttenPieChart"));
const TheMonthlyAttenPieChart = lazy(() => import("./TheMonthlyAttenPieChart"));
const OverallAtten = lazy(() => import("./OverallAtten"));

const LoadingFallback = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress
            sx={{
                color: 'primary.main',
                '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round'
                }
            }}
        />
    </Box>
);

export default function ClassSectionDisplay() {
    const theme = useTheme();
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [selectedClassName, setSelectedClassName] = useState("");
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [attendanceOption, setAttendanceOption] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const sectionName = useMemo(() => {
        return sections.find((s) => s.id === selectedSectionId)?.name || "Unknown";
    }, [sections, selectedSectionId]);

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${apiBase}/classes`);
                if (!response.ok) throw new Error("Failed to fetch classes");
                const data = await response.json();
                setClasses(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchSections = async () => {
            if (selectedClassId) {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${apiBase}/getsec`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ class_id: selectedClassId }),
                    });
                    if (!response.ok) throw new Error("Failed to fetch sections");
                    const data = await response.json();
                    setSections(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchSections();
    }, [selectedClassId]);

    const fetchAttendanceData = async (url) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setAttendanceData(data);
            if (data.length > 0) {
                setStartDate(data[0].start_date); // Extract start date from data
                setEndDate(data[0].end_date);   // Extract end date from data
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClassClick = (classId, className) => {
        setSelectedClassId(classId);
        setSelectedClassName(className);
        setSelectedSectionId(null);
        setAttendanceOption(null);
        setAttendanceData([]);
    };

    const handleSectionClick = (sectionId) => {
        setSelectedSectionId(sectionId);
        setAttendanceOption(null);
        setAttendanceData([]);
    };

    const handleAttendanceOption = (option) => {
        setAttendanceOption(option);
        setAttendanceData([])

        const urls = {
            daily: `${apiBase}/dailyAttenPercentage?class_id=${selectedClassId}&section_id=${selectedSectionId}`,
            monthly: `${apiBase}/monthlyAttenPercentage?class_id=${selectedClassId}&section_id=${selectedSectionId}`,
            overall: `${apiBase}/overallAttenPercentage?class_id=${selectedClassId}&section_id=${selectedSectionId}`,
        };

        fetchAttendanceData(urls[option]);
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 1, sm: 1.25, md: 2 },
                    mb: { xs: 2, sm: 3, md: 4 },
                    background: 'linear-gradient(45deg, #1e88e5, #42a5f5)',
                    borderRadius: 2,
                    color: 'white',
                    display: 'flex',
                    width: 'fit-content',
                    maxWidth: '100%'
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 0.75, sm: 1 },
                        fontWeight: 700,
                        fontSize: { xs: '1rem', sm: '1.25rem', md: '1.2rem' },
                    }}
                >
                    <AssessmentIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.6rem', md: '1.6rem' } }} />
                    <span>Classes Performance</span>
                </Typography>
            </Paper>

            {loading ? (
                <>
                {/* Compact centered header skeleton */}
                <Skeleton
                    variant="rectangular"
                    sx={{
                        mb: { xs: 2, sm: 3, md: 4 },
                        height: { xs: 44, sm: 52, md: 56 },
                        width: { xs: 220, sm: 300, md: 360 },
                        mx: 'auto',
                        borderRadius: 2,
                        bgcolor: 'rgba(25, 118, 210, 0.1)'
                    }}
                />
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item}>
                            <Skeleton
                                variant="rectangular"
                                height={96}
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: 'rgba(0,0,0,0.04)'
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
                </>
            ) : error ? (
                <Paper
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        bgcolor: theme.palette.error.light,
                        color: theme.palette.error.dark,
                        borderRadius: 2
                    }}
                >
                    <ErrorIcon sx={{ fontSize: { xs: 36, sm: 48 }, mb: { xs: 1, sm: 2 } }} />
                    <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{error}</Typography>
                </Paper>
            ) : !selectedClassId ? (
                <Grid container spacing={3}>
                        {classes.map((classItem) => (
                        <Grid item xs={12} sm={6} md={4} key={classItem.id}>
                            <Card
                                onClick={() => handleClassClick(classItem.id, classItem.name)}
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                        bgcolor: theme.palette.grey[50],
                                        border: `1px solid ${theme.palette.divider}`,
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <CardContent sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 3
                                }}>
                                    <ClassIcon color="primary" sx={{ fontSize: { xs: 28, sm: 32 } }} />
                                    <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>{classItem.name}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : !selectedSectionId ? (
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { xs: '1.1rem', sm: '1.4rem', md: '1.75rem' },
                            mb: { xs: 2, sm: 2.5, md: 3 },
                            display: 'flex',
                            alignItems: 'center',
                            color: theme.palette.primary.main,
                            fontWeight: 600
                        }}
                    >
                        Sections for {selectedClassName}
                    </Typography>
                    <Grid container spacing={3}>
                        {sections.length === 0 && !loading ? (
                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        p: 4,
                                        textAlign: 'center',
                                        bgcolor: theme.palette.grey[50]
                                    }}
                                >
                                    <Typography color="textSecondary">
                                        No sections available for this class.
                                    </Typography>
                                </Paper>
                            </Grid>
                        ) : (
                            sections.map((section) => (
                                <Grid item xs={12} sm={6} md={4} key={section.id}>
                                    <Card
                                        onClick={() => handleSectionClick(section.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            bgcolor: theme.palette.grey[50],
                                            border: `1px solid ${theme.palette.divider}`,
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 6
                                            }
                                        }}
                                    >
                                        <CardContent sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 3
                                        }}>
                                            <SchoolIcon color="primary" sx={{ fontSize: { xs: 28, sm: 32 } }} />
                                            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>{section.name}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Box>
            ) : (
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: { xs: 2, sm: 3, md: 4 },
                            textAlign: 'center',
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: { xs: 0.5, sm: 1 }
                        }}
                    >
                        <SchoolIcon sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.75rem' } }} />
                        {selectedClassName} Section {sectionName}
                    </Typography>
                    <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }} justifyContent="center" sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                        <Grid item>
                            <Button
                                variant={attendanceOption === "daily" ? "contained" : "outlined"}
                                onClick={() => handleAttendanceOption("daily")}
                                startIcon={<CalendarIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
                                sx={{
                                    px: { xs: 2, sm: 2.5, md: 3 },
                                    py: { xs: 1, sm: 1.25, md: 1.5 },
                                    textTransform: 'none',
                                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                                    borderRadius: 2,
                                    ...(attendanceOption === "daily" && {
                                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                    })
                                }}
                            >
                                Daily Attendance
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant={attendanceOption === "monthly" ? "contained" : "outlined"}
                                onClick={() => handleAttendanceOption("monthly")}
                                startIcon={<DateRangeIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
                                sx={{
                                    px: { xs: 2, sm: 2.5, md: 3 },
                                    py: { xs: 1, sm: 1.25, md: 1.5 },
                                    textTransform: 'none',

                                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                                    borderRadius: 2,
                                    ...(attendanceOption === "monthly" && {
                                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                    })
                                }}
                            >
                                Monthly Attendance
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant={attendanceOption === "overall" ? "contained" : "outlined"}
                                onClick={() => handleAttendanceOption("overall")}
                                startIcon={<TimelineIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />}
                                sx={{
                                    px: { xs: 2, sm: 2.5, md: 3 },
                                    py: { xs: 1, sm: 1.25, md: 1.5 },
                                    textTransform: 'none',
                                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                                    borderRadius: 2,
                                    ...(attendanceOption === "overall" && {
                                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                    })
                                }}
                            >
                                Overall Attendance
                            </Button>
                        </Grid>
                    </Grid>

                    <Suspense fallback={<LoadingFallback />}>
                        {attendanceOption === "monthly" && attendanceData.length > 0 && (
                            <TheMonthlyAttenPieChart data={attendanceData} />
                        )}
                        {attendanceOption === "daily" && attendanceData.length > 0 && (
                            <DailyAttenPieChart data={attendanceData} />
                        )}
                        {attendanceOption === "overall" && attendanceData.length > 0 && (
                            <OverallAtten data={attendanceData} startDate={startDate} endDate={endDate} />
                        )}
                    </Suspense>
                </Box>
            )}
        </Box>
    );
}
