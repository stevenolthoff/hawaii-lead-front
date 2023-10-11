import React from 'react'
import { useDataContext, ProgressStatus } from '@/Contexts/DataContext'
import { useState } from 'react'
import { Combobox } from '@headlessui/react'
import { ChevronUpDownIcon, XCircleIcon } from '@heroicons/react/20/solid'
import { Transition } from '@headlessui/react'
import { useWindowSize } from 'usehooks-ts'

interface IMapFilterProps {
  options: string[]
  onSelect: (options: string | null) => void
  placeholder: string
  className?: string
  disabled?: boolean
}
const MapFilter = ({ options, onSelect, placeholder, className, disabled }: IMapFilterProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const { width } = useWindowSize()
  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
        return option.toLowerCase().includes(query.toLowerCase())
      })

  const onChange = (value: string | null) => {
    setSelectedOption(value)
    onSelect(value)
    if (value === null) setQuery('')
  }

  const ClearButtonOrNull = () => {
    return selectedOption !== null ?
      <XCircleIcon
        className='h-5 w-5 absolute right-0 mr-2 text-slate-400 bg-white'
        onClick={() => onChange(null)}
      /> :
      null
  }
  const DESKTOP_BREAKPOINT_PX = 768
  const getOptionsMaxHeight = () => {
    if (width >= DESKTOP_BREAKPOINT_PX) {
      return filteredOptions.length <= 10 ? `${36 * filteredOptions.length + 18}px` : ''
    } else {
      return filteredOptions.length <= 10 ? `${60 * filteredOptions.length + 18}px` : ''
    }
  }
  return (
    <Combobox
      disabled={options.length === 0 || disabled}
      value={selectedOption}
      onChange={onChange}
      nullable
    >
      <div className={`max-w-full min-w-[150px] h-full z-20 bg-slate-100 ${className}`}>
        <div className='flex h-full'>
          <Combobox.Button className='flex items-center relative w-full'>
            <Combobox.Input
              className='px-4 py-2 rounded-sm text-xs w-full h-full'
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            /> 
            <ClearButtonOrNull />
          </Combobox.Button>
          <Combobox.Button className="inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-slate-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options
            className='fixed h-full w-full left-0 sm:left-auto sm:absolute z-20 mt-1 bg-slate-100 sm:h-80 sm:max-w-80 sm:w-60 overflow-y-scroll py-2 rounded-sm text-lg lg:text-sm no-scrollbar hover:cursor-pointer shadow-xl'
            style={{ maxHeight: getOptionsMaxHeight() }}
          >
            {filteredOptions.map((option) => (
              <Combobox.Option key={option} value={option} className='hover:bg-slate-200 px-4 py-4 lg:py-2 truncate ...'>
                {option}
              </Combobox.Option>
            ))}
            {
              filteredOptions.length === 0 ?
                <p className='px-4 py-2 text-xs text-slate-500'>No schools found</p> :
                <></>
            }
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}

const MapFilters = () => {
  const {
    schools,
    districts,
    islands,
    filterBySchool,
    filterByDistricts,
    filterByIslands,
    filterByStatus
  } = useDataContext()

  const onSelectSchool = (value: string | null) => {
    filterBySchool(value)
  }

  const onSelectDistrict = (value: string | null) => {
    if (value === null) {
      filterByDistricts([])
    } else {
      filterByDistricts([value])
    }
  }

  const onSelectIsland = (value: string | null) => {
    if (value === null) {
      filterByIslands([])
    } else {
      filterByIslands([value])
    }
  }

  const onSelectStatus = (value: string | null) => {
    if (value === null) {
      filterByStatus([])
    } else {
      filterByStatus([value as ProgressStatus])
    }
  }

  return (
    <div className='relative flex px-4 h-full items-center'>
      <MapFilter
        options={schools}
        onSelect={onSelectSchool}
        placeholder='Search for schools'
        className='lg:w-80'
      />
      <MapFilter
        options={islands}
        onSelect={onSelectIsland}
        placeholder='Island'
      />
      <MapFilter
        options={districts}
        onSelect={onSelectDistrict}
        placeholder='District'
      />
      <MapFilter
        options={['Not Started', 'In Progress', 'Completed']}
        onSelect={onSelectStatus}
        placeholder='Status'
        disabled={schools.length === 0}
      />
    </div>
  )

}
 
export default MapFilters
