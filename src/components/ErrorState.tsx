interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="shadow-lg rounded-lg overflow-hidden animate-fadeIn bg-white">
      <div className="p-12 text-center">
        <div className="text-red-400 mb-4 flex justify-center">
          <img src="/error-icon.svg" alt="Error" className="h-16 w-16" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Oops, something went wrong!</h3>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
}

