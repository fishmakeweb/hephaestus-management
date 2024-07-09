import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, CartesianGrid } from "recharts";

type OrderByDayChartProps = {
    data: { name: string, value: number }[];
};

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56', 
    '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#FF6384', 
    '#9966FF', '#FF9F40', '#FFCE56', '#4BC0C0', '#FFCD56', '#36A2EB'
];

export function PercentChart({ data }: OrderByDayChartProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <CartesianGrid stroke="hsl(var(--muted))" />
                <Legend />
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            </PieChart>
        </ResponsiveContainer>
    );
}
