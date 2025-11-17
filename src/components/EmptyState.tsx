export default function EmptyState() {
  return (
    <tr className="animate-fadeIn">
      <td colSpan={7} className="p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No advocates found</h3>
        <p className="text-gray-500">We couldn't find any advocates matching your search criteria.</p>
      </td>
    </tr>
  );
}

