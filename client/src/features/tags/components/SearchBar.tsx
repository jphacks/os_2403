import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="w-full max-w-md relative">
        <Input
          type="text"
          placeholder="タグ名で検索..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pr-10"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          <Search size={20} />
        </div>
      </div>
    </div>
  );
}
