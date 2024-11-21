import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ImpressionsChartProps {
  data: any[]
  keyword: string
}

export function ImpressionsChart({ data, keyword }: ImpressionsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impressions Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Legend />
            <Line type="monotone" dataKey="impressions" name="Impressions" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

