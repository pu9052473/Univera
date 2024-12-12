interface ForumSidebarProps {
  filteredForums: any[]
  selectedForumId: number | null
  onForumSelect: (id: number) => void
  onCreateForum: () => void
  canCreateForum: boolean
}

export const ForumSidebar = ({
  filteredForums,
  selectedForumId,
  onForumSelect,
  onCreateForum,
  canCreateForum
}: ForumSidebarProps) => {
  return (
    <div className="h-full bg-[#112C71] text-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Forums</h2>
        {canCreateForum && (
          <button
            onClick={onCreateForum}
            className="bg-[#56E1E9] text-[#0A2353] px-3 py-1 rounded-md hover:bg-opacity-80 transition-colors"
          >
            Create Forum
          </button>
        )}
      </div>
      <div className="h-[calc(100vh-200px)] overflow-y-auto">
        {filteredForums.length > 0 ? (
          filteredForums.map((forum) => (
            <div
              key={forum.id}
              onClick={() => onForumSelect(forum.id)}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedForumId === forum.id
                  ? "bg-[#CECDF9] text-[#0A2353]"
                  : "hover:bg-[#CECDF9]/20"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{forum.name}</p>
                  <p className="text-sm opacity-70">
                    Dept: {forum.departmentId} | Year: {forum.year}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={
                    selectedForumId === forum.id
                      ? "text-[#0A2353]"
                      : "text-[#56E1E9]"
                  }
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-center opacity-70">No forums available</p>
        )}
      </div>
    </div>
  )
}
