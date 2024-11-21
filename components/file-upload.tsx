import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FileUploadProps {
  onFileUpload: (file: File) => void
  isLoading: boolean
}

export function FileUpload({ onFileUpload, isLoading }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-upload">Upload LinkedIn data file (XLSX or XLS)</Label>
        <Input id="file-upload" type="file" accept=".xlsx,.xls" onChange={handleFileChange} disabled={isLoading} />
      </div>
      <Button onClick={handleUpload} disabled={!file || isLoading}>
        {isLoading ? 'Processing...' : 'Upload and Analyze'}
      </Button>
      {file && <p className="text-sm text-gray-500">Selected file: {file.name}</p>}
    </div>
  )
}

