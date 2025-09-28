import React, { useState, useEffect } from 'react'
import Header from '../components/common/Header'
import TimetableView from '../components/timetable/TimetableView'
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const FacultyDashboard = () => {
  const { user } = useAuth()
  const [timetable, setTimetable] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUnavailabilityModal, setShowUnavailabilityModal] = useState(false)
  const [unavailabilityForm, setUnavailabilityForm] = useState({
    date: '',
    timeSlot: '',
    reason: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [timetableRes, attendanceRes] = await Promise.all([
        api.get(`/timetable/faculty/${user.id}`),
        api.get(`/attendance/faculty/${user.id}`)
      ])
      
      setTimetable(timetableRes.data || [])
      setAttendance(attendanceRes.data || [])
      
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkUnavailable = async (e) => {
    e.preventDefault()
    try {
      await api.post('/faculty/unavailable', {
        facultyId: user.id,
        ...unavailabilityForm
      })
      
      toast.success('Unavailability marked successfully')
      setShowUnavailabilityModal(false)
      setUnavailabilityForm({ date: '', timeSlot: '', reason: '' })
      fetchData()
    } catch (error) {
      toast.error('Failed to mark unavailability')
    }
  }

  const handleAttendanceToggle = async (classId, studentId, status) => {
    try {
      await api.post('/attendance/mark', {
        classId,
        studentId,
        status,
        facultyId: user.id
      })
      
      toast.success('Attendance updated')
      fetchData()
    } catch (error) {
      toast.error('Failed to update attendance')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Faculty Dashboard" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Faculty Dashboard" />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {timetable.filter(slot => {
                    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
                    return slot.day === today
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="card">
            <button
              onClick={() => setShowUnavailabilityModal(true)}
              className="w-full flex items-center justify-center space-x-2 btn-primary"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Mark Unavailable</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teaching Schedule */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">My Teaching Schedule</h2>
              <TimetableView data={timetable} view="week" />
            </div>
          </div>
          
          {/* Attendance Panel */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Today's Attendance</h3>
              <div className="space-y-4">
                {attendance.length === 0 ? (
                  <p className="text-gray-500 text-sm">No classes today</p>
                ) : (
                  attendance.map((classItem, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">{classItem.subject}</h4>
                        <span className="text-sm text-gray-500">{classItem.time}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {classItem.students?.map((student) => (
                          <div key={student.id} className="flex items-center justify-between">
                            <span className="text-sm">{student.name}</span>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleAttendanceToggle(classItem.id, student.id, 'present')}
                                className={`p-1 rounded ${student.attendance === 'present' 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleAttendanceToggle(classItem.id, student.id, 'absent')}
                                className={`p-1 rounded ${student.attendance === 'absent' 
                                  ? 'bg-red-100 text-red-600' 
                                  : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Unavailability Modal */}
      {showUnavailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Mark Unavailability</h3>
            <form onSubmit={handleMarkUnavailable} className="space-y-4">
              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={unavailabilityForm.date}
                  onChange={(e) => setUnavailabilityForm({
                    ...unavailabilityForm, 
                    date: e.target.value
                  })}
                />
              </div>
              
              <div>
                <label className="form-label">Time Slot</label>
                <select
                  required
                  className="form-input"
                  value={unavailabilityForm.timeSlot}
                  onChange={(e) => setUnavailabilityForm({
                    ...unavailabilityForm, 
                    timeSlot: e.target.value
                  })}
                >
                  <option value="">Select time slot</option>
                  <option value="09:00-10:00">09:00-10:00</option>
                  <option value="10:00-11:00">10:00-11:00</option>
                  <option value="11:30-12:30">11:30-12:30</option>
                  <option value="12:30-13:30">12:30-13:30</option>
                  <option value="14:30-15:30">14:30-15:30</option>
                  <option value="15:30-16:30">15:30-16:30</option>
                  <option value="16:30-17:30">16:30-17:30</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Reason</label>
                <textarea
                  required
                  className="form-input"
                  rows="3"
                  placeholder="Reason for unavailability"
                  value={unavailabilityForm.reason}
                  onChange={(e) => setUnavailabilityForm({
                    ...unavailabilityForm, 
                    reason: e.target.value
                  })}
                />
              </div>
              
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary flex-1">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowUnavailabilityModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FacultyDashboard
