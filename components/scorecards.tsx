import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

interface ScorecardsProps {
  data: any[]
  comparisonDays: number
}

export function Scorecards({ data, comparisonDays }: ScorecardsProps) {
  const calculateMetric = (metric: string, days: number) => {
    const relevantData = data.slice(-days);
    return relevantData.reduce((sum, item) => sum + item[metric], 0);
  };

  const calculateChange = (metric: string) => {
    const currentValue = calculateMetric(metric, comparisonDays);
    const previousValue = calculateMetric(metric, comparisonDays * 2) - currentValue;
    const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
    return {
      value: currentValue,
      percentageChange: percentageChange,
      isPositive: percentageChange >= 0
    };
  };

  const metrics = [
    { name: 'Comments', key: 'comments' },
    { name: 'Impressions', key: 'impressions' },
    { name: 'Reactions', key: 'reactions' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map(metric => {
        const { value, percentageChange, isPositive } = calculateChange(metric.key);
        return (
          <Card key={metric.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {isPositive ? '+' : ''}{percentageChange.toFixed(2)}% compared to last {comparisonDays} days
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

