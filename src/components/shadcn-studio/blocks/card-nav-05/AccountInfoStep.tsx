'use client'

import { useCallback, useState } from 'react'

import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const AccountInfoStep = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prevState => !prevState)
  }, [])

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setIsConfirmPasswordVisible(prevState => !prevState)
  }, [])

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      <div className='flex flex-col items-start'>
        <Label htmlFor='multi-step-account-username' className='p-1 leading-5'>
          User Name*
        </Label>
        <Input id='multi-step-account-username' placeholder='John Doe' className='h-8' required />
      </div>
      <div className='flex flex-col items-start'>
        <Label htmlFor='multi-step-account-email' className='p-1 leading-5'>
          Email*
        </Label>
        <Input id='multi-step-account-email' type='email' placeholder='john@example.com' className='h-8' required />
      </div>
      <div className='flex flex-col items-start'>
        <Label htmlFor='multi-step-account-password' className='p-1 leading-5'>
          Password*
        </Label>
        <div className='relative w-full'>
          <Input
            id='multi-step-account-password'
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder='*****'
            required
            className='h-8 w-full pr-9'
          />
          <Button
            variant='ghost'
            size='icon'
            onClick={togglePasswordVisibility}
            className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 size-8 rounded-l-none hover:bg-transparent'
          >
            {isPasswordVisible ? <EyeOffIcon className='size-4' /> : <EyeIcon className='size-4' />}
            <span className='sr-only'>{isPasswordVisible ? 'Hide password' : 'Show password'}</span>
          </Button>
        </div>
      </div>
      <div className='flex flex-col items-start'>
        <Label htmlFor='multi-step-account-confirm-password' className='p-1 leading-5'>
          Confirm Password*
        </Label>
        <div className='relative w-full'>
          <Input
            id='multi-step-account-confirm-password'
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            placeholder='*****'
            required
            className='h-8 w-full pr-9'
          />
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleConfirmPasswordVisibility}
            className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 size-8 rounded-l-none hover:bg-transparent'
          >
            {isConfirmPasswordVisible ? <EyeOffIcon className='size-4' /> : <EyeIcon className='size-4' />}
            <span className='sr-only'>{isConfirmPasswordVisible ? 'Hide password' : 'Show password'}</span>
          </Button>
        </div>
      </div>
      <div className='mb-3 flex flex-col items-start sm:col-span-2'>
        <Label htmlFor='multi-step-account-profile-link' className='p-1 leading-5'>
          Profile Link
        </Label>
        <Input
          id='multi-step-account-profile-link'
          type='url'
          className='h-8'
          placeholder='https://www.linkedin.com/in/JohnDoe'
          required
        />
      </div>
    </div>
  )
}

export default AccountInfoStep
