import React, { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const CSV_TYPES = {
  STUDENTS: 'students',
  FACULTY: 'faculty',
  COURSES: 'courses',
  ROOMS: 'rooms'
}

const CSVUploader = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState({})
  const [dragOver, setDragOver] = useState({})
  const [uploadResults, setUploadResults] = useState({})

  const handleFileUpload = async (file, type) => {
    setUploading({ ...uploading, [type]: true })
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      
      const response = await api.post('/import/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(`Upload Progress: ${percentCompleted}%`)
        }
      })
      
      setUploadResults({
        ...uploadResults,
        [type]: {
          success: true,
          message: `${response.data.recordsProcessed} records uploaded successfully`,
          data: response.data
        }
      })
      
      toast.success(`${type} data uploaded successfully!`)
      onUploadSuccess?.(type, response.data)
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to upload ${type} data`
      setUploadResults({
        ...uploadResults,
        [type]: {
          success: false,
          message: errorMessage,
          errors: error.response?.data?.errors || []
        }
      })
      toast.error(errorMessage)
    } finally {
      setUploading({ ...uploading, [type]: false })
    }
  }

  const handleDrop = (e, type) => {
    e.preventDefault()
    setDragOver({ ...dragOver, [type]: false })
    
    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'))
    
    if (csvFile) {
      handleFileUpload(csvFile, type)
    } else {
      toast.error('Please upload a CSV file')
    }
  }

  const handleFileInput = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file, type)
    }
  }

  const clearResult = (type) => {
    const newResults = { ...uploadResults }
    delete newResults[type]
    setUploadResults(newResults)
  }

  const UploadCard = ({ type, title, description, sampleHeaders }) => (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        {uploadResults[type] && (
          <button
            onClick={() => clearResult(type)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {uploadResults[type] ? (
        <div className={`p-4 rounded-lg border-2 ${
          uploadResults[type].success 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-start">
            {uploadResults[type].success ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${
                uploadResults[type].success ? 'text-green-800' : 'text-red-800'
              }`}>
                {uploadResults[type].message}
              </p>
              {uploadResults[type].errors && uploadResults[type].errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-red-700 font-medium">Errors:</p>
                  <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                    {uploadResults[type].errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver[type] 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading[type] ? 'opacity-50' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver({ ...dragOver, [type]: true })
          }}
          onDragLeave={() => setDragOver({ ...dragOver, [type]: false })}
          onDrop={(e) => handleDrop(e, type)}
        >
          {uploading[type] ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop your CSV file here, or click to browse
              </p>
              <label className="btn-primary cursor-pointer inline-flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Choose CSV File
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => handleFileInput(e, type)}
                  disabled={uploading[type]}
                />
              </label>
              
              <div className="mt-4 text-xs text-gray-500">
                <p className="font-medium">Expected headers:</p>
                <p className="mt-1 font-mono bg-gray-100 rounded px-2 py-1">
                  {sampleHeaders}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UploadCard 
        type={CSV_TYPES.STUDENTS} 
        title="Upload Students" 
        description="Upload student data including enrollment information"
        sampleHeaders="name,email,student_id,department,semester"
      />
      <UploadCard 
        type={CSV_TYPES.FACULTY} 
        title="Upload Faculty" 
        description="Upload faculty member information and departments"
        sampleHeaders="name,email,faculty_id,department,specialization"
      />
      <UploadCard 
        type={CSV_TYPES.COURSES} 
        title="Upload Courses" 
        description="Upload course details and requirements"
        sampleHeaders="course_code,course_name,credits,department,semester"
      />
      <UploadCard 
        type={CSV_TYPES.ROOMS} 
        title="Upload Rooms" 
        description="Upload classroom and lab information"
        sampleHeaders="room_number,building,capacity,type,equipment"
      />
    </div>
  )
}

export default CSVUploader
