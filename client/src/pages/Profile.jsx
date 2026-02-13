import React, { useEffect, useState } from 'react';
import { fetchProfile, updateProfile } from '../services/api';
import { User, Mail, Phone, Briefcase, Save, Shield, Camera, Award, TrendingUp, Target, Clock, Settings, Bell, Lock, Globe, Moon, Sun, Users, FileText, GitMerge, Activity, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        title: ''
    });
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        desktopNotifications: false,
        darkMode: false,
        language: 'en',
        timezone: 'UTC'
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await fetchProfile();
            setUser(data);
            setFormData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                title: data.title || ''
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updated = await updateProfile(formData);
            setUser(updated);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handlePreferencesSubmit = (e) => {
        e.preventDefault();
        // TODO: Save preferences to backend
        toast.success('Preferences updated successfully');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading profile...</div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'activity', label: 'Activity', icon: TrendingUp },
        { id: 'organization', label: 'Organization', icon: Users },
        { id: 'preferences', label: 'Preferences', icon: Settings },
        { id: 'security', label: 'Security', icon: Lock },
    ];

    const stats = [
        { label: 'Leads Created', value: '47', icon: Target, color: 'blue' },
        { label: 'Opportunities Won', value: '12', icon: Award, color: 'green' },
        { label: 'Tasks Completed', value: '89', icon: Clock, color: 'purple' },
        { label: 'Avg Response Time', value: '2.3h', icon: TrendingUp, color: 'orange' },
    ];

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl p-8 text-white">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-white border-4 border-white/30">
                                <User size={40} />
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-brand-600 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={14} />
                            </button>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-1">{user?.name}</h1>
                            <p className="text-brand-100 text-lg">{user?.title}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                                    <Shield size={12} />
                                    {user?.role}
                                </div>
                                <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                                    <Mail size={12} />
                                    {user?.email}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/20">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className={`inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-2`}>
                                <stat.icon size={20} />
                            </div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-brand-100 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors",
                                activeTab === tab.id
                                    ? "text-brand-600 border-b-2 border-brand-600 bg-brand-50/50 dark:bg-brand-900/20"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            )}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Job Title
                                    </label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2 transition-colors"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Activity Tab */}
                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                {[
                                    { action: 'Created lead', target: 'John Doe - Acme Corp', time: '2 hours ago', color: 'blue' },
                                    { action: 'Updated opportunity', target: 'Enterprise Deal', time: '5 hours ago', color: 'green' },
                                    { action: 'Completed task', target: 'Follow up with client', time: '1 day ago', color: 'purple' },
                                    { action: 'Sent email', target: 'Quarterly Report', time: '2 days ago', color: 'orange' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <div className={`w-10 h-10 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                            <TrendingUp size={18} className={`text-${item.color}-600 dark:text-${item.color}-400`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {item.action} <span className="text-gray-600 dark:text-gray-400">• {item.target}</span>
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Organization Tab */}
                    {activeTab === 'organization' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Access</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <a
                                        href="/audit"
                                        className="flex items-center justify-between p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                                <FileText size={24} className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">Audit Trail</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">View activity logs</div>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </a>

                                    <a
                                        href="/org-chart"
                                        className="flex items-center justify-between p-5 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                                <GitMerge size={24} className="text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">Org Chart</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Team structure</div>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </a>

                                    <a
                                        href="/recycle-bin"
                                        className="flex items-center justify-between p-5 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                                                <Activity size={24} className="text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">Recycle Bin</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Deleted items</div>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Overview</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center">
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">5</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Team Members</div>
                                    </div>
                                    <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center">
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">3</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                                    </div>
                                    <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center">
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Admin</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Your Role</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-5">
                                <div className="flex items-start gap-3">
                                    <Shield size={20} className="text-brand-600 dark:text-brand-400 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-brand-900 dark:text-brand-100 mb-1">Organization Settings</h4>
                                        <p className="text-sm text-brand-700 dark:text-brand-300 mb-3">
                                            Manage your organization's settings, permissions, and configurations.
                                        </p>
                                        <button
                                            onClick={() => window.location.href = '/audit'}
                                            className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
                                        >
                                            Manage Settings →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Receive email updates about your activity</div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={preferences.emailNotifications}
                                            onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                            className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">Desktop Notifications</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Show desktop notifications for important updates</div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={preferences.desktopNotifications}
                                            onChange={(e) => setPreferences({ ...preferences, desktopNotifications: e.target.checked })}
                                            className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <select
                                                value={preferences.language}
                                                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            >
                                                <option value="en">English</option>
                                                <option value="es">Spanish</option>
                                                <option value="fr">French</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <select
                                                value={preferences.timezone}
                                                onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            >
                                                <option value="UTC">UTC</option>
                                                <option value="EST">Eastern Time</option>
                                                <option value="PST">Pacific Time</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2 transition-colors"
                                >
                                    <Save size={18} />
                                    Save Preferences
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => toast.info('Password change functionality coming soon')}
                                    className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2 transition-colors"
                                >
                                    <Lock size={18} />
                                    Update Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
