import { useState } from 'react'
import { FiPlus, FiX } from 'react-icons/fi'
import { useTimetable } from '../contexts/TimetableContext'

const AddEntryButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { addEntry } = useTimetable()
  const [formData, setFormData] = useState({
    teacher: '',
    subject: '',
    day: 'Monday',
    time: '8:00 - 9:00'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    addEntry({
      id: Date.now(),
      ...formData
    })
    setIsOpen(false)
    setFormData({
      teacher: '',
      subject: '',
      day: 'Monday',
      time: '8:00 - 9:00'
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-primary-500 to-accent-500 text-white p-4 rounded-full shadow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-110 hover:from-primary-600 hover:to-accent-600 z-50"
      >
        <FiPlus size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-float w-full max-w-md transform transition-all duration-300 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Add New Entry
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teacher</label>
                  <input
                    type="text"
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-all duration-300"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Day</label>
                    <select
                      value={formData.day}
                      onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                      className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-all duration-300"
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-all duration-300"
                    >
                      {Array.from({ length: 8 }, (_, i) => `${i + 8}:00 - ${i + 9}:00`).map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all duration-300 transform hover:scale-105"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default AddEntryButton 