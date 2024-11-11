import { useQuery } from '@tanstack/react-query'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import apiClient from '../../../../services/api/apiClient'
import Spinner from '../../../common/Animations/Spinner'

function SalesTrend({ COLORS }) {
  const fetchSalesTrend = async () => {
    const res = await apiClient.get('/api/sales-report/sales-trends-data')

    return res.data.data
  }
  const {
    data: salesTrendsData,
    isLoading,
    isError
  } = useQuery({
    queryFn: fetchSalesTrend,
    queryKey: ['salesTrenda']
  })
  if (isLoading) {
    return (
      <div className='flex justify-center items-center'>
        <Spinner speed={2} size={1} />
      </div>
    )
  }
  if (isError) {
    return <div>Can't Load Data</div>
  }

  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart data={salesTrendsData}>
        <CartesianGrid
          strokeDasharray='3 3'
          stroke='currentColor'
          className='opacity-40'
        />
        <XAxis dataKey='month' stroke='currentColor' />
        <YAxis stroke='currentColor' />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '13px',
                    border: '2px solid #ccc',
                    borderRadius: '4px'
                  }}
                >
                  <p
                    style={{
                      fontWeight: 'bold',
                      color: 'blue'
                    }}
                  >
                    {`Month: ${payload[0].payload.month}`}
                  </p>
                  <p
                    style={{
                      fontWeight: 'bold',
                      color: 'blue'
                    }}
                  >
                    {`Sales: ₹${payload[0].value.toFixed(2)}`}
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
        <Line
          type='monotone'
          dataKey='sales'
          stroke={COLORS[0]}
          strokeWidth={2}
          dot={{ fill: COLORS[0], r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default SalesTrend
