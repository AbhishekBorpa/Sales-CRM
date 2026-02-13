import React, { useEffect, useState } from 'react';
import { fetchDashboardStats, fetchSalesPipeline, fetchLeadSources, fetchAuditLogs } from '../services/api';
import { DollarSign, Users, Briefcase, TrendingUp, Activity, ArrowRight, Target, Clock, LifeBuoy, Plus, Phone, Mail, FileText, CheckSquare, Package, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import clsx from 'clsx';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5001/api';

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, trend }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
            {subtext && <p className="text-xs text-gray-400 dark:text-gray-500">{subtext}</p>}
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-medium mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp size={12} />
                    {trend > 0 ? '+' : ''}{trend}% from last month
                </div>
            )}
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
            <Icon size={24} className="text-white" />
        </div>
    </div>
);

const QuickAction = ({ icon: Icon, label, to, color }) => (
    <Link to={to} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-brand-200 dark:hover:border-brand-700 transition-all group">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={24} className="text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400">{label}</span>
    </Link>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [pipelineData, setPipelineData] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [statsData, pipeline, sources, audit] = await Promise.all([
                    fetchDashboardStats(),
                    fetchSalesPipeline(),
                    fetchLeadSources(),
                    fetchAuditLogs({ limit: 5 })
                ]);

                setStats(statsData);
                setPipelineData(pipeline);
                setSourceData(sources);
                setActivities(audit.logs || []);
            } catch (error) {
                console.error('Dashboard load error:', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="space-y-6 pb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, here's your sales overview.</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                        <option>This Month</option>
                        <option>Last Quarter</option>
                        <option>This Year</option>
                    </select>
                </div>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <QuickAction icon={Users} label="New Lead" to="/leads" color="bg-blue-500" />
                <QuickAction icon={Briefcase} label="New Deal" to="/opportunities" color="bg-purple-500" />
                <QuickAction icon={CheckSquare} label="New Task" to="/tasks" color="bg-green-500" />
                <QuickAction icon={LifeBuoy} label="New Case" to="/cases" color="bg-orange-500" />
                <QuickAction icon={FileText} label="New Quote" to="/quotes" color="bg-indigo-500" />
                <QuickAction icon={Mail} label="Email" to="/email-templates" color="bg-pink-500" />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${(stats?.closedWonValue || 0).toLocaleString()}`}
                    subtext="Closed Won Deals"
                    icon={DollarSign}
                    colorClass="bg-green-500 shadow-green-200"
                    trend={12}
                />
                <StatCard
                    title="Pipeline Value"
                    value={`$${(stats?.totalPipelineValue || 0).toLocaleString()}`}
                    subtext="All Opportunities"
                    icon={Briefcase}
                    colorClass="bg-purple-500 shadow-purple-200"
                    trend={8}
                />
                <StatCard
                    title="Active Deals"
                    value={stats?.activeDeals || 0}
                    subtext="In Progress"
                    icon={Target}
                    colorClass="bg-orange-500 shadow-orange-200"
                    trend={5}
                />
                <StatCard
                    title="Total Leads"
                    value={stats?.totalLeads || 0}
                    subtext="Potential Customers"
                    icon={Users}
                    colorClass="bg-blue-500 shadow-blue-200"
                    trend={5}
                />
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Pipeline Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Sales Pipeline</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pipelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Leads by Source */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Leads by Source</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                        <Link to="/audit" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {activities.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No recent activity</div>
                        ) : (
                            activities.map((activity, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Activity size={16} className="text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {activity.action} on {activity.entity}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {activity.details}
                                        </p>
                                        <p className="text-xs text-brand-600 mt-1">
                                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Tasks Overview */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Tasks</h3>
                        <Link to="/tasks" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <Clock size={18} className="text-gray-400" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {[
                            { title: 'Call with Acme Corp', priority: 'High', due: 'Today' },
                            { title: 'Send proposal to TechStart', priority: 'Medium', due: 'Tomorrow' },
                            { title: 'Update Q1 forecast', priority: 'Low', due: 'In 2 days' },
                            { title: 'Web-to-Lead configuration', priority: 'Low', due: 'Next Week' },
                        ].map((task, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-brand-200 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' :
                                        task.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'
                                        }`} />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{task.title}</span>
                                </div>
                                <span className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                                    {task.due}
                                </span>
                            </div>
                        ))}
                        <Link to="/tasks" className="block w-full mt-2 py-2 text-sm text-center text-gray-500 hover:text-brand-600 font-medium border border-dashed border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-200 transition-colors">
                            + Add New Task
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
