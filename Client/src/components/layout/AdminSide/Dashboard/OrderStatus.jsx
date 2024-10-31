import { useQuery } from '@tanstack/react-query'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import apiClient from '../../../../services/api/apiClient'
import Spinner from '../../../common/Animations/Spinner'

function OrderStatus({ COLORS }) {
  const fetchData = async () => {
    const res = await apiClient.get('/api/sales-report/order-status-data')
    return res.data.data
  }

  const {
    data: orderStatusData,
    isLoading,
    isError
  } = useQuery({
    queryFn: fetchData,
    queryKey: ['orderStatusData']
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
      <PieChart>
        <Pie
          data={orderStatusData}
          cx='50%'
          cy='50%'
          innerRadius={60}
          outerRadius={80}
          labelLine={false}
          fill='#8884d8'
          paddingAngle={5}
          dataKey='value'
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {orderStatusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const index = orderStatusData.findIndex(
                item => item.name === payload[0].payload.name
              )
              const color = COLORS[index % COLORS.length]

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
                      color
                    }}
                  >
                    {`Name: ${payload[0].payload.name}`}
                  </p>
                  <p
                    style={{
                      fontWeight: 'bold',
                      color
                    }}
                  >
                    {`Value: ${payload[0].value}`}
                  </p>
                </div>
              )
            }
            return null
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default OrderStatus
