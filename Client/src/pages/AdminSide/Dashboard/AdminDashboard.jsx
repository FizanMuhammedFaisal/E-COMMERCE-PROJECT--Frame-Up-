import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SalesTrend from '../../../components/layout/AdminSide/Dashboard/SalesTrend'
import TopSellingProducts from '../../../components/layout/AdminSide/Dashboard/TopSellingProducts'
import CategorySales from '../../../components/layout/AdminSide/Dashboard/CategorySales'
import OrderStatus from '../../../components/layout/AdminSide/Dashboard/OrderStatus'

const COLORS = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#6366F1',
  '#EC4899'
]

function AdminDashBoard() {
  const navigate = useNavigate()

  const ChartCard = ({ title, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:shadow-xl transition-shadow duration-300'
    >
      <h2 className='text-2xl font-bold mb-4'>{title}</h2>
      {children}
    </motion.div>
  )

  return (
    <div className='min-h-screen p-4 md:p-8   text-gray-800 dark:text-white'>
      <div className='container mx-auto'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-center md:text-left mb-4 md:mb-0 '>
            Dashboard
          </h1>
          <button
            onClick={() => navigate('/dashboard/best-sellers')}
            className='px-6 py-3 bg-customP2BackgroundD_700 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'
          >
            See Best Sellers
          </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <ChartCard title='Sales Trends'>
            <div className='h-[300px]'>
              <SalesTrend COLORS={COLORS} />
            </div>
          </ChartCard>

          <ChartCard title='Top-Selling Products'>
            <div className='h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'>
              <TopSellingProducts COLORS={COLORS} />
            </div>
          </ChartCard>

          <ChartCard title='Sales Distribution by Category'>
            <div className='h-[300px]'>
              <CategorySales COLORS={COLORS} />
            </div>
          </ChartCard>

          <ChartCard title='Order Status Breakdown'>
            <div className='h-[300px]'>
              <OrderStatus COLORS={COLORS} />
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

export default AdminDashBoard
// const artistRankingData = [
//   { name: 'John Doe', sales: 1500 },
//   { name: 'Jane Smith', sales: 1200 },
//   { name: 'Bob Johnson', sales: 1000 },
//   { name: 'Alice Brown', sales: 800 },
//   { name: 'Charlie Davis', sales: 600 }
// ]

{
  /* <ChartCard title='Artist Sales Ranking'>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={artistRankingData} layout='vertical'>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='currentColor'
                  className='opacity-20'
                />
                <XAxis type='number' stroke='currentColor' />
                <YAxis dataKey='name' type='category' stroke='currentColor' />
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
                              color: 'orange'
                            }}
                          >
                            {`Name: ${payload[0].payload.name}`}
                          </p>
                          <p
                            style={{
                              fontWeight: 'bold',
                              color: 'orange'
                            }}
                          >
                            {`Sales: $${payload[0].value.toFixed(2)}`}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Bar dataKey='sales' fill={COLORS[3]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard> */
}
