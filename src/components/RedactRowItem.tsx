import { useState, useEffect, useRef } from 'react';

export interface RedactRow {
  id: number;
  searchString: string;
  replaceString: string;
}

interface RedactRowItemProps {
  row: RedactRow;
  text: string;
  onSearchStringChange: (id: number, searchString: string) => void;
  onReplaceStringChange: (id: number, replaceString: string) => void;
  debounceTimeout?: number;
}

const isSearchStringFound = (search: string, text: string): boolean => {
  const searchStringLowerCase = search.toLowerCase();
  const textLowerCase = text.toLowerCase();
  return textLowerCase.includes(searchStringLowerCase);
};

const RedactRowItem: React.FC<RedactRowItemProps> = ({
  row,
  text,
  onSearchStringChange,
  onReplaceStringChange,
  debounceTimeout = 500,
}) => {
  const [searchString, setSearchString] = useState(row.searchString);
  const [replaceString, setReplaceString] = useState(row.replaceString);
  const [debouncedSearchString, setDebouncedSearchString] = useState(searchString);

  const searchInputStyle = isSearchStringFound(debouncedSearchString, text) ? '' : 'border-red-500';

  const debounceRef = useRef<number>();

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      setDebouncedSearchString(searchString);
    }, debounceTimeout);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchString, debounceTimeout]);

  useEffect(() => {
    onSearchStringChange(row.id, debouncedSearchString);
  }, [row.id, debouncedSearchString, onSearchStringChange]);

  return (
    <div className="flex space-x-4 mb-2">
      <input
        type="text"
        className={`flex-1 ${searchInputStyle}`}
        placeholder="Search string"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />
      <input
        type="text"
        className="flex-1"
        placeholder="Replace with"
        value={replaceString}
        onChange={(e) => {
          setReplaceString(e.target.value);
          onReplaceStringChange(row.id, e.target.value);
        }}
      />
    </div>
  );
};

export default RedactRowItem;
