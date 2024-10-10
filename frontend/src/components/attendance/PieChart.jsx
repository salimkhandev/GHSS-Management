
import { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import axios from 'axios';

const AttendancePieChart = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://ghss-management-backend.vercel.app/attendancePercentage');
                setData(response.data);
                console.log('Fetched data:', response.data);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
                setError('Failed to fetch attendance data.');
            }
        };

        fetchData();
    }, []);

    const COLORS = ['#00C49F', '#FF8042'];

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Attendance Overview</h2>
            {data.length === 0 ? (
                <p>No data available.</p>
            ) : (
                data.map((entry, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        <h3>Class {entry.class_id} - Section {entry.section_id} (Date: {new Date(entry.attendance_date).toLocaleDateString()})</h3>
                        <PieChart width={400} height={400}>
                            <Pie
                                data={[
                                    { name: 'Present', value: parseFloat(entry.present_percentage) },
                                    { name: 'Absent', value: parseFloat(entry.absent_percentage) }
                                ]}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                fill="#8884d8"
                                label
                            >
                                <Cell key="Present" fill={COLORS[0]} />
                                <Cell key="Absent" fill={COLORS[1]} />
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                ))
            )}
        </div>
    );
};

export default AttendancePieChart;

