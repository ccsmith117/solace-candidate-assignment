import Image from "next/image";

export default function LoadingSpinner() {
  return (
    <div className="bg-white shadow-lg rounded-lg p-12 text-center animate-fadeIn">
      <div className="text-[#1d443a] mb-4 flex justify-center">
        <div className="animate-spin">
          <Image src="/spinner.svg" alt="Loading" width={64} height={64} />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-700">Loading advocates...</h3>
    </div>
  );
}

