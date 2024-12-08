type DepartmentDetailProps = {
  department: {
    id: number
    name: string
    code: string
    principalId: string | null
    adminId: string | null
  } | null
}

function DepartmentDetail({ department }: DepartmentDetailProps) {
  console.log("department: ", department)

  if (!department) {
    return <div>Loading...</div>
  }
  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-2">Department Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <strong>ID:</strong> {department.id}
        </div>
        <div>
          <strong>Name:</strong> {department.name}
        </div>
        <div>
          <strong>Code:</strong> {department.code}
        </div>
        {department.principalId && (
          <div>
            <strong>Principal ID:</strong> {department.principalId}
          </div>
        )}
        {department.adminId && (
          <div>
            <strong>Admin ID:</strong> {department.adminId}
          </div>
        )}
      </div>
    </div>
  )
}

export default DepartmentDetail
