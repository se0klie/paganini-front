import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent, Typography } from '@mui/material';

export function BalanceChart({ data = [] }) {
    if (data.length === 0) return null;

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography sx={{ fontWeight: 600, mb: 2 }}>
                    Balance en el tiempo
                </Typography>

                <LineChart
                    height={300}
                    series={[
                        {
                            data: data.map(d => d.balance),
                            label: 'Balance',
                            area: true,
                            showMark: false,
                            curve: 'monotoneX',
                            color: 'var(--color-primary)',
                            areaOpacity: 0.2,
                        },
                    ]}
                    xAxis={[
                        {
                            scaleType: 'time',
                            data: data.map(d => d.date),
                        },
                    ]}
                />
            </CardContent>
        </Card>
    );
}


export function IncomeOutcomeChart({ data }) {
    return (
        <Card sx={{ borderRadius: 3, boxShadow: 'var(--shadow-md)' }}>
            <CardContent>
                <Typography sx={{ fontWeight: 600, mb: 2 }}>
                    Ingresos vs Gastos
                </Typography>

                <PieChart
                    height={300}
                    series={[{ data }]}
                    tooltip={{ valueFormatter: (v) => `$${v.toLocaleString('es-ES')}` }}
                    innerRadius={70} 
                    colors={['var(--color-primary)', 'var(--secondary-accent-alternative-dark)']}
                />
            </CardContent>
        </Card>
    );
}