import { useState, useEffect } from "react";
import {
  Settings,
  User as UserIcon,
  Bell,
  Shield,
  Palette,
  Monitor,
  Moon,
  Sun,
  Globe,
  Clock,
  Save,
  LogOut,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { DepartmentLayout } from "@/components/department/DepartmentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthContext } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import type { User } from "@/types/api";
import { toast } from "sonner";

const SettingsPage = () => {
  const { user, logout, updateUser } = useAuthContext();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem("notificationPrefs");
    return stored
      ? JSON.parse(stored)
      : {
          criticalAlerts: true,
          medicationReminders: true,
          shiftChanges: true,
          patientUpdates: true,
          emailNotifications: false,
          soundEnabled: true,
        };
  });

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "General",
    role: user?.role || "nurse",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Sync profile with user data
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        department: user.department,
        role: user.role,
      });
    }
  }, [user]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // system
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      // Update via API - the backend would need a PATCH /auth/me endpoint
      // For now update local state
      const updatedUser = {
        ...user!,
        name: profile.name,
        phone: profile.phone,
        department: profile.department as User['department'],
      };
      updateUser(updatedUser);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem("notificationPrefs", JSON.stringify(notifications));
    toast.success("Notification preferences saved");
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSavingPassword(true);
    try {
      await authService.changePassword(passwords.currentPassword, passwords.newPassword);
      toast.success("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to change password";
      toast.error(message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DepartmentLayout
      title="Settings"
      icon={Settings}
      headerActions={
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-destructive hover:text-destructive"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      }
    >
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="profile" className="gap-1 sm:gap-2">
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1 sm:gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1 sm:gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Theme</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1 sm:gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
              <CardDescription className="text-sm">
                Update your personal information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarFallback className="text-xl sm:text-2xl bg-primary/20 text-primary">
                    {getInitials(profile.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-lg">{profile.name || "User"}</p>
                  <p className="text-sm text-muted-foreground capitalize">{profile.role} • {profile.department}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Change Photo
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={profile.department}
                    onValueChange={(value) => setProfile({ ...profile, department: value as User['department'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPD">OPD</SelectItem>
                      <SelectItem value="IPD">IPD</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2 md:col-span-1">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={profile.role} disabled className="bg-muted capitalize" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="gap-2 w-full sm:w-auto" disabled={isSavingProfile}>
                  {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Notification Preferences</CardTitle>
              <CardDescription className="text-sm">
                Configure how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-4">
                {[
                  { key: "criticalAlerts", label: "Critical Alerts", desc: "Immediate alerts for critical conditions" },
                  { key: "medicationReminders", label: "Medication Reminders", desc: "Notified when medications are due" },
                  { key: "shiftChanges", label: "Shift Changes", desc: "Reminders before shift changes" },
                  { key: "patientUpdates", label: "Patient Updates", desc: "Changes to assigned patients" },
                  { key: "emailNotifications", label: "Email Notifications", desc: "Also send to your email" },
                  { key: "soundEnabled", label: "Sound Alerts", desc: "Play sound for notifications" },
                ].map((item, idx) => (
                  <div key={item.key}>
                    {idx > 0 && <Separator className="mb-4" />}
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <Label className="text-sm">{item.label}</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, [item.key]: checked })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} className="gap-2 w-full sm:w-auto">
                  <Save className="h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Appearance Settings</CardTitle>
              <CardDescription className="text-sm">
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {[
                    { value: "light", icon: Sun, label: "Light" },
                    { value: "dark", icon: Moon, label: "Dark" },
                    { value: "system", icon: Monitor, label: "System" },
                  ].map((t) => (
                    <Button
                      key={t.value}
                      variant={theme === t.value ? "default" : "outline"}
                      className="flex flex-col gap-1 sm:gap-2 h-auto py-3 sm:py-4"
                      onClick={() => setTheme(t.value)}
                    >
                      <t.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="text-xs sm:text-sm">{t.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          English
                        </div>
                      </SelectItem>
                      <SelectItem value="es">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Español
                        </div>
                      </SelectItem>
                      <SelectItem value="fr">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Français
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <Select defaultValue="12h">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          12-hour (AM/PM)
                        </div>
                      </SelectItem>
                      <SelectItem value="24h">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          24-hour
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Security Settings</CardTitle>
              <CardDescription className="text-sm">
                Manage your password and security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  />
                  {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Two-Factor Authentication</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Add extra security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Enable
                  </Button>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Active Sessions</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Manage devices where you're logged in
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    View All
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleChangePassword}
                  className="gap-2 w-full sm:w-auto"
                  disabled={isSavingPassword || !passwords.currentPassword || !passwords.newPassword || passwords.newPassword !== passwords.confirmPassword}
                >
                  {isSavingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DepartmentLayout>
  );
};

export default SettingsPage;
