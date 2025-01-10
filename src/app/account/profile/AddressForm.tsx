'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextFieldElement, SelectElement } from 'react-hook-form-mui'
import { Control, FieldErrors } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { divisions, districts, upazillas } from 'bd-geojs'
import { AddressInput, AddressSchema } from '@/schema/donation-request'
import { UpdateProfileInput } from '@/schema/account'
import PlaceInput from '@/app/components/PlaceInput'
import { useState, useTransition } from 'react'
import { GooglePlaceSuggestion } from '@/types/place'
import axios from 'axios'

type FieldConfig = {
  name: keyof AddressInput
  type: string
  label: string
  options?: { id: string; label: string }[]
  placeholder?: string
  multiline?: boolean
  rows?: number
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

const addressFields: Array<FieldConfig> = [
  {
    name: 'label',
    type: 'text',
    label: 'Label',
    placeholder: 'eg. Home, Office'
  },
  {
    name: 'type',
    type: 'select',
    label: 'Address Type',
    options: [
      { id: 'HOME', label: 'Home' },
      { id: 'OFFICE', label: 'Office' },
      { id: 'OTHER', label: 'Other' }
    ]
  },
  {
    name: 'streetAddress',
    type: 'text',
    label: 'Street Address',
    placeholder: 'eg. 22, Baker Street',
    multiline: true,
    rows: 2
  },
  {
    name: 'landmark',
    type: 'text',
    label: 'Landmark',
    placeholder: 'eg. Near to Shopping Mall'
  },
  {
    name: 'postalCode',
    type: 'text',
    label: 'Postal Code',
    placeholder: 'eg. 1200'
  },
  {
    name: 'instructions',
    type: 'text',
    label: 'Additional Instructions',
    placeholder: 'Any other instructions',
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

const LocationFields = ({
  control,
  errors
}: {
  control: Control<AddressInput>
  errors: FieldErrors<AddressInput>
}) => {
  const division = useWatch({
    control,
    name: 'division'
  })
  const district = useWatch({
    control,
    name: 'district'
  })

  const districtOptions = division ? getDistrictOptions(division) : []
  const upazilaOptions = district ? getUpazilaOptions(district) : []

  return (
    <>
      <SelectElement
        name="division"
        control={control}
        label="Division"
        options={divisionOptions}
        helperText={errors.division?.message}
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
        name="district"
        control={control}
        label="District"
        options={districtOptions}
        disabled={!division}
        helperText={errors.district?.message}
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
        name="upazila"
        control={control}
        label="Upazila"
        options={upazilaOptions}
        disabled={!district}
        helperText={errors.upazila?.message}
        fullWidth={true}
        slotProps={{
          ...commonTextFieldProps.slotProps,
          select: {
            displayEmpty: true
          }
        }}
      />
    </>
  )
}

const AddressForm = ({
  initial,
  onSubmit
}: {
  initial?: UpdateProfileInput['address']
  onSubmit: (data: AddressInput) => void
}) => {
  const [isPending, startTransition] = useTransition()

  const initialAddress: AddressInput = {
    label: initial?.label || '',
    type: initial?.type || 'OTHER',
    division: initial?.division || '',
    district: initial?.district || '',
    upazila: initial?.upazila || '',
    streetAddress: initial?.streetAddress || '',
    postalCode: initial?.postalCode || '',
    landmark: initial?.landmark || '',
    instructions: initial?.instructions || ''
  }
  const [address, setAddress] = useState<AddressInput>(initialAddress)

  const handlePlaceSelect = async (place: GooglePlaceSuggestion) => {
    try {
      const { data } = await axios.get(
        `/api/places/details?placeId=${place.place_id}`
      )
      setAddress(data.data)
    } catch (error) {
      console.error('Error fetching place details:', error)
    }
  }

  return (
    <div className="max-w-xl">
      <div className="px-6 pt-6">
        <PlaceInput
          startTransition={startTransition}
          onPlaceSelect={handlePlaceSelect}
          variant="input-field"
          isPending={isPending}
        />
      </div>
      <Form initial={address} onSubmit={onSubmit} />
    </div>
  )
}

export default AddressForm

const Form = ({
  initial,
  onSubmit
}: {
  initial: AddressInput
  onSubmit: (data: AddressInput) => void
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<AddressInput>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      division: initial?.division || '',
      district: initial?.district || '',
      upazila: initial?.upazila || ''
    }
  })

  const onSubmitHandler = (data: AddressInput) => {
    onSubmit(data)
  }

  return (
    <form
      id="address-form"
      onSubmit={handleSubmit(onSubmitHandler)}
      className="w-full space-y-6 p-6 relative rounded-md"
    >
      {addressFields.slice(0, 2).map((field) => (
        <TextFieldElement
          key={field.name}
          {...field}
          control={control}
          helperText={errors[field.name]?.message}
          {...commonTextFieldProps}
        />
      ))}

      <LocationFields control={control} errors={errors} />

      {addressFields.slice(2).map((field) => (
        <TextFieldElement
          key={field.name}
          {...field}
          control={control}
          helperText={errors[field.name]?.message}
          {...commonTextFieldProps}
        />
      ))}
    </form>
  )
}
