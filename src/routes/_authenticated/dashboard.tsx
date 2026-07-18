import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, ShieldAlert, Star, ListTodo, Megaphone, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { site } from "@/config/site";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: `Dashboard — ${site.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  contact_number: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  official_role: string | null;
};

type Task = { id: string; title: string; description: string | null; status: string; due_date: string | null };
type Record = {
  attendance_days: number;
  punctuality_rating: number;
  work_quality_rating: number;
  communication_rating: number;
  overall_rating: number;
  official_feedback: string | null;
  last_review_date: string | null;
};
type Announcement = { id: string; title: string; body: string; created_at: string };

function Dashboard() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext() as { user: { id: string; email?: string } };
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [record, setRecord] = useState<Record | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [user.id]);

  async function load() {
    setLoading(true);
    const [{ data: p }, { data: t }, { data: r }, { data: a }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("tasks").select("*").eq("assigned_to", user.id).order("created_at", { ascending: false }),
      supabase.from("employee_records").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(10),
    ]);
    setProfile(p as Profile | null);
    setTasks((t ?? []) as Task[]);
    setRecord(r as Record | null);
    setAnnouncements((a ?? []) as Announcement[]);
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function updateTaskStatus(id: string, status: string) {
    const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Task updated");
    load();
  }

  async function updateProfile(patch: Partial<Profile>) {
    const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    load();
  }

  if (loading) {
    return <div className="mx-auto max-w-4xl px-6 py-20 text-muted-foreground">Loading…</div>;
  }

  if (!profile?.is_approved) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-20">
        <div className="glass rounded-2xl p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full btn-neon">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-semibold">Account pending approval</h1>
          <p className="mt-3 text-muted-foreground">
            Your account has been created successfully. Access to employee records will be available
            after your account is verified and approved by {site.name}.
          </p>
          <button
            onClick={signOut}
            className="mt-8 rounded-full border border-white/15 px-5 py-2 text-sm hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            {site.name}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold">
            Welcome, {profile.full_name || profile.email}
          </h1>
        </div>
        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Card icon={<User className="h-5 w-5" />} title="Profile">
          <ProfileForm profile={profile} onSave={updateProfile} />
        </Card>

        <Card icon={<Star className="h-5 w-5" />} title="Performance">
          {record ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Attendance" value={`${record.attendance_days} d`} />
              <Stat label="Overall" value={`${record.overall_rating}/5`} />
              <Stat label="Punctuality" value={`${record.punctuality_rating}/5`} />
              <Stat label="Quality" value={`${record.work_quality_rating}/5`} />
              <Stat label="Communication" value={`${record.communication_rating}/5`} />
              <Stat label="Reviewed" value={record.last_review_date ?? "—"} />
              {record.official_feedback && (
                <div className="col-span-2 rounded-md border border-white/10 bg-background/40 p-3 text-muted-foreground">
                  {record.official_feedback}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No performance review yet.</p>
          )}
        </Card>

        <Card icon={<Megaphone className="h-5 w-5" />} title="Announcements">
          {announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No announcements.</p>
          ) : (
            <ul className="space-y-3">
              {announcements.map((a) => (
                <li key={a.id} className="rounded-md border border-white/10 p-3">
                  <p className="font-medium">{a.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="lg:col-span-3">
          <Card icon={<ListTodo className="h-5 w-5" />} title="Assigned Tasks">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks assigned.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {tasks.map((t) => (
                  <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-medium">{t.title}</p>
                      {t.description && (
                        <p className="text-sm text-muted-foreground">{t.description}</p>
                      )}
                      {t.due_date && (
                        <p className="text-xs text-muted-foreground">Due {t.due_date}</p>
                      )}
                    </div>
                    <select
                      value={t.status}
                      onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                      className="rounded-md border border-white/15 bg-background/50 px-2 py-1.5 text-sm"
                    >
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="submitted">Submitted</option>
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground">
        {icon} {title}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-white/10 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold">{value}</p>
    </div>
  );
}

function ProfileForm({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (p: Partial<Profile>) => void;
}) {
  const [full_name, setFullName] = useState(profile.full_name ?? "");
  const [contact_number, setContact] = useState(profile.contact_number ?? "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ full_name, contact_number });
      }}
      className="grid gap-3 text-sm"
    >
      <label className="grid gap-1">
        <span className="text-muted-foreground">Full Name</span>
        <input
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          className="rounded-md border border-white/15 bg-background/50 px-3 py-2"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-muted-foreground">Contact Number</span>
        <input
          value={contact_number}
          onChange={(e) => setContact(e.target.value)}
          className="rounded-md border border-white/15 bg-background/50 px-3 py-2"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-muted-foreground">Email</span>
        <input
          value={profile.email}
          disabled
          className="rounded-md border border-white/10 bg-background/30 px-3 py-2 text-muted-foreground"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-muted-foreground">Official Role</span>
        <input
          value={profile.official_role ?? "—"}
          disabled
          className="rounded-md border border-white/10 bg-background/30 px-3 py-2 text-muted-foreground"
        />
      </label>
      <button className="mt-2 justify-self-start rounded-full btn-neon px-4 py-2 text-xs font-semibold">
        Save
      </button>
    </form>
  );
}
