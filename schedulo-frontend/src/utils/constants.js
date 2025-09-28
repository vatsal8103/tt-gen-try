export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin'
}

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success'
}

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

export const TIME_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:30-12:30',
  '12:30-13:30',
  '14:30-15:30',
  '15:30-16:30',
  '16:30-17:30'
]

export const EXPORT_FORMATS = {
  ICAL: 'ical',
  PDF: 'pdf'
}

export const CSV_TYPES = {
  STUDENTS: 'students',
  FACULTY: 'faculty',
  COURSES: 'courses',
  ROOMS: 'rooms'
}

export const ROOM_TYPES = {
  CLASSROOM: 'classroom',
  LAB: 'lab',
  AUDITORIUM: 'auditorium',
  SEMINAR: 'seminar'
}

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late'
}
