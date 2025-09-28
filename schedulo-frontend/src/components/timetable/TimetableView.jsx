import React from 'react'
import { Clock, MapPin, User } from 'lucide-react'

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_SLOTS = [
  '09:00-10:00', '10:00-11:00', '11:30-12:30', 
  '12:30-13:30', '14:30-15:30', '15:30-16:30', '16:30-17:30'
]

const getTimeSlotColor = (subject) => {
  const colors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-orange-100 text-orange-800 border-orange-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200'
  ]
  
  const hash = subject.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  return colors[Math.abs(hash) % colors.length]
}

const TimetableView = ({ data = [], view = 'week' }) => {
  if (view === 'today') {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    const todaySlots = data.filter(slot => slot.day === today)
    
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
          <p className="text-sm text-gray-500">{today}</p>
        </div>
        {todaySlots.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No classes scheduled for today</p>
          </div>
        ) : (
          todaySlots.map((slot, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${getTimeSlotColor(slot.subject)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{slot.subject}</h4>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {slot.faculty}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {slot.room}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium">
                  <Clock className="h-4 w-4 mr-1" />
                  {slot.time}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
              Time
            </th>
            {DAYS_OF_WEEK.map(day => (
              <th key={day} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map(timeSlot => (
            <tr key={timeSlot}>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200 bg-gray-50">
                {timeSlot}
              </td>
              {DAYS_OF_WEEK.map(day => {
                const slot = data.find(s => s.time === timeSlot && s.day === day)
                return (
                  <td key={`${day}-${timeSlot}`} className="px-2 py-2 border border-gray-200">
                    {slot ? (
                      <div className={`p-3 rounded-lg text-xs border-2 ${getTimeSlotColor(slot.subject)}`}>
                        <div className="font-semibold">{slot.subject}</div>
                        <div className="flex items-center mt-1">
                          <User className="h-3 w-3 mr-1" />
                          <span className="truncate">{slot.faculty}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{slot.room}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-20 bg-gray-50 rounded border-2 border-dashed border-gray-200"></div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TimetableView
