import { Tooltip, CartesianGrid, ResponsiveContainer, XAxis, YAxis, BarChart, Bar} from "recharts";

type CustomerByDayChartProps = { 
    data: { date: string, value: number }[];
};

export function CustomerByDayChart({ data }: CustomerByDayChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
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
