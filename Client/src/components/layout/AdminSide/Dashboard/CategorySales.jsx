import { useQuery } from '@tanstack/react-query'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import apiClient from '../../../../services/api/apiClient'
import Spinner from '../../../common/Animations/Spinner'

function CategorySales({ COLORS }) {
  const fetchData = async () => {
    const res = await apiClient.get('/api/sales-report/sales-distribution-data')

    return res.data.data || []
  }
  const {
    data: salesDistributionData,
    isLoading,
    isError
  } = useQuery({
    queryFn: fetchData,
    queryKey: ['salesDistributionData']
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
    <ResponsiveContainer
      width='100%'
      height={300}
      className='focus:outline-none'
    >
      <PieChart>
        <Pie
          data={salesDistributionData}
          cx='50%'
          cy='50%'
          labelLine={false}
          outerRadius={100}
          dataKey='value'
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {salesDistributionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const index = salesDistributionData.findIndex(
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
                    {`Sales: ₹${payload[0].value.toFixed(2)}`}
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

export default CategorySales
