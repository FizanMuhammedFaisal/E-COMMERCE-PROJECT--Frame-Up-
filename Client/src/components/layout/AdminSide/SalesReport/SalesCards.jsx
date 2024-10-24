function SalesCards({ salesData }) {
  const SummaryCard = ({ title, value, bgColor }) => (
    <div className={`${bgColor} p-4 rounded-lg shadow-md`}>
      <h2 className='text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200'>
        {title}
      </h2>
      <p className='text-2xl font-bold text-gray-900 dark:text-white'>
        {value}
      </p>
    </div>
  )
  const summaryItems = [
    {
      title: 'Total Orders Delivered',
      value: salesData?.summary?.totalDelivered,
      bgColor: 'bg-blue-100 dark:bg-blue-800'
    },
    {
      title: 'Total Orders Cancelled',
      value: salesData?.summary?.totalCancelled,
      bgColor: 'bg-red-100 dark:bg-red-800'
    },
    {
      title: 'Total Order Amount',
      value:
        salesData?.summary?.totalOrderAmount &&
        `₹ ${salesData.summary.totalOrderAmount.toFixed(2)}`,
      bgColor: 'bg-green-100 dark:bg-green-800'
    },
    {
      title: 'Offer Discount Given',
      value:
        salesData?.summary?.totalDiscount &&
        `₹ ${salesData.summary.totalDiscount.toFixed(2)}`,
      bgColor: 'bg-yellow-100 dark:bg-yellow-800'
    },
    {
      title: 'Coupon Discount Given',
      value:
        salesData?.summary?.totalCouponDiscount &&
        `₹ ${salesData.summary.totalCouponDiscount.toFixed(2)}`,
      bgColor: 'bg-purple-100 dark:bg-purple-800'
    },
    {
      title: 'Shipping Charges',
      value:
        salesData?.summary?.totalShippingCharges &&
        `₹ ${salesData.summary.totalShippingCharges.toFixed(2)}`,
      bgColor: 'bg-indigo-100 dark:bg-indigo-800'
    },
    {
      title: 'Net Total Revenue',
      value:
        salesData?.summary?.netTotalRevenue &&
        `₹ ${salesData.summary.netTotalRevenue.toFixed(2)}`,
      bgColor: 'bg-pink-100 dark:bg-pink-800'
    }
  ]
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      {summaryItems.map(
        item =>
          item.value !== undefined && (
            <SummaryCard
              key={item.title}
              title={item.title}
              value={item.value}
              bgColor={item.bgColor}
            />
          )
      )}
    </div>
  )
}

export default SalesCards
