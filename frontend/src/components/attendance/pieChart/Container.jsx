import  { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Card, CardContent, Typography, Grid, CircularProgress, Button } from "@mui/material";

// Lazy load the Pie Chart components
const DailyAttenPieChart = lazy(() => import("./DailyAttenPieChart"));
const TheMonthlyAttenPieChart = lazy(() => import("./TheMonthlyAttenPieChart"));
const OverallAttenPieChart = lazy(() => import("./OverallAttenPieChart"));

export default function ClassSectionDisplay() {
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
        <div className="p-8">
            <Typography variant="h4" className="mb-6 font-semibold text-center">
                Classes and Sections
            </Typography>

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center ">
                    <CircularProgress />
                </div>
            )}

            {error && <Typography color="error" className="text-center text-lg">{error}</Typography>}

            {!loading && !selectedClassId && (
                <Grid container spacing={2}>
                    {classes.map((classItem) => (
                        <Grid item xs={12} sm={6} md={4} key={classItem.id}>
                            <Card
                                onClick={() => handleClassClick(classItem.id, classItem.name)}
                                className="cursor-pointer hover:shadow-xl transition-shadow"
                            >
                                <CardContent className="bg-gray-100">
                                    <Typography variant="h6" className="text-center">{classItem.name}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {selectedClassId && !selectedSectionId && (
                <>
                    <Typography variant="h5" className="mb-4 text-center">
                        Sections for {selectedClassName}
                    </Typography>
                    <Grid container spacing={2}>
                        {sections.length > 0 ? (
                            sections.map((section) => (
                                <Grid item xs={12} sm={6} md={4} key={section.id}>
                                    <Card
                                        onClick={() => handleSectionClick(section.id)}
                                        className="cursor-pointer hover:shadow-xl transition-shadow"
                                    >
                                        <CardContent>
                                            <Typography variant="h6" className="text-center">{section.name}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography className="text-center">No sections available for this class.</Typography>
                            </Grid>
                        )}
                    </Grid>
                </>
            )}

            {selectedSectionId && (
                <>
                    <Typography variant="h5" className="mb-4 text-center">
                        {selectedClassName} Section {sectionName}
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button
                                variant={attendanceOption === "daily" ? "contained" : "outlined"}
                                onClick={() => handleAttendanceOption("daily")}
                                className="px-6 py-2"
                            >
                                Daily Attendance
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant={attendanceOption === "monthly" ? "contained" : "outlined"}
                                onClick={() => handleAttendanceOption("monthly")}
                                className="px-6 py-2"
                            >
                                Monthly Attendance
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant={attendanceOption === "overall" ? "contained" : "outlined"}
                                onClick={() => handleAttendanceOption("overall")}
                                className="px-6 py-2"
                            >
                                Overall Attendance
                            </Button>
                        </Grid>
                    </Grid>

                    <Suspense fallback={<CircularProgress className="m-auto" />}>
                        {attendanceOption === "monthly" && <TheMonthlyAttenPieChart data={attendanceData} />}
                        {attendanceOption === "daily" && attendanceData.length > 0 && <DailyAttenPieChart data={attendanceData} />}
                        {attendanceOption === "overall" && attendanceData.length > 0 && <OverallAttenPieChart data={attendanceData} startDate={startDate} endDate={endDate} />}
                    </Suspense>
                </>
            )}
        </div>
    );
}
