import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EngagementChartProps {
  data: any[]
  keyword: string
}

export function EngagementChart({ data, keyword }: EngagementChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Analysis</CardTitle>
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
            <Line type="monotone" dataKey="reactions" name="Reactions" stroke="#8884d8" />
            <Line type="monotone" dataKey="comments" name="Comments" stroke="#82ca9d" />
            <Line type="monotone" dataKey="shares" name="Shares" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

