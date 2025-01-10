'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  BloodDonationRequestFormSchema,
  BloodDonationRequestFormInput
} from '@/schema/donation-request'
import { Button, Alert, Stepper, Step, StepLabel } from '@mui/material'
import { TextFieldElement, SelectElement } from 'react-hook-form-mui'
import { useState } from 'react'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import { z } from 'zod'
import { IoArrowBack, IoArrowForward, IoSend } from 'react-icons/io5'
import { divisions, districts, upazillas } from 'bd-geojs'
import { useWatch } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { DonationRequestInfo } from '@/types/donation-request'
import { Session } from 'next-auth'

const steps = ['Donation Details', 'Address', 'Patient']

type FieldName =
  | keyof BloodDonationRequestFormInput
  | `donationRequest.${keyof BloodDonationRequestFormInput['donationRequest']}`
  | `address.${keyof BloodDonationRequestFormInput['address']}`
  | `patient.${keyof BloodDonationRequestFormInput['patient']}`

type FieldConfig = {
  name: FieldName
  type: string
  label: string
  options?: { id: string; label: string }[]
  placeholder?: string
  multiline?: boolean
  rows?: number
  date?: boolean
  slotProps?: {
    input?: {
      type?: string
    }
  }
}

const divisionOptions = divisions.map((division) => ({
  id: division.id,
  label: division.name
}))

const getDistrictOptions = (divisionId: string) => {
  return districts
    .filter((district) => district.division_id === divisionId)
    .map((district) => ({
      id: district.id,
      label: district.name
    }))
}

const getUpazilaOptions = (districtId: string) => {
  return upazillas
    .filter((upazila) => upazila.district_id === districtId)
    .map((upazila) => ({
      id: upazila.id,
      label: upazila.name
    }))
}

const donationFields: Array<FieldConfig> = [
  {
    name: 'donationRequest.bloodGroup',
    type: 'select',
    label: 'Blood Group',
    placeholder: 'Select blood group',
    options: [
      { id: 'A_POSITIVE', label: 'A+' },
      { id: 'A_NEGATIVE', label: 'A-' },
      { id: 'B_POSITIVE', label: 'B+' },
      { id: 'B_NEGATIVE', label: 'B-' },
      { id: 'AB_POSITIVE', label: 'AB+' },
      { id: 'AB_NEGATIVE', label: 'AB-' },
      { id: 'O_POSITIVE', label: 'O+' },
      { id: 'O_NEGATIVE', label: 'O-' }
    ]
  },
  {
    name: 'donationRequest.requiredOn',
    type: 'datetime',
    label: 'Date when required ? ',
    placeholder: 'Select date and time'
  },
  {
    name: 'donationRequest.phone',
    type: 'text',
    label: 'Contact number ',
    placeholder: 'Enter phone number'
  },
  {
    name: 'donationRequest.unit',
    type: 'number',
    label: 'Number of bags required',
    placeholder: 'Enter number of bags required',
    slotProps: {
      input: {
        type: 'number'
      }
    }
  },
  {
    name: 'donationRequest.priority',
    type: 'select',
    label: 'Priority',
    placeholder: 'Select priority',
    options: [
      { id: 'LOW', label: 'Low' },
      { id: 'MEDIUM', label: 'Medium' },
      { id: 'HIGH', label: 'High' }
    ]
  },
  {
    name: 'donationRequest.notes',
    type: 'text',
    label: 'Notes',
    placeholder: 'Enter any notes',
    multiline: true,
    rows: 3
  }
]

const LocationFields = ({
  control,
  errors
}: {
  control: Control<BloodDonationRequestFormInput>
  errors: FieldErrors<BloodDonationRequestFormInput>
}) => {
  const division = useWatch({
    control,
    name: 'address.division'
  })
  const district = useWatch({
    control,
    name: 'address.district'
  })

  const districtOptions = division ? getDistrictOptions(division) : []
  const upazilaOptions = district ? getUpazilaOptions(district) : []

  return (
    <>
      <SelectElement
        name="address.division"
        control={control}
        label="Division"
        options={divisionOptions}
        helperText={errors.address?.division?.message}
        fullWidth={true}
        slotProps={{
          ...commonTextFieldProps.slotProps,

          select: {
            displayEmpty: true,
            renderValue: (value: unknown) => {
              if (!value) return 'Select one'
              const option = divisionOptions.find((opt) => opt.id === value)
              return option?.label || String(value)
            }
          }
        }}
      />
      <SelectElement
        name="address.district"
        control={control}
        label="District"
        options={districtOptions}
        disabled={!division}
        helperText={errors.address?.district?.message}
        fullWidth={true}
        slotProps={{
          ...commonTextFieldProps.slotProps,
          select: {
            displayEmpty: true,
            renderValue: (value: unknown) => {
              if (!value) return 'Select one'
              const option = districtOptions.find((opt) => opt.id === value)
              return option?.label || String(value)
            }
          }
        }}
      />
      <SelectElement
        name="address.upazila"
        control={control}
        label="Upazila"
        options={upazilaOptions}
        disabled={!district}
        helperText={errors.address?.upazila?.message}
        fullWidth={true}
        slotProps={{
          ...commonTextFieldProps.slotProps,
          select: {
            displayEmpty: true,
            renderValue: (value: unknown) => {
              if (!value) return 'Select one'
              const option = upazilaOptions.find((opt) => opt.id === value)
              return option?.label || String(value)
            }
          }
        }}
      />
    </>
  )
}

const addressFields: Array<FieldConfig> = [
  {
    name: 'address.label',
    type: 'text',
    label: 'Label',
    placeholder: 'eg. Dhaka Medical College Hospital'
  },
  {
    name: 'address.type',
    type: 'select',
    label: 'Address Type',
    options: [
      { id: 'HOSPITAL', label: 'Hospital' },
      { id: 'BLOOD_BANK', label: 'Blood Bank' },
      { id: 'OTHER', label: 'Other' }
    ]
  },
  {
    name: 'address.streetAddress',
    type: 'text',
    label: 'Street Address',
    placeholder: 'eg. 22, Baker Street',
    multiline: true,
    rows: 2
  },
  {
    name: 'address.postalCode',
    type: 'text',
    label: 'Postal Code',
    placeholder: 'eg. 1200'
  },
  {
    name: 'address.landmark',
    type: 'text',
    label: 'Landmark',
    placeholder: 'eg. Near to Dhaka Medical College Hospital'
  },
  {
    name: 'address.instructions',
    type: 'text',
    label: 'Additional Instructions',
    placeholder: 'Cabin no, or Floor no or any other instructions',
    multiline: true,
    rows: 2
  }
]

const patientFields: Array<FieldConfig> = [
  {
    name: 'patient.name',
    type: 'text',
    label: 'Patient Name',
    placeholder: 'Enter patient name'
  },
  {
    name: 'patient.gender',
    type: 'select',
    label: 'Gender',
    placeholder: 'Select gender',
    options: [
      { id: 'MALE', label: 'Male' },
      { id: 'FEMALE', label: 'Female' },
      { id: 'OTHER', label: 'Other' },
      { id: 'UNDISCLOSED', label: 'Prefer not to say' }
    ]
  },
  {
    name: 'patient.age',
    type: 'number',
    label: 'Age',
    placeholder: 'Enter patient age'
  },
  {
    name: 'patient.disease',
    type: 'text',
    label: 'Condition',
    placeholder: 'Enter patient current health condition',
    multiline: true,
    rows: 2
  }
]

const commonTextFieldProps = {
  fullWidth: true,
  slotProps: {
    input: {
      style: { fontSize: '14px' }
    },
    inputLabel: {
      shrink: true
    }
  }
}

const commonSelectFieldProps = {
  ...commonTextFieldProps,
  slotProps: {
    ...commonTextFieldProps.slotProps,
    select: {
      displayEmpty: true,
      renderValue: (value: unknown) => {
        if (!value) return 'Select one'
        const option =
          donationFields
            .find((field) => field.type === 'select')
            ?.options?.find((opt) => opt.id === value) ||
          addressFields
            .find((field) => field.type === 'select')
            ?.options?.find((opt) => opt.id === value) ||
          patientFields
            .find((field) => field.type === 'select')
            ?.options?.find((opt) => opt.id === value)

        return option?.label || String(value)
      }
    }
  }
}

const isFieldOptional = (schema: z.ZodTypeAny, path: string): boolean => {
  const keys = path.split('.')
  let currentSchema = schema

  const section = keys[0] as keyof typeof BloodDonationRequestFormSchema.shape
  currentSchema = BloodDonationRequestFormSchema.shape[section]

  const field = keys[1]
  if (currentSchema instanceof z.ZodObject) {
    const fieldSchema = currentSchema.shape[field]
    return (
      fieldSchema instanceof z.ZodOptional ||
      (fieldSchema instanceof z.ZodObject && fieldSchema.isOptional?.()) ||
      (fieldSchema instanceof z.ZodString && fieldSchema.isOptional?.())
    )
  }

  return false
}

const FormField = ({
  field,
  control,
  errors
}: {
  field: FieldConfig
  control: Control<BloodDonationRequestFormInput>
  errors: FieldErrors<BloodDonationRequestFormInput>
}) => {
  const getFieldError = (fieldName: string) => {
    const [section, key] = fieldName.split('.') as [
      keyof BloodDonationRequestFormInput,
      string
    ]
    return (
      (errors[section] as Record<string, { message: string }>)?.[key]
        ?.message || ''
    )
  }

  const optional = isFieldOptional(BloodDonationRequestFormSchema, field.name)
  const label = optional ? `${field.label} (optional)` : field.label

  if (field.type === 'datetime') {
    return (
      <Controller
        key={field.name}
        name={field.name}
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label={label}
                value={value}
                onChange={onChange}
                format="MMM DD, YYYY hh:mm A"
                maxDate={dayjs().add(1, 'month')}
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!getFieldError(field.name),
                    helperText: getFieldError(field.name)
                  },
                  popper: {
                    placement: 'bottom-start',
                    modifiers: [
                      {
                        name: 'offset',
                        options: { offset: [0, -200] }
                      }
                    ]
                  }
                }}
              />
            </LocalizationProvider>
          )
        }}
      />
    )
  }

  if (field.type === 'select') {
    return (
      <SelectElement
        key={field.name}
        name={field.name}
        control={control}
        label={label}
        placeholder={field.placeholder}
        options={field.options}
        helperText={getFieldError(field.name)}
        {...commonSelectFieldProps}
      />
    )
  }

  return (
    <TextFieldElement
      key={field.name}
      name={field.name}
      control={control}
      label={label}
      placeholder={field.placeholder}
      multiline={field.multiline}
      rows={field.rows}
      type={field.type}
      helperText={getFieldError(field.name)}
      {...commonTextFieldProps}
    />
  )
}

// New component for the stepper
const FormStepper = ({ activeStep }: { activeStep: number }) => (
  <div className="w-full max-w-xl py-4 md:py-8">
    <Stepper activeStep={activeStep}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  </div>
)

// New component for navigation buttons
const FormNavigation = ({
  activeStep,
  handleBack,
  handleNext,
  steps,
  handleSubmit
}: {
  activeStep: number
  handleBack: () => void
  handleNext: () => void
  steps: string[]
  handleSubmit: () => void
}) => (
  <div className="border-t pt-4 pb-1 px-6">
    <div className="max-w-md mx-auto flex gap-4">
      <Button
        type="button"
        disabled={activeStep === 0}
        onClick={handleBack}
        variant="outlined"
        fullWidth
        size="large"
        className="py-3"
        startIcon={<IoArrowBack size={16} />}
      >
        Back
      </Button>
      {activeStep === steps.length - 1 ? (
        <Button
          // type="submit"
          variant="contained"
          fullWidth
          size="large"
          className="py-3"
          endIcon={<IoSend size={16} />}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleNext}
          variant="contained"
          fullWidth
          size="large"
          className="py-3"
          endIcon={<IoArrowForward size={16} />}
        >
          Next
        </Button>
      )}
    </div>
  </div>
)

// New component for form content
const FormContent = ({
  activeStep,
  control,
  errors
}: {
  activeStep: number
  control: Control<BloodDonationRequestFormInput>
  errors: FieldErrors<BloodDonationRequestFormInput>
}) => {
  const getStepContent = (step: number) => {
    if (step === 1) {
      return (
        <div className="space-y-6 py-4">
          {addressFields.slice(0, 2).map((field) => (
            <FormField
              key={field.name}
              field={field}
              control={control}
              errors={errors}
            />
          ))}
          <LocationFields control={control} errors={errors} />
          {addressFields.slice(2).map((field) => (
            <FormField
              key={field.name}
              field={field}
              control={control}
              errors={errors}
            />
          ))}
        </div>
      )
    }

    const fieldGroups = {
      0: donationFields,
      2: patientFields
    }

    const fields = fieldGroups[step as keyof typeof fieldGroups]

    if (!fields) return null

    return (
      <div className="space-y-6 py-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            control={control}
            errors={errors}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-16rem)] md:h-[calc(100vh-19.5rem)] overflow-y-auto p-6">
      {getStepContent(activeStep)}
    </div>
  )
}

// Main form component
const BloodDonationRequestForm = ({
  requestInfo,
  user
}: {
  requestInfo: DonationRequestInfo
  user: Session['user']
}) => {
  console.log(user)
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<BloodDonationRequestFormInput>({
    resolver: zodResolver(BloodDonationRequestFormSchema),
    defaultValues: {
      donationRequest: {
        bloodGroup: requestInfo?.bloodGroup || 'O_POSITIVE',
        unit: 1,
        requiredOn: requestInfo?.requiredOn
          ? dayjs(requestInfo.requiredOn)
          : dayjs().add(1, 'day'),
        phone: requestInfo?.phone || user?.phone || '+880',
        notes: requestInfo?.notes || '',
        priority: requestInfo?.priority || 'MEDIUM'
      },
      address: {
        label: requestInfo?.address?.label || '',
        type: requestInfo?.address?.type || 'OTHER',
        division: requestInfo?.address?.division || '',
        district: requestInfo?.address?.district || '',
        upazila: requestInfo?.address?.upazila || '',
        streetAddress: requestInfo?.address?.streetAddress || '',
        postalCode: requestInfo?.address?.postalCode || '',
        landmark: requestInfo?.address?.landmark || '',
        instructions: requestInfo?.address?.instructions || ''
      },
      patient: {
        name: requestInfo?.patient?.name || '',
        gender: requestInfo?.patient?.gender || 'MALE',
        age: requestInfo?.patient?.age || 0,
        disease: requestInfo?.patient?.disease || ''
      }
    }
  })

  const validateStep = async (step: number) => {
    const schemaGroups = {
      0: BloodDonationRequestFormSchema.shape.donationRequest,
      1: BloodDonationRequestFormSchema.shape.address,
      2: BloodDonationRequestFormSchema.shape.patient
    }

    const currentSchema = schemaGroups[step as keyof typeof schemaGroups]
    const fieldsToValidate = Object.keys(currentSchema.shape).map(
      (key) => `${['donationRequest', 'address', 'patient'][step]}.${key}`
    ) as Array<FieldName>

    const result = await trigger(fieldsToValidate)
    return result
  }

  const handleNext = async () => {
    const isStepValid = await validateStep(activeStep)
    if (isStepValid) {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const onSubmit = async (data: BloodDonationRequestFormInput) => {
    setError(null)
    try {
      console.log('====>', { donationRequestId: requestInfo.id, ...data })
      const response = await fetch('/api/blood-donations/submit-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ donationRequestId: requestInfo.id, ...data })
      })

      const result = await response.json()
      console.log(result)

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit request')
      }

      router.push(
        `/blood-donation-request/confirmation?id=${encodeURIComponent(
          result.data.requestId
        )}`
      )
    } catch (err) {
      console.error(err)
      setError('Failed to submit the form. Please try again.')
    }
  }

  return (
    <div className="flex flex-col items-center">
      {error && (
        <Alert severity="error" className="mb-6 w-full max-w-6xl">
          {error}
        </Alert>
      )}

      <FormStepper activeStep={activeStep} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl relative rounded-md border border-gray-100"
      >
        <div className="text-center text-base font-medium border-b py-2">
          {steps[activeStep]}
        </div>
        <FormContent
          activeStep={activeStep}
          control={control}
          errors={errors}
        />
        <FormNavigation
          activeStep={activeStep}
          handleBack={handleBack}
          handleNext={handleNext}
          steps={steps}
          handleSubmit={handleSubmit(onSubmit)}
        />
      </form>
    </div>
  )
}

export default BloodDonationRequestForm
