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
                const response = await fetch("https://ghss-management-backend.vercel.app/classes");
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
                    const response = await fetch("https://ghss-management-backend.vercel.app/getsec", {
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
            daily: `https://ghss-management-backend.vercel.app/dailyAttenPercentage?class_id=${selectedClassId}&section_id=${selectedSectionId}`,
            monthly: `https://ghss-management-backend.vercel.app/monthlyAttenPercentage?class_id=${selectedClassId}&section_id=${selectedSectionId}`,
            overall: `https://ghss-management-backend.vercel.app/overallAttenPercentage?class_id=${selectedClassId}&section_id=${selectedSectionId}`,
        };

        fetchAttendanceData(urls[option]);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Paper 
                elevation={3}
                sx={{ 
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                    borderRadius: 2,
                    color: 'white'
                }}
            >
                <Typography 
                    variant="h4" 
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontWeight: 700,

                        fontSize: {md:'1.8rem', xs:'1rem'},
                        whiteSpace: 'nowrap',
                    }}
                >
                    <AssessmentIcon fontSize="large" />
                    Classes Performance
                </Typography>
            </Paper>

            {loading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item}>
                            <Skeleton 
                                variant="rectangular" 
                                height={120} 
                                sx={{ 
                                    borderRadius: 2,
                                    bgcolor: 'rgba(0,0,0,0.04)'
                                }} 
                            />
                        </Grid>
                    ))}
                </Grid>
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
                    <ErrorIcon sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h6">{error}</Typography>
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
                                    <ClassIcon color="primary" sx={{ fontSize: 32 }} />
                                    <Typography variant="h6">{classItem.name}</Typography>
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
                            fontSize: {md:'1.8rem', xs:'1.12rem'},
                            mb: 3,
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
                                            <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
                                            <Typography variant="h6">{section.name}</Typography>
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
                            mb: 4,
                            textAlign: 'center',
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1
                        }}
                    >
                        <SchoolIcon />
                        {selectedClassName} Section {sectionName}
                    </Typography>
                    <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                        <Grid item>
                            <Button
                                variant={attendanceOption === "daily" ? "contained" : "outlined"}
                                onClick={() => handleAttendanceOption("daily")}
                                startIcon={<CalendarIcon />}
                                sx={{
                                    px: 3,
                                    py: 1.5,
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
                                startIcon={<DateRangeIcon />}
                                sx={{
                                    px: 3,
                                    py: 1.5,
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
                                startIcon={<TimelineIcon />}
                                sx={{
                                    px: 3,
                                    py: 1.5,
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