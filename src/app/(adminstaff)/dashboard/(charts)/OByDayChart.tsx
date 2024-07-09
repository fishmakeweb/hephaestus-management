import { Tooltip, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Legend, AreaChart, Area } from "recharts";

type OrderByDayChartProps = {
    data: { date: string, valueO: number, valueC: number }[];
};

const currencyFormatter = (value: number) => `$${value}`;

export function OrderByDayChart({ data }: OrderByDayChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
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
                <YAxis stroke="hsl(var(--primary))" tickFormatter={currencyFormatter} />
                <Tooltip formatter={(value: number) => currencyFormatter(value)} />
                <Legend />
                <Area
                    dataKey="valueO"
                    type="monotone"
                    name="Total Value"
                    stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)"
                />
                <Area
                    dataKey="valueC"
                    type="monotone"
                    name="Total Prepaid"
                    stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
