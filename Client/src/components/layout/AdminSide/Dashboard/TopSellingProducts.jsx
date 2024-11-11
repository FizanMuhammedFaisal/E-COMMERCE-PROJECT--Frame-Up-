import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import apiClient from '../../../../services/api/apiClient'
import Spinner from '../../../common/Animations/Spinner'

function TopSellingProducts({ COLORS }) {
  const fetchdata = async () => {
    const res = await apiClient.get('/api/sales-report/top-products-data')
    return res.data.data || []
  }
  const {
    data: topProductsData,
    isLoading,
    isError
  } = useQuery({
    queryFn: fetchdata,
    queryKey: ['topSellingData']
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
      <BarChart data={topProductsData}>
        <CartesianGrid
          strokeDasharray='3 3'
          stroke='currentColor'
          className='opacity-20'
        />
        <XAxis dataKey='name' stroke='currentColor' />
        <YAxis stroke='currentColor' />
        <Tooltip
          content={({ active, payload }) => {
            if (
              active &&
              payload &&
              payload.length &&
              payload[0].payload.sales !== undefined
            ) {
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
                      color: 'red'
                    }}
                  >
                    {`Name: ${payload[0].payload.name}`}
                  </p>
                  <p
                    style={{
                      fontWeight: 'bold',
                      color: 'red'
                    }}
                  >
                    {`Sales: ₹${payload[0].payload.sales.toFixed(2)}`}
                  </p>
                </div>
              )
            }
            return null
          }}
        />

        <Legend />
        <Bar dataKey='sales' fill={COLORS[1]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default TopSellingProducts
