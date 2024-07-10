import { Tooltip, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Legend, AreaChart, Area, LineChart, Line } from "recharts";

type OrderByDayChartProps = {
    data: { weekStart: string, valueO: number, valueC: number }[];
};

const currencyFormatter = (value: number) => `$${value.toFixed(2)}`;


export function OrderByDayChart({ data }: OrderByDayChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 10, left: 30, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--muted))" />
                <XAxis dataKey="weekStart" stroke="hsl(var(--primary))" />
                <YAxis stroke="hsl(var(--primary))" tickFormatter={currencyFormatter} />
                <Tooltip formatter={(value: number) => currencyFormatter(value)} />
                <Legend />
                <Line
                    dataKey="valueO"
                    type="linear"
                    name="Jewelry"
                    stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)"
                />
                <Line
                    dataKey="valueC"
                    type="linear"
                    name="Custom Jewelry"
                    stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
