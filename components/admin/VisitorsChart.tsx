'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface VisitData {
  date: string;
  visitas: number;
}

export default function VisitorsChart({ data }: { data: VisitData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-zinc-500 text-sm">
        Sem dados de visitantes para o período.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E8611C" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#E8611C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#a1a1aa" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#a1a1aa" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              borderColor: '#27272a',
              borderRadius: '8px',
              color: '#fff',
            }}
            itemStyle={{ color: '#E8611C', fontWeight: 'bold' }}
            labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
          />
          <Area
            type="monotone"
            dataKey="visitas"
            stroke="#E8611C"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorVisitas)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
