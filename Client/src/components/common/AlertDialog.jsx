import React from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import CircularProgress from '@mui/material/CircularProgress'
const AlertDialogDemo = ({
  placeHolder,
  heading,
  description,
  button1,
  button2,
  isOpen = null,
  onCancel,
  onConfirm,
  loading
}) => (
  <AlertDialog.Root open={isOpen !== null ? isOpen : undefined}>
    {isOpen === null && (
      <AlertDialog.Trigger asChild>
        <button className='text-violet11 hover:bg-mauve3 shadow-blackA4 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black'>
          {placeHolder}
        </button>
      </AlertDialog.Trigger>
    )}
    <AlertDialog.Portal>
      <AlertDialog.Overlay className='bg-blackA6 backdrop-blur-sm data-[state=open]:animate-overlayShow fixed inset-0 z-50' />
      <AlertDialog.Overlay className='bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0' />
      <AlertDialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] font-tertiary bg-customP2BackgroundW_700 text-slate-950 dark:text-slate-50 dark:bg-customP2BackgroundD p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-50'>
        <AlertDialog.Title className='text-mauve12 m-0 text-[20px] font-semibold'>
          {heading ? heading : 'Are you sure'}
        </AlertDialog.Title>
        <AlertDialog.Description className='text-mauve11 mt-4 mb-5 text-[17px] leading-normal text-lg'>
          {description ? description : 'This action cannot be undone'}
        </AlertDialog.Description>
        <div className='flex justify-end gap-[25px]'>
          <AlertDialog.Cancel asChild>
            <button
              onClick={onCancel}
              className='  hover:bg-customP2Primary duration-200 dark:hover:bg-customP2Primary bg-customP2BackgroundW_400  dark:bg-customP2BackgroundD_500 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]'
            >
              {button1 ? button1 : 'Cancel'}
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button
              onClick={onConfirm}
              className=' bg-red-400 w-20 hover:bg-red-300 dark:hover:bg-red-800 dark:bg-red-900 duration-200 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]'
            >
              {loading ? (
                <CircularProgress
                  sx={{
                    color: 'currentColor'
                  }}
                  size={20}
                  thickness={5}
                />
              ) : button2 ? (
                button2
              ) : (
                'Delete'
              )}
            </button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
)

export default AlertDialogDemo
