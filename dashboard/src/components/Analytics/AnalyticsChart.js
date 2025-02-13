import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function AnalyticsChart() {
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/analytics');
            const data = await response.json();
            setAnalyticsData(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    if (!analyticsData) return <div>Loading analytics...</div>;

    const chartData = {
        labels: analyticsData.map(item => item._id),
        datasets: [
            {
                label: 'Page Views',
                data: analyticsData.map(item => item.pageViews),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }
        ]
    };

    return (
        <div className="analytics-chart">
            <h3>Page Views Analytics</h3>
            <Bar data={chartData} />
        </div>
    );
}

export default AnalyticsChart; 