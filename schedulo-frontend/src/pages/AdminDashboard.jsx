import React, { useState } from 'react'
import { BarChart3, Users, BookOpen, Calendar, Upload, Settings, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../services/api'

const AdminDashboard = () => {
  // const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState('all');
  const [analytics] = useState({
    students: 600,
    faculty: 45,
    courses: 120,
    rooms: 35
  })

  const handleGenerateTimetable = async () => {
    setGenerating(true)
    try {
      const response = await api.post("/timetable/generate", { 
        semester: "Fall", 
        year: 2025, 
        name: "Main Schedule" 
      })
      console.log("🎯 Generated timetable data:", response.data)
      setGeneratedTimetable(response.data)
      toast.success("Timetable generated successfully!")
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate timetable")
    } finally {
      setGenerating(false)
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'timetable', name: 'Master Timetable', icon: Calendar },
    { id: 'upload', name: 'Data Upload', icon: Upload },
    { id: 'conflicts', name: 'Conflicts', icon: AlertCircle }
  ]

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage schedules, conflicts, and system data</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2 inline" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Students</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.students}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Faculty</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.faculty}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Courses</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.courses}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rooms</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.rooms}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <button
                onClick={handleGenerateTimetable}
                disabled={generating}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Settings className="h-4 w-4 mr-2 inline" />
                {generating ? 'Generating...' : 'Generate Weekly Timetable'}
              </button>
            </div>

            {/* Generated Timetable Preview */}
            {generatedTimetable && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Generated Timetable Preview</h3>
                <div className="text-sm text-gray-600 mb-4">
                  Generated: {new Date(generatedTimetable.generatedAt).toLocaleString()}
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                  <span>📚 Classrooms: {generatedTimetable.stats?.totalClassrooms || 15}</span>
                  <span>📅 Total Slots: {generatedTimetable.stats?.totalSlots || 630}</span>
                  <span>🕐 Days: 6</span>
                  <span>👥 Students: {generatedTimetable.stats?.totalStudents}</span>
                </div>
                <p className="text-sm text-blue-600">View complete timetable in Master Timetable tab</p>
              </div>
            )}
          </div>
        )}
{/* Master Timetable Tab */}
{activeTab === 'timetable' && (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-medium mb-6">Master Timetable - Weekly Grid</h3>
    
    {!generatedTimetable ? (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No master timetable available</p>
        <button
          onClick={handleGenerateTimetable}
          disabled={generating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate Master Timetable'}
        </button>
      </div>
    ) : (
      <div>
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-3">Complete Weekly Schedule</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <span className="flex items-center">
              <span className="text-blue-600 mr-2">📚</span>
              <strong>Classrooms:</strong> {generatedTimetable.stats?.totalClassrooms || 15}
            </span>
            <span className="flex items-center">
              <span className="text-green-600 mr-2">📅</span>
              <strong>Total Slots:</strong> {generatedTimetable.stats?.totalSlots || 630}
            </span>
            <span className="flex items-center">
              <span className="text-purple-600 mr-2">🕐</span>
              <strong>Days:</strong> 6 (Mon-Sat)
            </span>
            <span className="flex items-center">
              <span className="text-orange-600 mr-2">👥</span>
              <strong>Students:</strong> {generatedTimetable.stats?.totalStudents}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <span className="text-blue-600">🏫</span> View Classroom:
          </label>
          <select 
            className="border-2 border-gray-300 rounded-lg px-4 py-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-w-48"
            onChange={(e) => setSelectedClassroom(e.target.value)}
            value={selectedClassroom}
          >
            <option value="all">📋 All Classrooms (Overview)</option>
            {Array.from(new Set(generatedTimetable.schedule?.map(slot => slot.room) || [])).map(room => (
              <option key={room} value={room}>🏫 {room}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                <th className="border border-gray-300 px-4 py-4 font-bold text-gray-800 text-center bg-gray-50">
                  🕐 Time
                </th>
                <th className="border border-gray-300 px-4 py-4 font-bold text-gray-800 text-center">
                  📅 Monday
                </th>
                <th className="border border-gray-300 px-4 py-4 font-bold text-gray-800 text-center">
                  📅 Tuesday
                </th>
                <th className="border border-gray-300 px-4 py-4 font-bold text-gray-800 text-center">
                  📅 Wednesday
                </th>
                <th className="border border-gray-300 px-4 py-4 font-bold text-gray-800 text-center">
                  📅 Thursday
                </th>
                <th className="border border-gray-300 px-4 py-4 font-bold text-gray-800 text-center">
                  📅 Friday
                </th>
                <th className="border border-gray-300 px-4 py-4 font-bold text-gray-800 text-center">
                  📅 Saturday
                </th>
              </tr>
            </thead>
            <tbody>
              {["09:00-09:50", "10:00-10:50", "11:00-11:50", "12:00-12:50", "14:00-14:50", "15:00-15:50", "16:00-16:50"].map((timeSlot) => (
                <tr key={timeSlot} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-6 font-bold bg-gray-50 text-center text-gray-700 min-w-32">
                    <div className="text-sm">{timeSlot}</div>
                  </td>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
                    const daySlots = generatedTimetable.schedule?.filter(slot => 
                      slot.day === day && 
                      slot.timeSlot === timeSlot &&
                      (selectedClassroom === 'all' || slot.room === selectedClassroom)
                    ) || [];
                    
                    return (
                      <td key={day} className="border border-gray-300 px-3 py-4 align-top" style={{minHeight: '120px', width: '200px'}}>
                        {daySlots.length > 0 ? (
                          <div className="space-y-2">
                            {/* Show more classes in "All Classrooms" view */}
                            {daySlots.slice(0, selectedClassroom === 'all' ? 3 : 1).map((slot, index) => (
                              <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-400 rounded-r-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                                <div className="font-bold text-blue-900 mb-1 text-xs leading-tight">
                                  📚 {slot.course}
                                </div>
                                <div className="space-y-1 text-xs text-gray-700">
                                  <div className="flex items-center">
                                    <span className="text-green-600 mr-1">👨‍🏫</span>
                                    <span className="font-medium text-xs">{slot.faculty}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-purple-600 mr-1">🏫</span>
                                    <span className="font-medium text-xs">{slot.room}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-orange-600 mr-1">👥</span>
                                    <span className="font-medium text-xs">{slot.students}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {/* Show remaining classes count or modal trigger */}
                            {daySlots.length > (selectedClassroom === 'all' ? 3 : 1) && (
                              <div className="text-center mt-2">
                                <button 
                                  className="text-xs text-blue-600 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-full border border-blue-300 transition-colors cursor-pointer"
                                  onClick={() => {
                                    // Create a simple alert showing all classes
                                    const allClasses = daySlots.map(slot => 
                                      `📚 ${slot.course}\n👨‍🏫 ${slot.faculty}\n🏫 ${slot.room}\n👥 ${slot.students} students`
                                    ).join('\n\n');
                                    alert(`All classes for ${day} ${timeSlot}:\n\n${allClasses}`);
                                  }}
                                >
                                  👁️ View all {daySlots.length} classes
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 py-8">
                            <div className="text-2xl mb-2">🆓</div>
                            <div className="text-sm font-medium">Free Period</div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <div className="text-center text-sm text-gray-600">
            {selectedClassroom === 'all' 
              ? `📋 Showing 3 classes per time slot. Click "View all X classes" to see complete details. Total: ${generatedTimetable.schedule?.length || 0} slots across ${generatedTimetable.stats?.totalClassrooms || 15} classrooms.`
              : `🏫 Showing complete schedule for ${selectedClassroom} (${generatedTimetable.schedule?.filter(slot => slot.room === selectedClassroom).length || 0} time slots)`
            }
          </div>
        </div>
      </div>
    )}
  </div>
)}



        {/* Other Tabs - Simple Placeholders */}
        {activeTab === 'upload' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-6">Data Upload</h3>
            <p className="text-gray-500">CSV upload functionality coming soon</p>
          </div>
        )}

        {activeTab === 'conflicts' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-6">Scheduling Conflicts</h3>
            <p className="text-gray-500">No conflicts detected</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default AdminDashboard
