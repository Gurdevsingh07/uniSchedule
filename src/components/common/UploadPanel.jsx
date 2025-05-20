import { useTimetable } from '../../contexts/TimetableContext'
import { useState, useRef } from 'react'
import { FiUpload } from 'react-icons/fi'

const UploadPanel = () => {
  const { importData } = useTimetable()
  const [fileName, setFileName] = useState('No file chosen')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          importData(data)
        } catch (error) {
          console.error('Error parsing JSON:', error)
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/json') {
      handleFileUpload({ target: { files: [file] } })
    }
  }

  return (
    <div 
       className={`bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-xl border ${
        isDragging ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-900/10 shadow-md' : 'border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-lg'
      } transition-all duration-300 w-full`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-6 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px] mx-[0px]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <FiUpload className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Import Timetable
        </h3>

        <div className="space-y-4">
          <label
            className={`flex flex-col items-center gap-3 cursor-pointer p-6 rounded-lg border-2 border-dashed transition-all duration-300
              ${
                isDragging
                  ? 'border-primary-500 bg-primary-50/40 dark:bg-primary-900/10'
                  : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50/30 dark:hover:bg-primary-900/5'
              }
              group focus-within:ring-2 focus-within:ring-primary-400`}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') inputRef.current?.click() }}
          >
            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors font-medium">
              {fileName}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 text-white font-medium shadow transition-all text-sm"
              onClick={() => inputRef.current?.click()}
              tabIndex={-1}
            >
              <FiUpload className="w-4 h-4" />
              Choose File
            </button>
            <input
              ref={inputRef}
              type="file"
              id="json-file-upload"
              name="json-file-upload"
              className="hidden"
              accept=".json"
              onChange={handleFileUpload}
              aria-label="Upload JSON file"
            />
          </label>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
            or <span className="font-semibold text-primary-600 dark:text-primary-400">drag and drop</span> your JSON file here
          </p>
        </div>
      </div>
    </div>
  )
}

export default UploadPanel