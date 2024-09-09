import CategoriesTable from '../../../common/ReusableTable'
import React, { useMemo } from 'react'

function CategoryTable({ data }) {
  const columns = [
    { label: 'Serial No.', field: 'serialNo' },
    { label: 'Name', field: 'name' },
    { label: 'Description', field: 'description' },

    { label: 'Action', field: 'action' }
  ]
  const store = useMemo(
    () =>
      data?.map((curr, index) => ({
        serialNo: index + 1,
        name: (
          <div className='p-2 text-lg font-tertiary'>
            {curr.name || 'Name not available'}
          </div>
        ),
        description: (
          <div className='p-2 text-lg font-tertiary'>
            {curr.description || 'No Description'}
          </div>
        ),

        action: (
          <h1>hey</h1>
          //   <Select
          //     name='status'
          //     value={curr.status}
          //     onChange={e => {
          //       //   handleStatusChange(curr._id, e.target.value)
          //     }}
          //     className={` w-40 py-2 px-3 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
          //      dark:bg-gray-800  text-gray-900 ${
          //        curr.status === 'Blocked'
          //          ? 'bg-red-400  text-slate-900   dark:text-slate-50 dark:bg-red-600 '
          //          : 'bg-green-400 dark:bg-green-700 dark:text-slate-50'
          //      }
          //     `}
          //   >
          //     <option value='Active'>Active</option>
          //     <option value='Blocked'>Blocked</option>
          //   </Select>
        )
      })),
    [data]
  )
  return (
    <div>
      {' '}
      <CategoriesTable columns={columns} data={store} />
    </div>
  )
}

export default CategoryTable
