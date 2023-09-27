import React from 'react'
import { useDataContext } from '@/Contexts/DataContext'
import { useState } from 'react'
import { Combobox } from '@headlessui/react'
import { Loader } from '@axdspub/axiom-ui-utilities'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'

const options = [
  'Durward Reynolds',
  'Kenton Towne',
  'Therese Wunsch',
  'Benedict Kessler',
  'Katelyn Rohan',
]

interface IMapFilterProps {
  options: string[]
  onSelect: (options: string | null) => void
}
const MapFilter = ({ options, onSelect }: IMapFilterProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
        return option.toLowerCase().includes(query.toLowerCase())
      })

  const onChange = (value: string | null) => {
    setSelectedOption(value)
    onSelect(value)
  }

  return (
    <Combobox
      disabled={options.length === 0}
      value={selectedOption}
      onChange={onChange}
      nullable
    >
      <div className='z-20 bg-slate-100'>
        <div className='flex'>
          <Combobox.Input
            onChange={(event) => setQuery(event.target.value)}
            placeholder='All'
          />
          <Combobox.Button className="inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Combobox.Options className='absolute z-20 bg-slate-100'>
          {filteredOptions.map((option) => (
            <Combobox.Option key={option} value={option}>
              {option}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}

const MapFilters = () => {
  const {
    districts,
    islands,
    filterByDistricts,
    filterByIslands
  } = useDataContext()

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

  return (
    <div className='relative flex'>
      <div>
        <div>Island</div>
        <MapFilter
          options={islands}
          onSelect={onSelectIsland}
        />
      </div>
      <div>
        <div>District</div>
        <MapFilter
          options={districts}
          onSelect={onSelectDistrict}
        />
      </div>
    </div>
  )

}
 
export default MapFilters
