'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SelectNative } from '@/components/ui/select-native'

const PersonalInfoStep = () => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      <div className='flex flex-col items-start'>
        <Label htmlFor='multi-step-personal-info-first-name' className='p-1 leading-5'>
          Full Name*
        </Label>
        <Input id='multi-step-personal-info-first-name' placeholder='Type your name' className='h-8' required />
      </div>
      <div className='flex flex-col items-start'>
        <Label htmlFor='multi-step-personal-info-mobile' className='p-1 leading-5'>
          Mobile*
        </Label>
        <Input id='multi-step-personal-info-mobile' placeholder='Type your number' className='h-8' required />
      </div>
      <div className='flex flex-col items-start sm:col-span-2'>
        <Label htmlFor='multi-step-personal-info-address' className='p-1 leading-5'>
          Address*
        </Label>
        <Input id='multi-step-personal-info-address' placeholder='Type your address' className='h-8' required />
      </div>
      <div className='flex w-full flex-col items-start [&>:not(label)]:w-full'>
        <Label htmlFor='select-city' className='p-1 leading-5'>
          City*
        </Label>
        <SelectNative id='select-city' required className='h-8'>
          <option value='mumbai'>Mumbai</option>
          <option value='ahmedabad'>Ahmedabad</option>
          <option value='kolkata'>Kolkata</option>
          <option value='chennai'>Chennai</option>
          <option value='pune'>Pune</option>
          <option value='jaipur'>Jaipur</option>
        </SelectNative>
      </div>
      <div className='flex w-full flex-col items-start [&>:not(label)]:w-full'>
        <Label htmlFor='select-state' className='p-1 leading-5'>
          State*
        </Label>
        <SelectNative id='select-state' required className='h-8'>
          <option value='assam'>Assam</option>
          <option value='karnataka'>Karnataka</option>
          <option value='rajasthan'>Rajasthan</option>
          <option value='bihar'>Bihar</option>
          <option value='uttar Pradesh'>Uttar Pradesh</option>
          <option value='haryana'>Haryana</option>
        </SelectNative>
      </div>
      <div className='mb-3 flex flex-col items-start sm:col-span-2'>
        <Label htmlFor='landmark' className='p-1 leading-5'>
          Landmark*
        </Label>
        <Input id='landmark' placeholder='Area/ Landmark' required className='h-8' />
      </div>
    </div>
  )
}

export default PersonalInfoStep
