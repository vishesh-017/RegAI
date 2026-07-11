"use client";

import { useState } from "react";
import { Building2, Users, Shield, Palette, Bell, UserCircle, Lock, Monitor, Moon, Sun, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { format } from "date-fns";

export default function SettingsClient({ user, organization, users }: { user: any, organization: any, users: any[] }) {
  const [activeTab, setActiveTab] = useState("Organization");
  const { theme, setTheme } = useTheme();

  const tabs = [
    { name: "Organization", icon: Building2 },
    { name: "User Management", icon: Users },
    { name: "Permissions", icon: Shield },
    { name: "Theme", icon: Palette },
    { name: "Notifications", icon: Bell },
    { name: "Profile", icon: UserCircle },
    { name: "Security", icon: Lock },
  ];

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your organization preferences, users, and security policies.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.name 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className={`mr-3 h-5 w-5 ${activeTab === tab.name ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-400'}`} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              
              {activeTab === "Organization" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Organization Settings</h2>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Organization Name</label>
                      <input type="text" readOnly value={organization?.name || ''} className="w-full md:max-w-md bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 text-slate-500 dark:text-slate-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Organization Type</label>
                      <input type="text" readOnly value={organization?.type || ''} className="w-full md:max-w-md bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 text-slate-500 dark:text-slate-400 focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "User Management" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">User Management</h2>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Invite User</button>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="px-6 py-3 font-medium">Email</th>
                          <th className="px-6 py-3 font-medium">Role</th>
                          <th className="px-6 py-3 font-medium">Joined</th>
                          <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {users.map(u => (
                          <tr key={u.id}>
                            <td className="px-6 py-4 text-slate-900 dark:text-slate-200">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "Theme" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Appearance</h2>
                  <p className="text-sm text-slate-500 mb-4">Select your preferred theme for the BrahmOS interface.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${theme === 'light' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                      <Sun className={`h-8 w-8 mb-3 ${theme === 'light' ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className={`font-medium ${theme === 'light' ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>Light Mode</span>
                      {theme === 'light' && <div className="mt-3 bg-indigo-600 text-white rounded-full p-1"><Check className="h-3 w-3" /></div>}
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${theme === 'dark' ? 'border-indigo-600 bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                      <Moon className={`h-8 w-8 mb-3 ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <span className={`font-medium ${theme === 'dark' ? 'text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>Dark Mode</span>
                      {theme === 'dark' && <div className="mt-3 bg-indigo-600 text-white rounded-full p-1"><Check className="h-3 w-3" /></div>}
                    </button>
                    <button 
                      onClick={() => setTheme('system')}
                      className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${theme === 'system' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                      <Monitor className={`h-8 w-8 mb-3 ${theme === 'system' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                      <span className={`font-medium ${theme === 'system' ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>System Default</span>
                      {theme === 'system' && <div className="mt-3 bg-indigo-600 text-white rounded-full p-1"><Check className="h-3 w-3" /></div>}
                    </button>
                  </div>
                </div>
              )}

              {['Permissions', 'Notifications', 'Profile', 'Security'].includes(activeTab) && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{activeTab}</h2>
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <p className="text-slate-500">This section is available in the Enterprise tier.</p>
                    <button className="mt-4 text-indigo-600 font-medium">Upgrade Plan</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
