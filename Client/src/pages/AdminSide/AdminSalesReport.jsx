import { useState, useMemo, useEffect, useCallback } from 'react'
import { AnimatePresence, easeInOut, motion } from 'framer-motion'
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import ReusableTable from '../../components/common/ReusableTable'
import apiClient from '../../services/api/apiClient'
import { useQuery } from '@tanstack/react-query'
import SalesCards from '../../components/layout/AdminSide/SalesReport/SalesCards'
import { ArrowDown } from 'lucide-react'
import SalesFilter from '../../components/layout/AdminSide/SalesReport/SalesFilter'

export default function AdminSalesReport() {
  const [period, setPeriod] = useState('Daily')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [salesData, setSalesData] = useState({
    sales: [],
    summary: {
      totalCancelled: null,
      totalCouponDiscount: null,
      totalDelivered: null,
      totalDiscount: null,
      totalOrderAmount: null,
      totalShippingCharge: null
    }
  })
  const [showGenerateReport, setShowGenerateReport] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const periodOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly']

  const fetchSalesData = async () => {
    let params
    if (showDatePicker) {
      params = { startDate, endDate }
    } else {
      params = { period }
    }
    const res = await apiClient.get('/api/sales-report/', {
      params
    })
    console.log(res.data)
    return res.data
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: fetchSalesData,
    queryKey: ['salesData'],
    enabled: false // Disable auto-fetching
  })

  useEffect(() => {
    if (data) {
      setSalesData(data)
    }
  }, [data])

  const columns = useMemo(
    () => [
      { label: 'Serial No', field: 'serialno' },
      { label: 'Order Date', field: 'orderDate' },
      { label: 'Order Number', field: 'orderNumber' },
      { label: 'Customer', field: 'customer' },
      { label: 'Total Order Amount (₹)', field: 'totalOrderAmount' },
      { label: 'Offer Discount (₹)', field: 'offerDiscount' },
      { label: 'Coupon Discount (₹)', field: 'couponDiscount' },
      { label: 'Shipping Charge (₹)', field: 'shippingCharge' },
      { label: 'Net Total (₹)', field: 'netTotal' }
    ],
    []
  )

  const datamock = useMemo(() => {
    return salesData?.sales.map((sale, i) => ({
      ...sale,
      serialno: i + 1,
      orderDate: `${new Date(sale.orderDate).toLocaleDateString()}`,
      totalOrderAmount: `₹${sale.totalOrderAmount.toFixed(2)}`,
      offerDiscount: `₹${sale.discount.toFixed(2)}`,
      couponDiscount: `₹${sale.couponDiscount.toFixed(2)}`,
      shippingCharge: `₹${sale.shippingCharge.toFixed(2)}`,
      netTotal: `₹${sale.netTotal.toFixed(2)}`
    }))
  }, [salesData.sales])

  const handleRefresh = () => {
    console.log('Refreshing data...')
    refetch()
  }

  const handleExport = async format => {
    console.log(format)
    let params
    if (showDatePicker) {
      params = { startDate, endDate, format }
    } else {
      params = { period, format }
    }

    try {
      const res = await apiClient.get('/api/sales-report/download-report', {
        params,
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `sales_report.${format}`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error(error, 'report download Failed')
    }
  }

  if (isError) return <div>Error loading sales data</div>

  return (
    <div className='p-6 space-y-6'>
      <SalesFilter
        handleRefresh={handleRefresh}
        handleExport={handleExport}
        period={period}
        setPeriod={setPeriod}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        showGenerateReport={showGenerateReport}
        showDatePicker={showDatePicker}
        periodOptions={periodOptions}
        refetch={refetch}
        setShowDatePicker={setShowDatePicker}
        setShowGenerateReport={setShowDatePicker}
      />

      <SalesCards salesData={salesData} />
      <div className='overflow-x-auto'>
        <ReusableTable columns={columns} data={datamock} />
      </div>
      {datamock.length === 0 && (
        <div className='text-center mt-4 text-gray-600 dark:text-gray-400'>
          No sales data found.
        </div>
      )}
    </div>
  )
}
