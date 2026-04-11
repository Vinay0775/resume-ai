'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  ArrowLeft, Users, FileText, Layout, Database, Shield, Crown, Clock,
  Mail, CreditCard, DollarSign, TrendingUp, Activity, Settings,
  Search, ChevronLeft, ChevronRight, Trash2, Ban, CheckCircle,
  ArrowUpCircle, ArrowDownCircle, Flag, Eye, BarChart3, Zap,
  Moon, Sun, Plus, ToggleLeft, ToggleRight, RefreshCw, AlertTriangle,
  UserCheck, UserX, Receipt, PieChart, Loader2
} from 'lucide-react';
import { useTheme } from 'next-themes';

type AdminPage = 'dashboard' | 'users' | 'resumes' | 'payments' | 'templates' | 'ai-usage' | 'analytics' | 'settings';

const sidebarItems: { id: AdminPage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Database },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'resumes', label: 'Resumes', icon: FileText },
  { id: 'payments', label: 'Payments', icon: Receipt },
  { id: 'templates', label: 'Templates', icon: Layout },
  { id: 'ai-usage', label: 'AI Usage', icon: Zap },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminPanel() {
  const { setCurrentPage } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [activePage, setActivePage] = useState<AdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-white dark:bg-gray-900 border-r flex flex-col transition-all duration-300 shrink-0`}>
        <div className="h-14 flex items-center justify-between px-3 border-b">
          {sidebarOpen && (
            <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-sm">Admin Panel</span>
            </button>
          )}
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage === item.id
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t space-y-1">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            {theme === 'dark' ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            {sidebarOpen && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button onClick={() => setCurrentPage('dashboard')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Back to App</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'users' && <UsersPage />}
        {activePage === 'resumes' && <ResumesPage />}
        {activePage === 'payments' && <PaymentsPage />}
        {activePage === 'templates' && <TemplatesPage />}
        {activePage === 'ai-usage' && <AIUsagePage />}
        {activePage === 'analytics' && <AnalyticsPage />}
        {activePage === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 1. DASHBOARD OVERVIEW
// ═══════════════════════════════════════════════════════════
function DashboardPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard').then(r => r.json()).then(d => { setStats(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: Users, color: 'emerald' },
    { label: 'Total Resumes', value: stats?.totalResumes ?? '—', icon: FileText, color: 'teal' },
    { label: 'Premium Users', value: stats?.activeSubscriptions ?? '—', icon: Crown, color: 'amber' },
    { label: 'Total Revenue', value: `$${Number(stats?.totalRevenue ?? 0).toFixed(2)}`, icon: DollarSign, color: 'green' },
    { label: 'Suspended Users', value: stats?.suspendedUsers ?? '—', icon: Ban, color: 'red' },
    { label: 'Recent Signups', value: stats?.recentUsers ?? '—', icon: TrendingUp, color: 'cyan' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600',
    teal: 'bg-teal-50 dark:bg-teal-950/30 text-teal-600',
    amber: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600',
    green: 'bg-green-50 dark:bg-green-950/30 text-green-600',
    red: 'bg-red-50 dark:bg-red-950/30 text-red-600',
    cyan: 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600',
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4">
              <div className={`w-10 h-10 rounded-lg ${colorMap[s.color]} flex items-center justify-center mb-2`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{loading ? '...' : s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily Signups */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500" /> Daily Signups (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <div className="h-40 bg-muted animate-pulse rounded" /> : (
              <div className="space-y-2">
                {((stats?.dailySignups || []) as { date: string; signups: number }[]).map((d) => (
                  <div key={d.date} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20">{d.date}</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${Math.max(d.signups * 20, 4)}%` }} />
                    </div>
                    <span className="text-xs font-medium w-6 text-right">{d.signups}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" /> Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <div className="h-40 bg-muted animate-pulse rounded" /> : (
              <div className="space-y-2">
                {((stats?.monthlyRevenue || []) as { month: string; revenue: number; transactions: number }[]).map((m) => (
                  <div key={m.month} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16">{m.month}</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${Math.max((m.revenue / 50) * 100, 4)}%` }} />
                    </div>
                    <span className="text-xs font-medium w-16 text-right">${m.revenue.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> AI Usage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              <p className="text-3xl font-bold text-amber-600">{Number(stats?.aiStats && (stats.aiStats as Record<string, number>).totalCreditsUsed || 0)}</p>
              <p className="text-sm text-muted-foreground">Total AI Credits Used</p>
            </div>
            <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
              <p className="text-3xl font-bold text-cyan-600">{Number(stats?.aiStats && (stats.aiStats as Record<string, number>).avgCreditsPerUser || 0)}</p>
              <p className="text-sm text-muted-foreground">Avg Credits/User</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 2. USERS MANAGEMENT
// ═══════════════════════════════════════════════════════════
function UsersPage() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmAction, setConfirmAction] = useState<{ userId: string; action: string; userName: string } | null>(null);
  const [selectedUser, setSelectedUser] = useState<Record<string, unknown> | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams({ search, plan: planFilter, status: statusFilter, page: String(page), limit: '20' });
    const res = await fetch(`/api/admin/users?${params}`);
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
    }
    setLoading(false);
  };

  useEffect(() => { const t = setTimeout(() => { fetchUsers(); }, 0); return () => clearTimeout(t); }, [search, planFilter, statusFilter, page]);

  const handleAction = async () => {
    if (!confirmAction) return;
    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: confirmAction.userId, action: confirmAction.action }),
    });
    if (res.ok) {
      toast.success(`User ${confirmAction.action}d successfully`);
      fetchUsers();
      if (selectedUser && (selectedUser.id as string) === confirmAction.userId) {
        setSelectedUser(null);
      }
    } else {
      toast.error('Action failed');
    }
    setConfirmAction(null);
  };

  const handleDelete = async (userId: string) => {
    const res = await fetch(`/api/admin/users?userId=${userId}`, { method: 'DELETE' });
    if (res.ok) { toast.success('User deleted'); fetchUsers(); setSelectedUser(null); }
    else toast.error('Delete failed');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Badge variant="secondary">{users.length} users</Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="All Plans" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Resumes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id as string} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedUser(u)}>
                        <TableCell className="font-medium">{(u.name as string) || '—'}</TableCell>
                        <TableCell className="text-sm">{u.email as string}</TableCell>
                        <TableCell>
                          <Badge variant={(u.plan as string) === 'premium' ? 'default' : 'secondary'} className="gap-1 text-[10px]">
                            {(u.plan as string) === 'premium' ? <Crown className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                            {u.plan as string}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={(u.status as string) === 'active' ? 'secondary' : 'destructive'} className="text-[10px]">
                            {(u.status as string) === 'active' ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                            {u.status as string}
                          </Badge>
                        </TableCell>
                        <TableCell>{(u._count as Record<string, number>)?.resumes || 0}</TableCell>
                        <TableCell>
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            {(u.status as string) === 'active' ? (
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600" onClick={() => setConfirmAction({ userId: u.id as string, action: 'suspend', userName: u.name as string })}><Ban className="w-3 h-3 mr-1" />Suspend</Button>
                            ) : (
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600" onClick={() => setConfirmAction({ userId: u.id as string, action: 'activate', userName: u.name as string })}><CheckCircle className="w-3 h-3 mr-1" />Activate</Button>
                            )}
                            {(u.plan as string) === 'free' ? (
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-600" onClick={() => setConfirmAction({ userId: u.id as string, action: 'upgrade', userName: u.name as string })}><ArrowUpCircle className="w-3 h-3 mr-1" />Upgrade</Button>
                            ) : (
                              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setConfirmAction({ userId: u.id as string, action: 'downgrade', userName: u.name as string })}><ArrowDownCircle className="w-3 h-3 mr-1" />Downgrade</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="w-4 h-4" /></Button>
            <span className="text-sm">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* User Detail Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">User Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold mx-auto mb-2">
                      {(selectedUser.name as string)?.[0]?.toUpperCase() || '?'}
                    </div>
                    <h3 className="font-semibold">{selectedUser.name as string}</h3>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Mail className="w-3 h-3" />{selectedUser.email as string}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><Badge variant={(selectedUser.plan as string) === 'premium' ? 'default' : 'secondary'}>{selectedUser.plan as string}</Badge></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant={(selectedUser.status as string) === 'active' ? 'secondary' : 'destructive'}>{selectedUser.status as string}</Badge></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Password</span><span className="font-mono text-xs">{selectedUser.password as string || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">AI Credits</span><span>{selectedUser.aiCreditsUsed as number} / {selectedUser.aiCreditsLimit as number}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Resumes</span><span>{(selectedUser._count as Record<string, number>)?.resumes || 0}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Payments</span><span>{(selectedUser._count as Record<string, number>)?.payments || 0}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span>{new Date(selectedUser.createdAt as string).toLocaleDateString()}</span></div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Button size="sm" variant="outline" className="w-full" onClick={() => setConfirmAction({ userId: selectedUser.id as string, action: (selectedUser.plan as string) === 'free' ? 'upgrade' : 'downgrade', userName: selectedUser.name as string })}>
                      {(selectedUser.plan as string) === 'free' ? <><ArrowUpCircle className="w-4 h-4 mr-1" /> Upgrade to Premium</> : <><ArrowDownCircle className="w-4 h-4 mr-1" /> Downgrade to Free</>}
                    </Button>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => setConfirmAction({ userId: selectedUser.id as string, action: (selectedUser.status as string) === 'active' ? 'suspend' : 'activate', userName: selectedUser.name as string })}>
                      {(selectedUser.status as string) === 'active' ? <><Ban className="w-4 h-4 mr-1" /> Suspend User</> : <><CheckCircle className="w-4 h-4 mr-1" /> Activate User</>}
                    </Button>
                    <Button size="sm" variant="destructive" className="w-full" onClick={() => handleDelete(selectedUser.id as string)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete User
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Click a user to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to <strong>{confirmAction?.action}</strong> user <strong>{confirmAction?.userName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction} className={confirmAction?.action === 'suspend' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}>
              Confirm {confirmAction?.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 3. RESUMES MANAGEMENT
// ═══════════════════════════════════════════════════════════
function ResumesPage() {
  const [resumes, setResumes] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchResumes = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/resumes?search=${search}`);
    if (res.ok) { const data = await res.json(); setResumes(data.resumes); }
    setLoading(false);
  };

  useEffect(() => { const t = setTimeout(() => { fetchResumes(); }, 0); return () => clearTimeout(t); }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resume?')) return;
    const res = await fetch(`/api/admin/resumes?resumeId=${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Resume deleted'); fetchResumes(); }
  };

  const handleFlag = async (id: string, flagged: boolean) => {
    const res = await fetch('/api/admin/resumes', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeId: id, action: flagged ? 'unflag' : 'flag' }),
    });
    if (res.ok) { toast.success(flagged ? 'Unflagged' : 'Flagged'); fetchResumes(); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Resume Management</h1>
        <Badge variant="secondary">{resumes.length} resumes</Badge>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search resumes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Flagged</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : resumes.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No resumes found</TableCell></TableRow>
              ) : resumes.map((r) => (
                <TableRow key={r.id as string}>
                  <TableCell className="font-medium">{r.title as string}</TableCell>
                  <TableCell>{((r.user as Record<string, string>)?.name || (r.user as Record<string, string>)?.email) || 'Unknown'}</TableCell>
                  <TableCell><Badge variant="outline">{r.templateId as string}</Badge></TableCell>
                  <TableCell>{(r.flagged as boolean) ? <Badge variant="destructive" className="gap-1"><Flag className="w-3 h-3" />Flagged</Badge> : <Badge variant="secondary">Clean</Badge>}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(r.createdAt as string).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleFlag(r.id as string, r.flagged as boolean)}>
                        <Flag className="w-3 h-3 mr-1" />{(r.flagged as boolean) ? 'Unflag' : 'Flag'}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600" onClick={() => handleDelete(r.id as string)}>
                        <Trash2 className="w-3 h-3 mr-1" />Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 4. PAYMENTS & SUBSCRIPTIONS
// ═══════════════════════════════════════════════════════════
function PaymentsPage() {
  const [payments, setPayments] = useState<Record<string, unknown>[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/payments?status=${statusFilter}`);
    if (res.ok) { const data = await res.json(); setPayments(data.payments); setSummary(data.summary); }
    setLoading(false);
  };

  useEffect(() => { const t = setTimeout(() => { fetchPayments(); }, 0); return () => clearTimeout(t); }, [statusFilter]);

  const handleRefund = async (paymentId: string) => {
    if (!confirm('Refund this payment? User will be downgraded.')) return;
    const res = await fetch('/api/admin/payments', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, action: 'refund' }),
    });
    if (res.ok) { toast.success('Payment refunded'); fetchPayments(); }
  };

  const statusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    refunded: 'bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400',
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Payments & Subscriptions</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${(summary.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'green' },
          { label: 'Pending', value: `$${(summary.pendingAmount || 0).toFixed(2)}`, icon: Clock, color: 'yellow' },
          { label: 'Refunded', value: `$${(summary.refundedAmount || 0).toFixed(2)}`, icon: RefreshCw, color: 'gray' },
          { label: 'Transactions', value: String(summary.totalTransactions || 0), icon: Receipt, color: 'emerald' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); }}>
        <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
          <SelectItem value="refunded">Refunded</SelectItem>
        </SelectContent>
      </Select>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : payments.map((p) => (
                <TableRow key={p.id as string}>
                  <TableCell>{((p.user as Record<string, string>)?.name || (p.user as Record<string, string>)?.email) || 'Unknown'}</TableCell>
                  <TableCell className="font-medium">${(p.amount as number).toFixed(2)}</TableCell>
                  <TableCell><Badge variant="outline">{p.plan as string}</Badge></TableCell>
                  <TableCell className="text-sm">{p.paymentMethod as string}</TableCell>
                  <TableCell><Badge className={statusColors[p.status as string] || ''}>{p.status as string}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(p.createdAt as string).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {(p.status as string) === 'completed' && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-600" onClick={() => handleRefund(p.id as string)}>
                        <RefreshCw className="w-3 h-3 mr-1" />Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 5. TEMPLATES MANAGEMENT
// ═══════════════════════════════════════════════════════════
function TemplatesPage() {
  const [templates, setTemplates] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '', category: 'professional', isPremium: false });

  const fetchTemplates = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/templates');
    if (res.ok) { const data = await res.json(); setTemplates(data.templates); }
    setLoading(false);
  };

  useEffect(() => { const t = setTimeout(() => { fetchTemplates(); }, 0); return () => clearTimeout(t); }, []);

  const handleAdd = async () => {
    const res = await fetch('/api/admin/templates', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTemplate),
    });
    if (res.ok) { toast.success('Template created'); setAddOpen(false); fetchTemplates(); }
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    const res = await fetch('/api/admin/templates', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: id, data: { enabled: !enabled } }),
    });
    if (res.ok) { toast.success(enabled ? 'Template disabled' : 'Template enabled'); fetchTemplates(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    const res = await fetch(`/api/admin/templates?templateId=${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Template deleted'); fetchTemplates(); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Templates Management</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Template
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [1, 2, 3].map(i => <Card key={i}><CardContent className="p-6"><div className="h-32 bg-muted animate-pulse rounded" /></CardContent></Card>) :
          templates.map((t) => (
            <Card key={t.id as string} className={!(t.enabled as boolean) ? 'opacity-60' : ''}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{t.name as string}</h3>
                    <p className="text-xs text-muted-foreground">{t.category as string}</p>
                  </div>
                  {(t.isPremium as boolean) ? <Badge className="bg-amber-500 text-white"><Crown className="w-3 h-3 mr-1" />Premium</Badge> : <Badge variant="secondary">Free</Badge>}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{(t.description as string) || 'No description'}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={t.enabled as boolean} onCheckedChange={() => handleToggle(t.id as string, t.enabled as boolean)} />
                    <span className="text-xs text-muted-foreground">{(t.enabled as boolean) ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600" onClick={() => handleDelete(t.id as string)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Add Template Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Template</DialogTitle>
            <DialogDescription>Create a new resume template</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Template Name</Label><Input placeholder="e.g., Startup Classic" value={newTemplate.name} onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea placeholder="Template description..." value={newTemplate.description} onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Category</Label>
              <Select value={newTemplate.category} onValueChange={(v) => setNewTemplate({ ...newTemplate, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2"><Switch checked={newTemplate.isPremium} onCheckedChange={(v) => setNewTemplate({ ...newTemplate, isPremium: v })} /><Label>Premium Template</Label></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAdd} disabled={!newTemplate.name}>Create Template</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 6. AI USAGE CONTROL
// ═══════════════════════════════════════════════════════════
function AIUsagePage() {
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(d => { setAnalytics(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const topAiUsers = (analytics?.topAiUsers || []) as Record<string, unknown>[];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2"><Zap className="w-6 h-6 text-amber-500" /> AI Usage Control</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{analytics?.totalCreditsUsed as number || 0}</p>
            <p className="text-sm text-muted-foreground">Total Credits Used</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-cyan-600">{topAiUsers.length}</p>
            <p className="text-sm text-muted-foreground">Active AI Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">~${((analytics?.totalCreditsUsed as number || 0) * 0.002).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Est. API Cost</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Top AI Users</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow><TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>Credits Used</TableHead><TableHead>Limit</TableHead><TableHead>Usage %</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow> :
                topAiUsers.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No AI usage yet</TableCell></TableRow> :
                topAiUsers.map((u) => (
                  <TableRow key={u.id as string}>
                    <TableCell className="font-medium">{u.name as string || '—'}</TableCell>
                    <TableCell className="text-sm">{u.email as string}</TableCell>
                    <TableCell>{u.aiCreditsUsed as number}</TableCell>
                    <TableCell>{u.aiCreditsLimit as number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2 max-w-[100px]">
                          <div className={`h-full rounded-full ${(u.aiCreditsUsed as number) / (u.aiCreditsLimit as number) > 0.8 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(((u.aiCreditsUsed as number) / (u.aiCreditsLimit as number)) * 100, 100)}%` }} />
                        </div>
                        <span className="text-xs">{Math.round(((u.aiCreditsUsed as number) / (u.aiCreditsLimit as number)) * 100)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 7. ANALYTICS
// ═══════════════════════════════════════════════════════════
function AnalyticsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const templatePopularity = (data?.templatePopularity || {}) as Record<string, number>;
  const maxTemplate = Math.max(...Object.values(templatePopularity), 1);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="w-6 h-6 text-emerald-500" /> Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Conversion Rate', value: `${data?.conversionRate || 0}%`, icon: TrendingUp, desc: 'Free → Premium' },
          { label: 'Active Users (7d)', value: String(data?.activeUsers || 0), icon: Activity, desc: 'Recently active' },
          { label: 'Retention Rate', value: `${data?.retentionRate || 0}%`, icon: PieChart, desc: 'Users with resumes' },
          { label: 'Premium Users', value: String(data?.premiumUsers || 0), icon: Crown, desc: `of ${data?.totalUsers || 0} total` },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1"><m.icon className="w-4 h-4 text-emerald-500" /><span className="text-xs text-muted-foreground">{m.desc}</span></div>
              <p className="text-2xl font-bold">{loading ? '...' : m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Plan Distribution */}
        <Card>
          <CardHeader><CardTitle className="text-base">Plan Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-16 text-sm">Free</span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-6 overflow-hidden">
                  <div className="bg-gray-500 h-full rounded-full flex items-center justify-end pr-2" style={{ width: `${((data?.planDistribution as Record<string, number>)?.free || 0) / Math.max((data?.totalUsers as number) || 1, 1) * 100}%` }}>
                    <span className="text-[10px] text-white font-medium">{(data?.planDistribution as Record<string, number>)?.free || 0}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-16 text-sm">Premium</span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-6 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full flex items-center justify-end pr-2" style={{ width: `${((data?.planDistribution as Record<string, number>)?.premium || 0) / Math.max((data?.totalUsers as number) || 1, 1) * 100}%` }}>
                    <span className="text-[10px] text-white font-medium">{(data?.planDistribution as Record<string, number>)?.premium || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Template Popularity */}
        <Card>
          <CardHeader><CardTitle className="text-base">Template Popularity</CardTitle></CardHeader>
          <CardContent>
            {Object.keys(templatePopularity).length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No resume data yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(templatePopularity).map(([name, count]) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className="w-20 text-sm capitalize">{name}</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full" style={{ width: `${(count / maxTemplate) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 8. SETTINGS
// ═══════════════════════════════════════════════════════════
function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => { setSettings(d.settings || {}); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    if (res.ok) toast.success('Settings saved!');
    else toast.error('Failed to save settings');
    setSaving(false);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: prev[key] === 'true' ? 'false' : 'true' }));
  };

  const settingGroups = [
    {
      title: 'Pricing',
      icon: DollarSign,
      items: [
        { key: 'premium_plan_price', label: 'Premium Plan Price ($)', type: 'number' },
        { key: 'free_plan_ai_credits', label: 'Free Plan AI Credits', type: 'number' },
        { key: 'premium_plan_ai_credits', label: 'Premium Plan AI Credits', type: 'number' },
        { key: 'max_resumes_free', label: 'Max Resumes (Free)', type: 'number' },
        { key: 'max_resumes_premium', label: 'Max Resumes (Premium)', type: 'number' },
      ],
    },
    {
      title: 'Features',
      icon: ToggleLeft,
      items: [
        { key: 'enable_registration', label: 'Enable Registration', type: 'toggle' },
        { key: 'enable_ai_features', label: 'Enable AI Features', type: 'toggle' },
        { key: 'enable_pdf_export', label: 'Enable PDF Export', type: 'toggle' },
        { key: 'enable_docx_export', label: 'Enable DOCX Export', type: 'toggle' },
        { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'toggle' },
      ],
    },
    {
      title: 'Branding & Email',
      icon: Mail,
      items: [
        { key: 'site_name', label: 'Site Name', type: 'text' },
        { key: 'support_email', label: 'Support Email', type: 'text' },
        { key: 'smtp_host', label: 'SMTP Host', type: 'text' },
        { key: 'smtp_port', label: 'SMTP Port', type: 'text' },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Settings className="w-6 h-6" /> Settings</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSave} disabled={saving}>
          {saving ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Saving...</> : <><CheckCircle className="w-4 h-4 mr-1" />Save All Settings</>}
        </Button>
      </div>

      {settingGroups.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><group.icon className="w-4 h-4" /> {group.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {group.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4">
                  <Label className="text-sm shrink-0">{item.label}</Label>
                  {item.type === 'toggle' ? (
                    <div className="flex items-center gap-2">
                      <Switch checked={settings[item.key] === 'true'} onCheckedChange={() => toggleSetting(item.key)} />
                      <span className="text-xs text-muted-foreground w-12">{settings[item.key] === 'true' ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  ) : (
                    <Input type={item.type} value={settings[item.key] || ''} onChange={(e) => updateSetting(item.key, e.target.value)} className="max-w-[200px]" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
