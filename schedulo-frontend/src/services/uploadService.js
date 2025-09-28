import api from './api'

export const uploadService = {
  uploadCSV: (file, type) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    return api.post('/upload/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(`Upload Progress: ${percentCompleted}%`)
      }
    })
  },

  getUploadHistory: () => {
    return api.get('/upload/history')
  },

  validateCSV: (file, type) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    return api.post('/upload/validate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
