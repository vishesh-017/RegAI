"use client";

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis 
} from 'recharts';
import { useTheme } from 'next-themes';

const colors = {
  indigo: '#4F46E5',
  green: '#22C55E',
  emerald: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  blue: '#3B82F6',
  blueLight: '#60A5FA',
  blueDark: '#2563EB',
  slate: '#64748B',
  slateLight: '#E2E8F0',
  slateDark: '#1E293B',
};

// Data Mocks
const trendData = [
  { name: 'Jan', score: 86.4 },
  { name: 'Feb', score: 88.1 },
  { name: 'Mar', score: 91.2 },
  { name: 'Apr', score: 89.5 },
  { name: 'May', score: 94.8 },
  { name: 'Jun', score: 98.2 },
];

const departmentData = [
  { name: 'Risk', tasks: 45 },
  { name: 'Compliance', tasks: 62 },
  { name: 'IT Security', tasks: 28 },
  { name: 'Operations', tasks: 34 },
  { name: 'Finance', tasks: 19 },
];

const completionData = [
  { name: 'Approved', value: 72, color: colors.emerald },
  { name: 'In Review', value: 18, color: colors.blue },
  { name: 'Pending', value: 7, color: colors.amber },
  { name: 'Blocked', value: 3, color: colors.red },
];

const timelineData = [
  { name: 'SEBI AI Guidelines', x: 1, y: 3, z: 400, status: 'Active' },
  { name: 'RBI Cyber Framework', x: 2, y: 5, z: 600, status: 'Critical' },
  { name: 'PFRDA Risk Mgmt', x: 4, y: 2, z: 300, status: 'Pending' },
  { name: 'NSE Algo Trading', x: 5, y: 4, z: 450, status: 'Active' },
];

export function ComplianceTrendChart() {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? colors.slate : colors.slate;
  const gridColor = theme === 'dark' ? colors.slateDark : colors.slateLight;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
        <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke={colors.green} 
          strokeWidth={3}
          dot={{ r: 4, fill: colors.green, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: colors.indigo }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TasksByDepartmentChart() {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? colors.slate : colors.slate;
  const gridColor = theme === 'dark' ? colors.slateDark : colors.slateLight;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
        <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip 
          cursor={{ fill: gridColor, opacity: 0.4 }}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Bar dataKey="tasks" fill={colors.blue} radius={[4, 4, 0, 0]}>
          {departmentData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? colors.blue : colors.blueLight} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TaskCompletionChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={completionData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {completionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TimelineChart() {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? colors.slate : colors.slate;
  const gridColor = theme === 'dark' ? colors.slateDark : colors.slateLight;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis type="number" dataKey="x" name="Week" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis type="number" dataKey="y" name="Impact" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
        <ZAxis type="number" dataKey="z" range={[60, 400]} />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }} 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Scatter name="Regulatory Events" data={timelineData} fill={colors.indigo}>
          {timelineData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.status === 'Critical' ? colors.red : entry.status === 'Pending' ? colors.amber : colors.indigo} 
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
