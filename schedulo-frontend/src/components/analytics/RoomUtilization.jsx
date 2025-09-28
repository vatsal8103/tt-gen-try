import React, { useState, useEffect } from 'react'
import { Building, TrendingUp, Clock } from 'lucide-react'
import api from '../../services/api'

const RoomUtilization = () => {
  const [roomData, setRoomData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRoomUtilization()
  }, [])

  const fetchRoomUtilization = async () => {
    try {
      const response = await api.get('/analytics/room-utilization')
      setRoomData(response.data || [])
    } catch (error) {
      console.error('Failed to fetch room utilization:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Building className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Room Utilization</h3>
      </div>

      <div className="space-y-4">
        {roomData.map((room, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-900">{room.name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {room.hoursUsed}h / {room.totalHours}h
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${room.utilizationPercent}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {room.utilizationPercent}%
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {room.trend > 0 ? '+' : ''}{room.trend}% vs last week
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoomUtilization
