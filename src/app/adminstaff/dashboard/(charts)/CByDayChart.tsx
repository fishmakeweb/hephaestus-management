import { Tooltip, CartesianGrid, ResponsiveContainer, XAxis, YAxis, BarChart, Bar } from "recharts";

type CustomerByDayChartProps = {
    data: { date: string, value: number }[];
};

export function CustomerByDayChart({ data }: CustomerByDayChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--muted))" />
                <XAxis dataKey="date" stroke="hsl(var(--primary))" />
                <YAxis stroke="hsl(var(--primary))" />
                <Tooltip />
                <Bar
                    dataKey="value"
                    name="New Customer"
                    stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
