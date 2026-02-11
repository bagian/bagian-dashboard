"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Trash2, ShieldCheck, Loader2, Edit3} from "lucide-react";
import {
  updateUserRole,
  deleteUserAccount,
  updateUserData,
} from "@/app/actions/user-actions"; // Tambahkan updateUserData
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {DeleteUserDialog} from "./DeleteUserDialog";
import {ChangeRoleDialog} from "./ChangeRoleDialog";
import {EditUserDialog} from "./EditUserDialog"; // Kita akan buat file ini

export function UserActions({
  userId,
  currentRole,
  userName,
  userEmail,
  companyName, // Tambahkan prop ini jika ada di tabel
}: {
  userId: string;
  currentRole: string;
  userName?: string;
  userEmail?: string;
  companyName?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false); // State baru untuk Edit
  const router = useRouter();

  const nextRole = currentRole === "admin" ? "customer" : "admin";

  // --- Fungsi Edit Baru ---
  const handleEditConfirm = async (formData: {
    full_name: string;
    email: string;
    company_name: string;
  }) => {
    setLoading(true);
    try {
      const res = await updateUserData(userId, formData);

      if (res.success) {
        toast.success("Data berhasil diperbarui");
        setEditDialogOpen(false);
        router.refresh();
      } else {
        toast.error("Gagal memperbarui data", {description: res.error});
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteConfirm = async () => {
    setLoading(true);
    try {
      const res = await updateUserRole(userId, nextRole);
      if (res.success) {
        toast.success("Role berhasil diperbarui", {
          description: `User sekarang memiliki role: ${nextRole}`,
        });
        setRoleDialogOpen(false);
        router.refresh();
      } else {
        toast.error("Gagal mengubah role", {
          description: res.error || "Terjadi kesalahan",
        });
      }
    } catch (error) {
      toast.error("Gagal mengubah role", {
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const res = await deleteUserAccount(userId);
      if (res.success) {
        toast.success("User berhasil dihapus", {
          description: "User telah dihapus dari sistem",
        });
        setDeleteDialogOpen(false);
        router.refresh();
      } else {
        toast.error("Gagal menghapus user", {
          description: res.error || "Terjadi kesalahan",
        });
      }
    } catch (error) {
      toast.error("Gagal menghapus user", {
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {/* Tombol Edit Baru */}
        <Button
          onClick={() => setEditDialogOpen(true)}
          disabled={loading}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer"
          title="Edit data user"
        >
          {loading && editDialogOpen ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Edit3 className="h-4 w-4" />
          )}
        </Button>

        <Button
          onClick={() => setRoleDialogOpen(true)}
          disabled={loading}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer"
          title={`Toggle role: ${currentRole === "admin" ? "Customer" : "Admin"}`}
        >
          {loading && roleDialogOpen ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
        </Button>

        <Button
          onClick={() => setDeleteDialogOpen(true)}
          disabled={loading}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
          title="Hapus user"
        >
          {loading && deleteDialogOpen ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Edit User Dialog */}
      <EditUserDialog
        key={userId}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onConfirm={handleEditConfirm}
        userData={{
          full_name: userName || "",
          email: userEmail || "",
          company_name: companyName || "",
        }}
        isLoading={loading}
      />

      {/* Change Role Dialog */}
      <ChangeRoleDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onConfirm={handlePromoteConfirm}
        userName={userName || userEmail}
        currentRole={currentRole}
        newRole={nextRole}
        isLoading={loading}
      />

      {/* Delete User Dialog */}
      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        userName={userName || userEmail}
        isLoading={loading}
      />
    </>
  );
}
