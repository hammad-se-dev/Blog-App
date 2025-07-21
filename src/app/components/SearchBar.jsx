'use client';

import { useState } from 'react';

export default function SearchBar() {
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
    // In a real app, this could filter posts or make an API call
    console.log('Searching for:', e.target.value);
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search posts..."
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
}