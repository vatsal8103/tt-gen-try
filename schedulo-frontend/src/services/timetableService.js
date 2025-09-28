import api from './api'

export const timetableService = {
  // Get timetable data
  getTimetable: (userId, type = 'week') => {
    return api.get(`/timetable/${userId}?type=${type}`)
  },

  getStudentTimetable: (studentId, type = 'week') => {
    return api.get(`/timetable/student/${studentId}?type=${type}`)
  },

  getFacultyTimetable: (facultyId, type = 'week') => {
    return api.get(`/timetable/faculty/${facultyId}?type=${type}`)
  },

  getAllSlots: () => {
    return api.get('/timetable/slots')
  },

  // Generate timetable (admin only)
  generateTimetable: () => {
    return api.post('/timetable/generate', { semester: "Fall", year: 2025, name: "Generated Schedule" })
  },

  // Export functions
  exportTimetable: async (userId, format = 'ical') => {
    try {
      const response = await api.get(`/timetable/export/${userId}?format=${format}`, {
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
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Mark faculty unavailability
  markUnavailable: (facultyId, timeSlot, date, reason) => {
    return api.post('/faculty/unavailable', {
      facultyId,
      timeSlot,
      date,
      reason
    })
  },

  // Get conflicts
  getConflicts: () => {
    return api.get('/timetable/conflicts')
  },

  // Resolve conflict
  resolveConflict: (conflictId, resolution) => {
    return api.post(`/timetable/conflicts/${conflictId}/resolve`, resolution)
  }
}
