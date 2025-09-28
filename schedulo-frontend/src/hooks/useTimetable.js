import { useState, useEffect } from 'react'
import { timetableService } from '../services/timetableService'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export const useTimetable = (view = 'week') => {
  const { user } = useAuth()
  const [timetable, setTimetable] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTimetable = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError(null)
      
      let response
      switch (user.role) {
        case 'student':
          response = await timetableService.getStudentTimetable(user.id, view)
          break
        case 'faculty':
          response = await timetableService.getFacultyTimetable(user.id, view)
          break
        case 'admin':
          response = await timetableService.getAllSlots()
          break
        default:
          throw new Error('Invalid user role')
      }
      
      setTimetable(response.data || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to fetch timetable')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTimetable()
  }, [user, view])

  const exportTimetable = async (format) => {
    const result = await timetableService.exportTimetable(user.id, format)
    if (result.success) {
      toast.success(`Timetable exported as ${format.toUpperCase()}`)
    } else {
      toast.error('Export failed')
    }
    return result
  }

  return {
    timetable,
    loading,
    error,
    refetch: fetchTimetable,
    exportTimetable
  }
}
