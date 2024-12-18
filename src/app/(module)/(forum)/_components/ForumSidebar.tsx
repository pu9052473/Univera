import { Input } from "@/components/ui/input"
import { Submit } from "@/components/(commnon)/ButtonV1"
import { MultiSelect } from "@/components/ui/MultiSelect"
import {
  PlusCircle,
  MessageCircle,
  XCircle,
  TagIcon,
  LockIcon
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

interface ForumSidebarProps {
  forums: any[]
  userRole: string
  selectedForumId: number | null
  onForumSelect: (id: number) => void
  setTag: (value: string) => void
  setIsForumDialogOpen: (value: boolean) => void
  setIsTagDialogOpen: (value: boolean) => void
  isForumDialogOpen: boolean
  isTagDialogOpen: boolean
  addTag: () => void
  tag: string
  forumName: string
  setForumName: (value: string) => void
  forumTags: string[]
  selectedTags: string[]
  setSelectedTags: (value: string[]) => void
  createForum: () => void
  isPrivate: boolean
  setIsPrivate: (value: boolean) => void
}

export const ForumSidebar = ({
  forums,
  selectedForumId,
  onForumSelect,
  setTag,
  userRole,
  setIsForumDialogOpen,
  isTagDialogOpen,
  setIsTagDialogOpen,
  setForumName,
  setSelectedTags,
  forumName,
  tag,
  forumTags,
  isPrivate,
  setIsPrivate,
  createForum,
  selectedTags,
  isForumDialogOpen,
  addTag
}: ForumSidebarProps) => {
  const filteredForums = forums.filter(
    (forum) => !forum.isPrivate || (forum.isPrivate && userRole === "faculty") // in this the forums filtered if isPrivate is true and userRole is faculty, if not then filtered if isPrivate is false
  )

  return (
    <div
      className="flex flex-col min-h-full bg-[#112C71] text-white 
      rounded-2xl shadow-2xl border-2 border-[#56E1E9]/20 
      overflow-hidden"
    >
      {/* Header Section */}
      <div
        className="bg-[#5B58EB]/10 p-4 border-b border-[#56E1E9]/20 
        flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <MessageCircle className="text-[#BB63FF] w-7 h-7" />
          <h2 className="text-2xl font-bold text-[#56E1E9]">Forums</h2>
        </div>

        <Dialog open={isForumDialogOpen} onOpenChange={setIsForumDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="bg-[#BB63FF] text-white p-2 rounded-full 
              hover:bg-[#5B58EB] transition-colors shadow-md 
              flex items-center justify-center"
            >
              <PlusCircle className="w-6 h-6" />
            </button>
          </DialogTrigger>

          {/* Forum Creation Dialog */}
          <DialogContent
            className="bg-[#EDF9FD] text-[#0A2353] rounded-2xl 
            shadow-2xl border-2 border-[#56E1E9]/30 w-[400px]"
          >
            <DialogHeader>
              <DialogTitle
                className="text-[#112C71] text-xl font-bold 
                flex items-center gap-3"
              >
                <PlusCircle className="text-[#BB63FF] w-6 h-6" />
                Create New Forum
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                type="text"
                value={forumName}
                onChange={(e) => setForumName(e.target.value)}
                placeholder="Forum Name"
                className="border-2 border-[#56E1E9] rounded-lg p-3 
                focus:ring-2 focus:ring-[#BB63FF] transition-all"
              />

              <MultiSelect
                options={forumTags.map((tag) => ({ label: tag, value: tag }))}
                selected={selectedTags}
                onChange={setSelectedTags}
                placeholder="Select Tags"
                className="border-2 border-[#56E1E9] rounded-lg"
              />

              <label
                className="flex items-center gap-3 text-[#0A2353] 
                hover:bg-[#CFCEFF]/20 p-2 rounded-lg transition-colors 
                cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="form-checkbox text-[#BB63FF] rounded-md 
                  border-[#56E1E9] focus:ring-[#BB63FF]"
                />
                <LockIcon className="w-5 h-5 text-[#5B58EB]" />
                <span>Make Forum Private</span>
              </label>
            </div>

            <DialogFooter className="space-y-2">
              <button
                onClick={createForum}
                className="w-full py-3 bg-[#BB63FF] text-white 
                rounded-lg hover:bg-[#5B58EB] transition-colors 
                shadow-md flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Create Forum
              </button>
              <button
                onClick={() => setIsForumDialogOpen(false)}
                className="w-full py-3 bg-[#FAE27C] text-[#0A2353] 
                rounded-lg hover:bg-[#CFCEFF] transition-colors"
              >
                Cancel
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tag Management Section */}
      {userRole === "faculty" && (
        <div className="p-4 border-b border-[#56E1E9]/20">
          <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="w-full py-2.5 bg-[#5B58EB] text-white 
              rounded-lg hover:bg-[#BB63FF] transition-colors 
              flex items-center justify-center gap-2.5 shadow-md"
              >
                <TagIcon className="w-5 h-5" />
                Add New Tag
              </button>
            </DialogTrigger>

            {/* Tag Creation Dialog */}
            <DialogContent
              className="bg-[#EDF9FD] text-[#0A2353] rounded-2xl 
            shadow-2xl border-2 border-[#56E1E9]/30 w-[350px]"
            >
              <DialogHeader>
                <DialogTitle
                  className="text-[#112C71] text-xl font-bold 
                flex items-center gap-3"
                >
                  <TagIcon className="text-[#BB63FF] w-6 h-6" />
                  Create New Tag
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Enter Tag Name"
                  className="border-2 border-[#56E1E9] rounded-lg p-3 
                focus:ring-2 focus:ring-[#BB63FF] transition-all"
                />
              </div>

              <DialogFooter className="space-y-2">
                <Submit
                  label="Create Tag"
                  className="w-full py-3 bg-[#BB63FF] text-white 
                rounded-lg hover:bg-[#5B58EB] transition-colors 
                flex items-center justify-center gap-2.5 shadow-md"
                  onClick={addTag}
                  disabled={!tag.trim()}
                >
                  <TagIcon className="w-5 h-5" />
                  Create Tag
                </Submit>
                <button
                  onClick={() => setIsTagDialogOpen(false)}
                  className="w-full py-3 bg-[#FAE27C] text-[#0A2353] 
                rounded-lg hover:bg-[#CFCEFF] transition-colors"
                >
                  Cancel
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Forums List Section */}
      <div
        className="flex-grow overflow-y-auto scrollbar-thin 
        scrollbar-thumb-[#BB63FF] scrollbar-track-[#112C71] 
        divide-y divide-[#56E1E9]/10"
      >
        {filteredForums.length > 0 ? (
          filteredForums.map((forum) => (
            <div
              key={forum.id}
              onClick={() => onForumSelect(forum.id)}
              className={`p-4 cursor-pointer group relative 
              transition-colors duration-300 
              ${
                selectedForumId === forum.id
                  ? "bg-[#CECDF9] text-[#0A2353]"
                  : "hover:bg-[#5B58EB]/10 text-white"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <MessageCircle
                      className={`w-5 h-5 ${
                        selectedForumId === forum.id
                          ? "text-[#0A2353]"
                          : "text-[#56E1E9] group-hover:text-[#BB63FF]"
                      }`}
                    />
                    <p className="font-bold text-lg group-hover:text-[#BB63FF]">
                      {forum.name}
                    </p>
                    {forum.isPrivate && (
                      <LockIcon className="w-4 h-4 text-[#5B58EB] ml-1" />
                    )}
                  </div>
                  <p className="text-sm opacity-70 ml-7">
                    Dept: {forum.departmentId}
                  </p>
                </div>
              </div>

              {/* Tags Section */}
              {forum.forumTags && forum.forumTags.length > 0 && (
                <div className="mt-2 ml-7 flex flex-wrap gap-1.5">
                  {forum.forumTags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-[#5B58EB]/10 
                      text-[#5B58EB] rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div
            className="flex flex-col items-center justify-center 
            h-full text-center p-6 text-[#56E1E9]/70 space-y-3"
          >
            <XCircle className="w-16 h-16 text-[#BB63FF]/50" />
            <p className="text-sm">No forums available</p>
            <p className="text-xs opacity-50">
              Create a new forum to get started
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
