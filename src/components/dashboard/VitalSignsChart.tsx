import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Heart, Activity, Droplets, Thermometer, Wifi } from "lucide-react";
import type { VitalSigns } from "@/data/mockPatients";

interface VitalDataPoint {
  time: string;
  value: number;
  timestamp: number;
}

interface VitalSignsChartProps {
  initialVitals: VitalSigns;
  patientName?: string;
}

const generateHistoricalData = (
  baseValue: number,
  variance: number,
  count: number
): VitalDataPoint[] => {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const time = new Date(now - (count - 1 - i) * 5000);
    return {
      time: time.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit" 
      }),
      value: Math.round(baseValue + (Math.random() - 0.5) * variance * 2),
      timestamp: time.getTime(),
    };
  });
};

export function VitalSignsChart({ initialVitals, patientName }: VitalSignsChartProps) {
  const [heartRateData, setHeartRateData] = useState<VitalDataPoint[]>(() =>
    generateHistoricalData(initialVitals.heartRate, 5, 20)
  );
  const [systolicData, setSystolicData] = useState<VitalDataPoint[]>(() =>
    generateHistoricalData(initialVitals.bloodPressure.systolic, 8, 20)
  );
  const [diastolicData, setDiastolicData] = useState<VitalDataPoint[]>(() =>
    generateHistoricalData(initialVitals.bloodPressure.diastolic, 5, 20)
  );
  const [oxygenData, setOxygenData] = useState<VitalDataPoint[]>(() =>
    generateHistoricalData(initialVitals.oxygenSaturation, 2, 20)
  );
  const [tempData, setTempData] = useState<VitalDataPoint[]>(() =>
    generateHistoricalData(initialVitals.temperature * 10, 2, 20).map(d => ({
      ...d,
      value: d.value / 10
    }))
  );
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit" 
      });
      const timestamp = now.getTime();

      setHeartRateData(prev => {
        const lastValue = prev[prev.length - 1]?.value || initialVitals.heartRate;
        const newValue = Math.max(50, Math.min(120, lastValue + (Math.random() - 0.5) * 6));
        return [...prev.slice(-19), { time: timeStr, value: Math.round(newValue), timestamp }];
      });

      setSystolicData(prev => {
        const lastValue = prev[prev.length - 1]?.value || initialVitals.bloodPressure.systolic;
        const newValue = Math.max(90, Math.min(180, lastValue + (Math.random() - 0.5) * 8));
        return [...prev.slice(-19), { time: timeStr, value: Math.round(newValue), timestamp }];
      });

      setDiastolicData(prev => {
        const lastValue = prev[prev.length - 1]?.value || initialVitals.bloodPressure.diastolic;
        const newValue = Math.max(60, Math.min(110, lastValue + (Math.random() - 0.5) * 5));
        return [...prev.slice(-19), { time: timeStr, value: Math.round(newValue), timestamp }];
      });

      setOxygenData(prev => {
        const lastValue = prev[prev.length - 1]?.value || initialVitals.oxygenSaturation;
        const newValue = Math.max(88, Math.min(100, lastValue + (Math.random() - 0.5) * 2));
        return [...prev.slice(-19), { time: timeStr, value: Math.round(newValue), timestamp }];
      });

      setTempData(prev => {
        const lastValue = prev[prev.length - 1]?.value || initialVitals.temperature;
        const newValue = Math.max(35.5, Math.min(39.5, lastValue + (Math.random() - 0.5) * 0.2));
        return [...prev.slice(-19), { time: timeStr, value: parseFloat(newValue.toFixed(1)), timestamp }];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, initialVitals]);

  const currentHeartRate = heartRateData[heartRateData.length - 1]?.value || 0;
  const currentSystolic = systolicData[systolicData.length - 1]?.value || 0;
  const currentDiastolic = diastolicData[diastolicData.length - 1]?.value || 0;
  const currentOxygen = oxygenData[oxygenData.length - 1]?.value || 0;
  const currentTemp = tempData[tempData.length - 1]?.value || 0;

  const chartConfig = {
    heartRate: {
      color: "hsl(var(--vital-heart))",
      icon: Heart,
      label: "Heart Rate",
      unit: "bpm",
      normalRange: { min: 60, max: 100 },
      current: currentHeartRate,
    },
    bloodPressure: {
      color: "hsl(var(--vital-bp))",
      icon: Activity,
      label: "Blood Pressure",
      unit: "mmHg",
      normalRange: { systolic: { min: 90, max: 140 }, diastolic: { min: 60, max: 90 } },
      current: `${currentSystolic}/${currentDiastolic}`,
    },
    oxygen: {
      color: "hsl(var(--vital-oxygen))",
      icon: Droplets,
      label: "SpO2",
      unit: "%",
      normalRange: { min: 95, max: 100 },
      current: currentOxygen,
    },
    temperature: {
      color: "hsl(var(--vital-temp))",
      icon: Thermometer,
      label: "Temperature",
      unit: "°C",
      normalRange: { min: 36.1, max: 37.2 },
      current: currentTemp,
    },
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              Real-Time Vital Signs Monitor
            </CardTitle>
            {patientName && (
              <Badge variant="outline">{patientName}</Badge>
            )}
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isLive 
                ? "bg-status-stable/20 text-status-stable" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Wifi className={`h-4 w-4 ${isLive ? "animate-pulse" : ""}`} />
            {isLive ? "Live" : "Paused"}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="heartRate" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            {Object.entries(chartConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{config.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="heartRate" className="space-y-4">
            <VitalChartDisplay
              data={heartRateData}
              config={chartConfig.heartRate}
              dataKey="value"
              domain={[40, 140]}
              referenceLines={[
                { y: 60, stroke: "hsl(var(--status-warning))", label: "Low" },
                { y: 100, stroke: "hsl(var(--status-warning))", label: "High" },
              ]}
            />
          </TabsContent>

          <TabsContent value="bloodPressure" className="space-y-4">
            <BloodPressureChart
              systolicData={systolicData}
              diastolicData={diastolicData}
              config={chartConfig.bloodPressure}
            />
          </TabsContent>

          <TabsContent value="oxygen" className="space-y-4">
            <VitalChartDisplay
              data={oxygenData}
              config={chartConfig.oxygen}
              dataKey="value"
              domain={[85, 102]}
              referenceLines={[
                { y: 95, stroke: "hsl(var(--status-warning))", label: "Low Normal" },
                { y: 90, stroke: "hsl(var(--status-critical))", label: "Critical" },
              ]}
            />
          </TabsContent>

          <TabsContent value="temperature" className="space-y-4">
            <VitalChartDisplay
              data={tempData}
              config={chartConfig.temperature}
              dataKey="value"
              domain={[35, 40]}
              referenceLines={[
                { y: 37.2, stroke: "hsl(var(--status-warning))", label: "Fever" },
                { y: 38.0, stroke: "hsl(var(--status-critical))", label: "High Fever" },
              ]}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface VitalChartDisplayProps {
  data: VitalDataPoint[];
  config: {
    color: string;
    icon: React.ElementType;
    label: string;
    unit: string;
    current: number | string;
  };
  dataKey: string;
  domain: [number, number];
  referenceLines?: Array<{ y: number; stroke: string; label: string }>;
}

function VitalChartDisplay({ 
  data, 
  config, 
  domain, 
  referenceLines = [] 
}: VitalChartDisplayProps) {
  const Icon = config.icon;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="p-3 rounded-xl" 
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Icon className="h-6 w-6" style={{ color: config.color }} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{config.label}</p>
            <p className="text-3xl font-bold" style={{ color: config.color }}>
              {config.current} <span className="text-lg font-normal">{config.unit}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              tickLine={false}
            />
            <YAxis 
              domain={domain}
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            {referenceLines.map((line, idx) => (
              <ReferenceLine
                key={idx}
                y={line.y}
                stroke={line.stroke}
                strokeDasharray="5 5"
                label={{ 
                  value: line.label, 
                  position: "right",
                  fontSize: 10,
                  fill: line.stroke 
                }}
              />
            ))}
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface BloodPressureChartProps {
  systolicData: VitalDataPoint[];
  diastolicData: VitalDataPoint[];
  config: {
    color: string;
    icon: React.ElementType;
    label: string;
    unit: string;
    current: string;
  };
}

function BloodPressureChart({ systolicData, diastolicData, config }: BloodPressureChartProps) {
  const Icon = config.icon;
  
  const combinedData = systolicData.map((s, i) => ({
    time: s.time,
    systolic: s.value,
    diastolic: diastolicData[i]?.value || 0,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="p-3 rounded-xl" 
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Icon className="h-6 w-6" style={{ color: config.color }} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{config.label}</p>
            <p className="text-3xl font-bold" style={{ color: config.color }}>
              {config.current} <span className="text-lg font-normal">{config.unit}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-vital-bp" />
            <span>Systolic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-vital-bp/60" />
            <span>Diastolic</span>
          </div>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              tickLine={false}
            />
            <YAxis 
              domain={[50, 200]}
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <ReferenceLine
              y={140}
              stroke="hsl(var(--status-warning))"
              strokeDasharray="5 5"
              label={{ value: "High Systolic", position: "right", fontSize: 10 }}
            />
            <ReferenceLine
              y={90}
              stroke="hsl(var(--status-warning))"
              strokeDasharray="5 5"
              label={{ value: "High Diastolic", position: "right", fontSize: 10 }}
            />
            <Line
              type="monotone"
              dataKey="systolic"
              stroke="hsl(var(--vital-bp))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="diastolic"
              stroke="hsl(var(--vital-bp) / 0.6)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
