import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'

const ReusableTable = ({ columns, data }) => {
  return (
    <TableContainer
      component={Paper}
      className='dark:bg-gray-900  dark:text-white'
    >
      <Table size='small'>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={index}
                className='dark:text-slate-50 dark:bg-customP2BackgroundD_100 '
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className='border-b-2 border-gray-300 dark:border-zinc-700'
            >
              {columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  sx={{ padding: '8px' }}
                  className='dark:bg-customP2BackgroundD dark:bg-opacity-80 dark:text-teal-50'
                >
                  {row[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ReusableTable
