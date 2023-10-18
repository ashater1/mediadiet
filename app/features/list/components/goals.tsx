import { Link } from "@remix-run/react";

export function Goals() {
  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center border-b border-gray-200 pb-2">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Goals</h3>
        <Link
          to="goals"
          className="ml-auto inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div>
          <h3 className="mb-1">Movies</h3>
          <div className="flex">
            <span>11</span>
            <span>/</span>
            <span>50</span>
          </div>
        </div>

        <div>
          <h3 className="mb-1">Books</h3>
          <div className="flex">
            <span>1</span>
            <span>/</span>
            <span>20</span>
          </div>
        </div>
      </div>
    </div>
  );
}
