import { Form } from "@remix-run/react";

export default function Integrations() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Integrations</h2>

      <div className="flex flex-col gap-4">
        <h2>Letterboxd</h2>
        <div className="flex flex-col">
          <label className="text-sm" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            className="disabled:bg-white disabled:text-slate-400 mt-1 px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-inset focus:ring-primary-800"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            className="disabled:bg-white disabled:text-slate-400 mt-1 px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-inset focus:ring-primary-800"
          />
        </div>
      </div>
    </div>
  );
}
