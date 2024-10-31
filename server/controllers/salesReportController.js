import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear
} from 'date-fns'
import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'

const generateSalesReport = async (startDate, endDate, period) => {
  let start, end

  switch (period) {
    case 'Daily':
      start = startOfDay(new Date())
      end = endOfDay(new Date())
      break
    case 'Weekly':
      start = startOfWeek(new Date())
      end = endOfWeek(new Date())
      break
    case 'Monthly':
      start = startOfMonth(new Date())
      end = endOfMonth(new Date())
      break
    case 'Yearly':
      start = startOfYear(new Date())
      end = endOfYear(new Date())
      break

    default:
      if (startDate && endDate) {
        start = new Date(startDate)
        end = new Date(endDate)
      } else {
        throw new Error('Invalid date range')
      }
  }
  const SD = new Date(start)
  const ED = new Date(end)

  // try {
  const order = await Order.find({
    createdAt: { $gte: SD, $lte: ED }
  }).populate('userId', 'username')
  // } catch (error) {
  //   throw new Error("could't find orders")
  // }
  const summary = {
    totalDelivered: 0,
    totalCancelled: 0,
    totalOrderAmount: 0,
    totalDiscount: 0,
    totalCouponDiscount: 0,
    totalShippingCharges: 0
  }
  const sales = order.map((order, i) => {
    if (order.orderStatus === 'Delivered') {
      summary.totalDelivered += 1
    } else if (order.orderStatus === 'Cancelled') {
      summary.totalCancelled += 1
    }
    summary.totalOrderAmount += order.subtotal || 0
    summary.totalDiscount += order.discount || 0
    summary.totalCouponDiscount += order.couponAmount || 0
    summary.totalShippingCharges += order.shippingCost || 0
    return {
      orderDate: order.createdAt,
      orderNumber: order._id,
      customer: order.userId.username,
      totalOrderAmount: order.subtotal,
      discount: order.discount,
      shippingCharge: order.shippingCost,
      netTotal: order.totalAmount,
      couponDiscount: order.couponAmount
    }
  })
  return { sales, summary }
}

const getSalesReport = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, period } = req.query
  console.log(req.query)
  if (
    (!period && (!startDate || !endDate)) ||
    (startDate && !endDate) ||
    (!startDate && endDate)
  ) {
    const error = new Error('Data for generation required')
    error.statusCode = 400
    return next(error)
  }

  try {
    const data = await generateSalesReport(startDate, endDate, period)
    console.log(data)
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
    console.error(err, err.message)
  }
})
const getDownloadURL = asyncHandler(async (req, res) => {
  const { startDate, endDate, period, format } = req.query
  if (
    (!period && (!startDate || !endDate)) ||
    (startDate && !endDate) ||
    (!startDate && endDate) ||
    !format
  ) {
    const error = new Error('Data for generation required')
    error.statusCode = 400
    return next(error)
  }
  const data = await generateSalesReport(startDate, endDate, period)
  if (format === 'pdf') {
    console.log(data)
    generatePDFReport(req, res, data, startDate, endDate)
  } else if (format === 'xlsx') {
    generateExcelReport(req, res, data)
  } else {
    const error = new Error('invalid Format')
    error.statusCode = 400
    return next(error)
  }
})

const generateExcelReport = async (req, res, data) => {
  try {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Sales Report')

    worksheet.columns = [
      { header: 'Serial No', key: 'serialno', width: 10 },
      { header: 'Order Date', key: 'orderDate', width: 15 },
      { header: 'Order Id', key: 'orderId', width: 15 },
      { header: 'Customer', key: 'customer', width: 20 },
      { header: 'Total Order Amount ', key: 'totalOrderAmount', width: 20 },
      { header: 'Offer Discount ', key: 'offerDiscount', width: 15 },
      { header: 'Coupon Discount ', key: 'couponDiscount', width: 15 },
      { header: 'Shipping Charge ', key: 'shippingCharge', width: 15 },
      { header: 'Net Total (₹)', key: 'netTotal', width: 20 }
    ]

    // adding rows
    data.sales.map((order, index) => {
      worksheet.addRow({
        serialno: index + 1,
        orderDate: new Date(order.orderDate).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        orderId: order.orderNumber,
        customer: order.customer,
        totalOrderAmount: order.totalOrderAmount,
        offerDiscount: order.offerDiscount,
        couponDiscount: order.couponDiscount,
        shippingCharge: order.shippingCharge,
        netTotal: order.netTotal
      })
    })

    // Set response headers for downloading the Excel file
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="sales_report.xlsx"'
    )

    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    res.status(500).send('Error generating Excel report')
    console.error(error)
  }
}
const generatePDFReport = async (req, res, data) => {
  try {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="sales_report.pdf"'
    )

    doc.pipe(res)

    // Title
    doc.fontSize(20).text('Sales Report', { align: 'center' })
    doc.moveDown(1.5)

    const summary = data.summary

    // Print summary
    doc.fontSize(14).font('Helvetica-Bold').text('Summary:', { align: 'left' })
    doc.moveDown(0.5)

    doc.fontSize(12).font('Helvetica')
    doc.text(`Total Delivered Orders: ${summary.totalDelivered}`)
    doc.text(`Total Cancelled Orders: ${summary.totalCancelled}`)
    doc.text(`Total Order Amount: ₹${summary.totalOrderAmount}`)
    doc.text(`Total Discount: ₹${summary.totalDiscount}`)
    doc.text(`Total Coupon Discount: ₹${summary.totalCouponDiscount}`)
    doc.text(`Total Shipping Charges: ₹${summary.totalShippingCharges}`)
    doc.moveDown(1)

    const tableTop = 230
    const columnWidths = {
      serialno: 50,
      orderDate: 80,
      orderId: 70,
      customer: 90,
      totalOrderAmount: 100,
      offerDiscount: 80,
      couponDiscount: 80,
      shippingCharge: 80,
      netTotal: 80
    }

    const totalTableWidth = Object.values(columnWidths).reduce(
      (a, b) => a + b,
      0
    )

    // Draw table headers
    doc.fontSize(12).font('Helvetica-Bold')
    drawTableRow(doc, tableTop, columnWidths, [
      'Serial No',
      'Order Date',
      'Order Id',
      'Customer',
      'Total Order Amount',
      'Offer Discount',
      'Coupon Discount',
      'Shipping Charge',
      'Net Total (₹)'
    ])

    doc
      .moveTo(50, tableTop + 20)
      .lineTo(50 + totalTableWidth, tableTop + 20)
      .stroke()

    let rowTop = tableTop + 30
    doc.font('Helvetica').fontSize(10)

    data.sales.forEach((order, index) => {
      const isEvenRow = index % 2 === 0
      const rowColor = isEvenRow ? '#f2f2f2' : '#ffffff'
      drawTableBackground(doc, rowTop, totalTableWidth, 20, rowColor)

      drawTableRow(doc, rowTop, columnWidths, [
        index + 1,
        new Date(order.orderDate).toLocaleDateString(),
        order.orderNumber,
        order.customer,
        order.totalOrderAmount,
        order.discount,
        order.couponDiscount,
        order.shippingCharge,
        order.netTotal
      ])

      rowTop += 20

      // Add page breaks if needed
      if (rowTop > 750) {
        doc.addPage()
        rowTop = 50
      }
    })

    doc.end()
  } catch (error) {
    res.status(500).send('Error generating PDF report')
    console.error(error)
  }
}

function drawTableRow(doc, y, columnWidths, rowData) {
  const startX = 50
  let x = startX
  const rowHeight = 20

  rowData.forEach((data, index) => {
    const columnWidth = columnWidths[Object.keys(columnWidths)[index]]
    const textHeight = doc.heightOfString(data, { width: columnWidth })
    const textY = y + (rowHeight - textHeight) / 2

    doc.text(data, x, textY, {
      width: columnWidth,
      align: 'center',
      ellipsis: true
    })

    x += columnWidth
  })
}

function drawTableBackground(doc, y, width, height, color) {
  doc.rect(50, y, width, height).fill(color).fillColor('#000')
}

const getSalesTrendsData = asyncHandler(async (req, res) => {
  const year = new Date().getFullYear()

  const currentMonth = new Date().getMonth() + 1
  const monthlySalesData = await Order.aggregate([
    {
      $addFields: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      }
    },
    {
      $match: {
        year: year,
        month: { $lte: currentMonth }
      }
    },
    {
      $group: {
        _id: { month: '$month' },
        totalSales: { $sum: '$subtotal' }
      }
    },
    {
      $project: {
        _id: 0,
        month: '$_id.month',
        totalSales: 1
      }
    },
    {
      $sort: { month: 1 }
    }
  ])

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  ///data upto curent month
  const monthlySales = Array.from({ length: currentMonth }, (_, i) => {
    const month = i + 1
    const salesData = monthlySalesData.find(data => data.month === month)
    return {
      month: monthNames[i],
      sales: salesData ? salesData.totalSales : 0
    }
  })
  if (monthlySales) {
    return res.json({ succees: true, data: monthlySales })
  }
  const error = new Error('Cannot get Data.')
  error.statusCode = 400
  return next(error)
})
//
const getTopProductsData = asyncHandler(async (req, res, next) => {
  const productData = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        name: { $first: '$items.productName' },
        totalSold: { $sum: '$items.quantity' },
        sales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
      }
    },
    {
      $sort: { sales: -1 }
    },
    {
      $limit: 5
    },

    {
      $project: {
        // totalSold: 1,
        name: 1,
        sales: 1,
        _id: 0
      }
    }
  ])
  if (productData) {
    return res.status(200).json({ success: true, data: productData })
  }
  const error = new Error('Cannot get Data.')
  error.statusCode = 400
  return next(error)
})
//
//
const getSalesDistributionData = asyncHandler(async (req, res, next) => {
  const categoryData = await Order.aggregate([
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'productDetails'
      }
    },
    { $unwind: '$productDetails' },
    { $unwind: '$productDetails.productCategories' },
    {
      $lookup: {
        from: 'categories',
        localField: 'productDetails.productCategories',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    },
    { $unwind: '$categoryDetails' },
    {
      $group: {
        _id: '$categoryDetails._id',
        name: { $first: '$categoryDetails.name' },
        totalSold: { $sum: '$items.quantity' },
        value: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
      }
    },
    {
      $sort: { sales: -1 }
    },
    {
      $limit: 5
    },
    {
      $project: {
        _id: 0,
        name: 1,
        value: 1
      }
    }
  ])

  if (categoryData) {
    return res.status(200).json({ success: true, data: categoryData })
  }
  const error = new Error('Cannot get Data.')
  error.statusCode = 400
  return next(error)
})
//
//
const getOrderStatusData = asyncHandler(async (req, res) => {
  const orderData = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus', // Group by `orderStatus` to get the unique status values
        count: { $sum: 1 } // Count each occurrence of each status
      }
    },
    {
      $project: {
        _id: 0, // Exclude `_id` in the final output
        name: '$_id', // Rename `_id` to `name` for readability
        value: '$count' // Assign `count` to `value` for clarity in the output
      }
    }
  ])

  if (orderData) {
    return res.status(200).json({ success: true, data: orderData })
  }
  const error = new Error('Cannot get Data.')
  error.statusCode = 400
  return next(error)
})
//
//
const getOverview = asyncHandler(async (req, res) => {
  try {
    const currentDate = new Date()
    const startOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    )
    const startOfPreviousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    )

    const result = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfPreviousMonth } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $project: {
          month: '$_id',
          totalRevenue: 1,
          totalOrders: 1,
          avgOrderValue: {
            $cond: {
              if: { $eq: ['$totalOrders', 0] },
              then: 0,
              else: { $divide: ['$totalRevenue', '$totalOrders'] }
            }
          }
        }
      },
      { $sort: { month: -1 } }
    ])

    const [currentMonthData, previousMonthData] = result

    const metrics = {
      totalRevenue: currentMonthData?.totalRevenue || 0,
      totalOrders: currentMonthData?.totalOrders || 0,
      avgOrderValue: currentMonthData?.avgOrderValue || 0,
      totalRevenueGrowth: previousMonthData
        ? ((currentMonthData.totalRevenue - previousMonthData.totalRevenue) /
            previousMonthData.totalRevenue) *
          100
        : 100,
      totalOrdersGrowth: previousMonthData
        ? ((currentMonthData.totalOrders - previousMonthData.totalOrders) /
            previousMonthData.totalOrders) *
          100
        : 100,
      avgOrderValueGrowth: previousMonthData
        ? ((currentMonthData.avgOrderValue - previousMonthData.avgOrderValue) /
            previousMonthData.avgOrderValue) *
          100
        : 100
    }

    res.json({ data: metrics, success: true })
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    res.status(500).json({ message: 'Server Error' })
  }
})

export {
  getSalesReport,
  getDownloadURL,
  getSalesTrendsData,
  getTopProductsData,
  getSalesDistributionData,
  getOrderStatusData,
  getOverview
}
