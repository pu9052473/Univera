import React, { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Save, ZoomIn, ZoomOut, Upload } from "lucide-react"

interface TimetableHeaderProps {
  isCoordinator: boolean
  handleZoom: (delta: number) => void
  saveTimetableSlotsToDb: () => Promise<void>
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const TimetableHeader: React.FC<TimetableHeaderProps> = ({
  isCoordinator,
  handleZoom,
  saveTimetableSlotsToDb,
  handleFileChange
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const triggerFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 px-2">
      {/* Title with decorative element */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-1 bg-blue-500 rounded-full hidden sm:block"></div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Calendar className="mr-2 text-blue-500 hidden sm:block" size={24} />
          Class Timetable
        </h2>
      </div>

      {/* Controls container - wraps on small screens */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        {/* Hidden file input */}
        <input
          type="file"
          ref={inputRef}
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload Excel file"
        />

        {/* Upload button */}
        {isCoordinator && (
          <Button
            onClick={triggerFileInput}
            className="bg-green-500 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Upload size={18} />
            <span>Upload Timetable</span>
          </Button>
        )}

        {/* Save button */}
        {isCoordinator && (
          <Button
            onClick={saveTimetableSlotsToDb}
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Save size={18} />
            <span>Save Timetable</span>
          </Button>
        )}

        {/* Zoom controls */}
        <div className="flex gap-2 mt-3 sm:mt-0 w-full sm:w-auto justify-center">
          <Button
            onClick={() => handleZoom(-0.1)}
            className="p-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg shadow-sm flex-1 sm:flex-none"
            aria-label="Zoom Out"
          >
            <ZoomOut size={18} />
          </Button>
          <Button
            onClick={() => handleZoom(0.1)}
            className="p-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg shadow-sm flex-1 sm:flex-none"
            aria-label="Zoom In"
          >
            <ZoomIn size={18} />
          </Button>
        </div>

        {/* Legend for timetable colors - visible on larger screens */}
        <div className="hidden lg:flex items-center gap-3 ml-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
            <span className="text-xs text-gray-600">Lecture</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300"></div>
            <span className="text-xs text-gray-600">Lab</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300"></div>
            <span className="text-xs text-gray-600">Seminar</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#CBF5CB] border border-[#7BE37B]"></div>
            <span className="text-xs text-gray-600">Break</span>
          </div>
        </div>

        {/* Legend for timetable colors - visible on smaller screens */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mb-4 sm:hidden">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
            <span className="text-xs text-gray-600">Lecture</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300"></div>
            <span className="text-xs text-gray-600">Lab</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300"></div>
            <span className="text-xs text-gray-600">Seminar</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#CBF5CB] border border-[#7BE37B]"></div>
            <span className="text-xs text-gray-600">Break</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimetableHeader
