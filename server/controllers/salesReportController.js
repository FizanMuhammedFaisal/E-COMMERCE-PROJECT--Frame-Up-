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

export { getSalesReport, getDownloadURL }
