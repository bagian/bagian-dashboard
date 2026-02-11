import {createSupabaseServer} from "@/lib/supabase/server";
import {supabaseAdmin} from "@/lib/supabase/admin";
import {redirect} from "next/navigation";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {ProfileForm} from "@/components/dashboard/ProfileForm";
import {PasswordForm} from "@/components/dashboard/PasswordForm";
import {UserCircle, Calendar, Mail, Building2, Phone} from "lucide-react"; // Tambah Phone icon

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil profile dari database
  const {data: profile} = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-500">Profile tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold uppercase italic leading-none">
          Akun User
        </h1>
        <p className="text-xs text-zinc-400 italic font-medium">
          Kelola informasi profil dan keamanan akun Anda.
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card className="border-zinc-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-black border-b border-zinc-100 py-6 px-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-black" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">
                  {profile.full_name || "No Name"}
                </CardTitle>
                <p className="text-xs text-zinc-400 font-mono italic">
                  {profile.email}
                </p>
              </div>
            </div>
            {/* Badge sekarang menampilkan Nomor Telepon */}
            <Badge className="rounded-full px-4 py-1 text-[10px] font-bold uppercase bg-zinc-100 text-zinc-500 border-none">
              {profile.phone || "No Phone Number"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-zinc-400 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
                Email
              </p>
              <p className="text-sm font-medium text-zinc-900">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-zinc-400 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
                Perusahaan
              </p>
              <p className="text-sm font-medium text-zinc-900">
                {profile.company_name || "-"}
              </p>
            </div>
          </div>

          {/* Bagian Role diganti menjadi Nomor Telepon */}
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-zinc-400 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
                Nomor Telepon
              </p>
              <p className="text-sm font-medium text-zinc-900">
                {profile.phone || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-zinc-400 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">
                Bergabung
              </p>
              <p className="text-sm font-medium text-zinc-900">
                {new Date(profile.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      <ProfileForm profile={profile} />

      {/* Change Password Form */}
      <PasswordForm />
    </div>
  );
}
