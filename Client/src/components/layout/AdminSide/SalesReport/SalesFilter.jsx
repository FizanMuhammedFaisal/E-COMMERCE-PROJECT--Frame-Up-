import { useState, useCallback } from 'react'
import {
  ChevronDown,
  RefreshCw,
  Download,
  FileText,
  FileSpreadsheet,
  Calendar
} from 'lucide-react'

export default function SalesFilter({
  handleRefresh,
  handleExport,
  period,
  setPeriod,
  startDate,
  endDate,
  showGenerateReport,
  periodOptions,
  showDatePicker,
  setShowGenerateReport,
  setShowDatePicker,
  setStartDate,
  setEndDate,
  refetch
}) {
  const [dateError, setDateError] = useState('')
  const [showExportOptions, setShowExportOptions] = useState(false)

  const handleGenerateReport = useCallback(() => {
    if (validateDates()) {
      refetch()
      setShowGenerateReport(false)
    }
  }, [period, startDate, endDate, refetch, setShowGenerateReport])

  const handleDatePick = () => {
    setShowGenerateReport(true)
    setShowDatePicker(!showDatePicker)
  }

  const handlePeriodChange = useCallback(
    e => {
      setPeriod(e.target.value)
      setShowGenerateReport(true)
      setShowDatePicker(false)
    },
    [setPeriod, setShowGenerateReport, setShowDatePicker]
  )

  const handleDateChange = (value, type) => {
    setShowGenerateReport(true)
    if (type === 'startDate') {
      setStartDate(value)
    } else {
      setEndDate(value)
    }
    validateDates()
  }

  const validateDates = () => {
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        setDateError('Start date cannot be after end date')
        return false
      } else {
        setDateError('')
        return true
      }
    }
    return true
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Sales Report
        </h2>
        <div className='flex items-center space-x-2'>
          <button
            onClick={handleRefresh}
            className='px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition duration-300 ease-in-out flex items-center justify-center'
          >
            <RefreshCw className='h-5 w-5 mr-2' />
            Refresh
          </button>
          <div className='relative'>
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className='px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition duration-300 ease-in-out flex items-center justify-center'
            >
              <Download className='h-5 w-5 mr-2' />
              Export
              <ChevronDown className='h-4 w-4 ml-2' />
            </button>
            {showExportOptions && (
              <div className='absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5'>
                <div
                  className='py-1'
                  role='menu'
                  aria-orientation='vertical'
                  aria-labelledby='options-menu'
                >
                  <button
                    onClick={() => {
                      handleExport('pdf')
                      setShowExportOptions(false)
                    }}
                    className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left'
                    role='menuitem'
                  >
                    <FileText className='h-4 w-4 mr-2' />
                    Export as PDF
                  </button>
                  <button
                    onClick={() => {
                      handleExport('xlsx')
                      setShowExportOptions(false)
                    }}
                    className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left'
                    role='menuitem'
                  >
                    <FileSpreadsheet className='h-4 w-4 mr-2' />
                    Export as Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='flex flex-wrap items-end gap-4'>
        <div className='flex-grow max-w-xs'>
          <label
            htmlFor='period'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            Select Period
          </label>
          <div className='relative'>
            <select
              id='period'
              value={period}
              onChange={handlePeriodChange}
              className='block w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400'
            >
              {periodOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300'>
              <ChevronDown className='h-4 w-4' />
            </div>
          </div>
        </div>

        <button
          onClick={handleDatePick}
          className='px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-300 ease-in-out flex items-center justify-center'
        >
          <Calendar className='h-5 w-5 mr-2' />
          {showDatePicker ? 'Hide Date Range' : 'Select Date Range'}
        </button>

        {showGenerateReport && (
          <button
            onClick={handleGenerateReport}
            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition duration-300 ease-in-out flex items-center justify-center'
          >
            <FileText className='h-5 w-5 mr-2' />
            Generate Report
          </button>
        )}
      </div>

      {showDatePicker && (
        <div className='flex flex-wrap items-center gap-4'>
          <div className='flex-grow max-w-xs'>
            <label
              htmlFor='startDate'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Start Date
            </label>
            <input
              id='startDate'
              type='date'
              value={startDate}
              onChange={e => handleDateChange(e.target.value, 'startDate')}
              className='block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            />
          </div>
          <div className='flex-grow max-w-xs'>
            <label
              htmlFor='endDate'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              End Date
            </label>
            <input
              id='endDate'
              type='date'
              value={endDate}
              onChange={e => handleDateChange(e.target.value, 'endDate')}
              className='block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            />
          </div>
        </div>
      )}

      {dateError && <p className='text-red-500 text-sm mt-2'>{dateError}</p>}
    </div>
  )
}
