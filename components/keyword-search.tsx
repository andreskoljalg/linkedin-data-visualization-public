import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface KeywordSearchProps {
  onSearch: (keyword: string) => void
}

export function KeywordSearch({ onSearch }: KeywordSearchProps) {
  const [keyword, setKeyword] = useState('')

  const handleSearch = () => {
    onSearch(keyword)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="keyword-search">Enter keyword to search in post titles</Label>
        <Input
          id="keyword-search"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword"
        />
      </div>
      <Button onClick={handleSearch}>Search</Button>
    </div>
  )
}

