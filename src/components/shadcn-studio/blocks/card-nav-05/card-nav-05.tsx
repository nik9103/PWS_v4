'use client'
import { useRef, useCallback, useMemo } from 'react'

import * as Stepperize from '@stepperize/react'
import {
  UserIcon,
  CircleUserRoundIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ScrollTextIcon,
  ChevronRightIcon,
  CheckIcon
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import AccountInfoStep from '@/components/shadcn-studio/blocks/card-nav-05/AccountInfoStep'
import PersonalInfoStep from '@/components/shadcn-studio/blocks/card-nav-05/PersonalInfoStep'
import BillingStep from '@/components/shadcn-studio/blocks/card-nav-05/BillingStep'

import { cn } from '@/lib/utils'

import Logo from '@/components/shadcn-studio/logo'

const { useStepper } = Stepperize.defineStepper(
  { id: 'account', title: 'Account', description: 'Account Information', icon: CircleUserRoundIcon },
  {
    id: 'personal',
    title: 'Personal',
    description: 'Personal Information',
    icon: UserIcon
  },
  {
    id: 'billing',
    title: 'Billing',
    description: 'Payment Details',
    icon: ScrollTextIcon
  }
)

export type StepperType = ReturnType<typeof useStepper>

const CreateAppDialog = () => {
  const stepper = useStepper()
  const currentStep = stepper.lookup.getIndex(stepper.state.current.data.id)
  const formRef = useRef<HTMLFormElement>(null)
  const stepperRef = useRef(stepper)

  // Keep stepper ref updated
  stepperRef.current = stepper

  const handleStepNavigation = useCallback((targetStepId: 'account' | 'personal' | 'billing') => {
    const currentStepper = stepperRef.current
    const targetStepIndex = currentStepper.lookup.getIndex(targetStepId)
    const currentStepIndex = currentStepper.lookup.getIndex(currentStepper.state.current.data.id)

    if (targetStepIndex <= currentStepIndex) {
      currentStepper.navigation.goTo(targetStepId)

      return
    }

    const form = formRef.current

    if (form && form.checkValidity()) {
      currentStepper.navigation.goTo(targetStepId)
    } else {
      const firstInvalidField = form?.querySelector(':invalid') as HTMLElement

      firstInvalidField?.focus()
    }
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()

    const form = formRef.current

    if (form && form.checkValidity()) {
      stepperRef.current.navigation.next()
    } else {
      const firstInvalidField = form?.querySelector(':invalid') as HTMLElement

      firstInvalidField?.focus()
    }
  }, [])

  const handleFinalSubmit = useCallback(() => {
    const form = formRef.current

    if (form && form.checkValidity()) {
      alert('Form submitted successfully!')
    } else {
      const firstInvalidField = form?.querySelector(':invalid') as HTMLElement

      firstInvalidField?.focus()
    }
  }, [])

  const handlePrevious = useCallback(() => {
    stepperRef.current.navigation.prev()
  }, [])

  // Memoize step content to prevent creating new functions on every render
  const stepContent = useMemo(() => {
    const stepId = stepper.state.current.data.id

    if (stepId === 'account') {
      return <AccountInfoStep />
    }

    if (stepId === 'personal') {
      return <PersonalInfoStep />
    }

    if (stepId === 'billing') {
      return <BillingStep />
    }

    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepper.state.current.data.id])

  // Memoize navigation items to prevent recreating functions in map
  const navigationItems = useMemo(() => {
    return stepper.state.all.map((step, index) => {
      const StepIcon = step.icon
      const stepId = step.id as 'account' | 'personal' | 'billing'

      return (
        <li key={step.id}>
          <button
            type='button'
            className={cn('flex w-full items-center justify-between gap-2 rounded-sm p-2', {
              'bg-accent': index === currentStep
            })}
            onClick={() => handleStepNavigation(stepId)}
          >
            <div className='flex gap-2'>
              <StepIcon className='size-4.5' />
              <span className='text-foreground text-sm'>{step.title}</span>
            </div>
            <ChevronRightIcon className='size-4.5' />
          </button>
        </li>
      )
    })
  }, [stepper.state.all, currentStep, handleStepNavigation])

  return (
    <Card className='w-full max-w-167'>
      <CardContent className='flex gap-2 max-md:flex-col max-md:px-4'>
        <nav aria-label='Multi Steps' className='space-y-6 rounded-md border p-3'>
          {/* Logo */}
          <a href='#'>
            <Logo className='mb-6 gap-3' />
          </a>

          <ol className='flex flex-col justify-between gap-1'>{navigationItems}</ol>
        </nav>
        <form ref={formRef} className='flex flex-1 flex-col gap-4 max-md:pt-6 md:p-3' onSubmit={handleSubmit}>
          <p className='text-muted-foreground text-base font-medium'>{stepper.state.current.data.description}</p>
          {stepContent}
          <div className='flex !justify-between'>
            <Button
              variant='secondary'
              size='lg'
              type='button'
              onClick={handlePrevious}
              disabled={stepper.state.isFirst}
            >
              <ArrowLeftIcon />
              Previous
            </Button>
            {stepper.state.isLast ? (
              <Button
                size='lg'
                type='button'
                onClick={handleFinalSubmit}
                className='bg-green-600 text-white hover:bg-green-600/90 focus-visible:ring-green-600/20 dark:bg-green-400/60 dark:hover:bg-green-400/50 dark:focus-visible:ring-green-400/40'
              >
                Success
                <CheckIcon />
              </Button>
            ) : (
              <Button size='lg' type='submit'>
                Next
                <ArrowRightIcon />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateAppDialog
