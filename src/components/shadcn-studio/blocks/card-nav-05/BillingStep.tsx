'use client'

import { useEffect } from 'react'

import { usePaymentInputs } from 'react-payment-inputs'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const BillingStep = () => {
  const { getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs()

  useEffect(() => {
    return () => {
      // Add cleanup logic for usePaymentInputs if necessary
    }
  }, [])

  return (
    <>
      <div className='grid grid-cols-12 gap-4'>
        <div className='col-span-12 flex flex-col items-start'>
          <Label htmlFor='multi-step-billing-name' className='p-1 leading-5'>
            Name
          </Label>
          <Input id='multi-step-billing-name' placeholder='Type here' className='h-8' required />
        </div>
        <div className='col-span-12 flex flex-col items-start'>
          <Label htmlFor='multi-step-billing-card-number' className='p-1 leading-5'>
            Card Number
          </Label>
          <Input
            {...getCardNumberProps()}
            id='multi-step-billing-card-number'
            placeholder='xxxx-xxxx-xxxx-xxxx'
            className='h-8'
            required
          />
        </div>
        <div className='col-span-6 flex flex-col items-start md:col-span-6'>
          <Label htmlFor='multi-step-billing-expiry-date' className='p-1 leading-5'>
            Expiration Date
          </Label>
          <Input
            {...getExpiryDateProps()}
            id='multi-step-billing-expiry-date'
            className='h-8'
            placeholder='--/--'
            required
          />
        </div>
        <div className='col-span-6 flex flex-col items-start md:col-span-6'>
          <Label htmlFor='multi-step-billing-cvc' className='p-1 leading-5'>
            CVV
          </Label>
          <Input {...getCVCProps()} id='multi-step-billing-cvc' className='h-8' placeholder='***' required />
        </div>
      </div>
      <div className='mb-3 flex items-center gap-2'>
        <Switch id='save-card' />
        <Label htmlFor='save-card' className='leading-5'>
          Save card for future billing?
        </Label>
      </div>
    </>
  )
}

export default BillingStep
