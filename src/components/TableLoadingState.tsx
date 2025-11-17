import Image from "next/image";

export default function TableLoadingState() {
  return (
    <tr className="animate-fadeIn">
      <td colSpan={7} className="p-12 text-center">
        <div className="text-[#1d443a] mb-4 flex justify-center">
          <div className="animate-spin">
            <Image src="/spinner.svg" alt="Loading" width={64} height={64} />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-700">Loading advocates...</h3>
      </td>
    </tr>
  );
}

