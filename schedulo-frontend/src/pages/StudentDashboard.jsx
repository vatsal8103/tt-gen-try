import React, { useState, useEffect } from 'react'
import Header from '../components/common/Header'
import TimetableView from '../components/timetable/TimetableView'
import { Download, Calendar, Bell, BookOpen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [timetable, setTimetable] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('week')
  const [stats, setStats] = useState({
    totalClasses: 0,
    todayClasses: 0,
    attendance: 85
  })

  useEffect(() => {
    fetchData()
  }, [view])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch timetable
      const timetableResponse = await api.get(`/timetable/student/${user.id}?type=${view}`)
      setTimetable(timetableResponse.data || [])
      
      // Fetch notifications
      const notificationsResponse = await api.get('/notifications')
      setNotifications(notificationsResponse.data || [])
      
      // Calculate stats
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
      const todayClasses = timetableResponse.data?.filter(slot => slot.day === today).length || 0
      
      setStats({
        totalClasses: timetableResponse.data?.length || 0,
        todayClasses,
        attendance: 85 // This would come from your backend
      })
      
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format) => {
    try {
      const response = await api.get(`/timetable/export/${user.id}?format=${format}`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = format === 'ical' ? 'timetable.ics' : 'timetable.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success(`Timetable exported as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error('Export failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Student Dashboard" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Student Dashboard" />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Classes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayClasses}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.attendance}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Timetable */}
          <div className="lg:col-span-3">
            <div className="card">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-xl font-semibold">My Timetable</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setView(view === 'today' ? 'week' : 'today')}
                    className="btn-secondary"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {view === 'today' ? 'Week View' : 'Today'}
                  </button>
                  <button
                    onClick={() => handleExport('ical')}
                    className="btn-secondary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    iCal
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="btn-secondary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </button>
                </div>
              </div>
              
              <TimetableView data={timetable} view={view} />
            </div>
          </div>
          
          {/* Notifications Panel */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Recent Notifications</h3>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No notifications</p>
                ) : (
                  notifications.slice(0, 5).map((notification, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
