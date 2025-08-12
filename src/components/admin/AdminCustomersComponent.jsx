import React, { useMemo, useState } from "react";

function StatusBadge({ value }) {
  const map = {
    VIP: "bg-purple-100 text-purple-700",
    Regular: "bg-blue-100 text-blue-700",
    New: "bg-green-100 text-green-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[value] || "bg-gray-100 text-gray-700"}`}>
      {value}
    </span>
  );
}

const mockCustomers = [
  { id: 1, name: "Mike Davis",   email: "mike@example.com",   phone: "+1 (555) 456-7890", memberSince: "Jan 2024", visits: 22, lastVisit: "Aug 5",  status: "VIP" },
  { id: 2, name: "Lisa Anderson",email: "lisa@example.com",   phone: "+1 (555) 789-0123", memberSince: "Feb 2024", visits: 18, lastVisit: "Jul 31", status: "VIP" },
  { id: 3, name: "John Smith",   email: "john@example.com",   phone: "+1 (555) 123-4567", memberSince: "Mar 2024", visits: 15, lastVisit: "Aug 4",  status: "VIP" },
  { id: 4, name: "David Brown",  email: "david@example.com",  phone: "+1 (555) 654-3210", memberSince: "Apr 2024", visits: 12, lastVisit: "Aug 1",  status: "Regular" },
  { id: 5, name: "Jennifer White", email: "jennifer@example.com", phone: "+1 (555) 345-6789", memberSince: "May 2024", visits: 9, lastVisit: "Jul 29", status: "Regular" },
  { id: 6, name: "Sarah Johnson", email: "sarah@example.com", phone: "+1 (555) 987-6543", memberSince: "Jun 2024", visits: 8, lastVisit: "Aug 3",  status: "Regular" },
  { id: 7, name: "Emma Wilson",  email: "emma@example.com",   phone: "+1 (555) 321-0987", memberSince: "Aug 2024", visits: 5, lastVisit: "Aug 2",  status: "New" },
  { id: 8, name: "Robert Taylor",email: "robert@example.com", phone: "+1 (555) 234-5678", memberSince: "Nov 2024", visits: 3, lastVisit: "Jul 30", status: "New" },
];

function initialsOf(name) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
}

export default function AdminCustomersComponent() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Most Visits");

  const rows = useMemo(() => {
    let data = [...mockCustomers];
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q)
      );
    }
    if (status !== "All") data = data.filter((c) => c.status === status);
    if (sort === "Most Visits") data.sort((a, b) => b.visits - a.visits);
    if (sort === "Last Visit") {
      // Not exact date parsing here—just keep as-is for now or extend later
    }
    return data;
  }, [query, status, sort]);

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Customer Directory</h1>
          <p className="text-sm text-gray-500">View and manage your customers</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers..."
            className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 110-16 8 8 0 010 16z" />
          </svg>
        </div>

        <select
          className="border border-gray-300 text-sm rounded-lg px-3 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option>Most Visits</option>
          <option>Last Visit</option>
        </select>

        <select
          className="border border-gray-300 text-sm rounded-lg px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All</option>
          <option>VIP</option>
          <option>Regular</option>
          <option>New</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 text-xs font-medium text-gray-600 px-4 py-3">
          <div className="col-span-4">Customer</div>
          <div className="col-span-4">Contact</div>
          <div className="col-span-2">Visits</div>
          <div className="col-span-2">Last Visit</div>
        </div>

        <div className="divide-y divide-gray-100">
          {rows.map((c) => (
            <div key={c.id} className="grid grid-cols-12 items-center px-4 py-4 hover:bg-gray-50">
              {/* Customer */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 text-sm font-medium grid place-items-center">
                  {initialsOf(c.name)}
                </div>
                <div>
                  <div className="text-sm text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-500">Member since {c.memberSince}</div>
                </div>
              </div>

              {/* Contact */}
              <div className="col-span-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14v7m-7-3a9 9 0 1114 0" />
                  </svg>
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h2l3 6-2 1a11 11 0 005 5l1-2 6 3v2a2 2 0 01-2 2h-1C9.163 20 4 14.837 4 8V7a2 2 0 01-1-2z" />
                  </svg>
                  <span>{c.phone}</span>
                </div>
              </div>

              {/* Visits */}
              <div className="col-span-2">
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {c.visits}
                </div>
              </div>

              {/* Last Visit + Status + Actions */}
              <div className="col-span-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {c.lastVisit}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge value={c.status} />
                  <button className="p-1.5 rounded hover:bg-gray-100">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-gray-500">No customers found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
