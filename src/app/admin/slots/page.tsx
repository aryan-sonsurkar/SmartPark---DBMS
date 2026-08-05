"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { fetchSlots, addSlot, updateSlot, deleteSlot } from "@/lib/db";
import type { ParkingSlot } from "@/types";

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ParkingSlot | null>(null);
  const [form, setForm] = useState({ slot_number: "", slot_status: "Available" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSlots()
      .then(setSlots)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingSlot(null);
    setForm({ slot_number: "", slot_status: "Available" });
    setModalOpen(true);
  };

  const openEdit = (s: ParkingSlot) => {
    setEditingSlot(s);
    setForm({ slot_number: s.slot_number, slot_status: s.slot_status });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingSlot) {
        await updateSlot(editingSlot.slot_id, {
          slot_number: form.slot_number,
          slot_status: form.slot_status as ParkingSlot["slot_status"],
        });
      } else {
        await addSlot({
          slot_id: `S${Date.now()}`,
          slot_number: form.slot_number,
          slot_status: form.slot_status as ParkingSlot["slot_status"],
        });
      }
      const updated = await fetchSlots();
      setSlots(updated);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error saving slot");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slot?")) return;
    try {
      await deleteSlot(id);
      setSlots((prev) => prev.filter((s) => s.slot_id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting slot");
    }
  };

  const statusStyles: Record<string, string> = {
    Available: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Occupied: "bg-red-500/10 text-red-600 dark:text-red-400",
    Maintenance: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Manage Slots</h1>
          <p className="text-muted-foreground mt-1 text-sm">Add, edit, or remove parking slots.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4" /> Add Slot
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border uppercase tracking-wider">
                <th className="px-5 py-3 font-bold">Slot ID</th>
                <th className="px-5 py-3 font-bold">Slot Number</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots
                .sort((a, b) => a.slot_number.localeCompare(b.slot_number))
                .map((s) => (
                  <tr key={s.slot_id} className="border-b border-border/50 hover:bg-surface transition-colors">
                    <td className="px-5 py-3.5 font-mono text-sm text-muted-foreground">{s.slot_id}</td>
                    <td className="px-5 py-3.5 font-bold text-foreground font-mono text-sm">{s.slot_number}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${statusStyles[s.slot_status]}`}>
                        {s.slot_status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-surface text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s.slot_id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingSlot ? "Edit Slot" : "Add Slot"}>
        <div className="space-y-4">
          <Input label="Slot Number" placeholder="A1" value={form.slot_number} onChange={(e) => setForm({ ...form, slot_number: e.target.value })} />
          <Select label="Status" value={form.slot_status} onChange={(e) => setForm({ ...form, slot_status: e.target.value })} options={[{ value: "Available", label: "Available" }, { value: "Occupied", label: "Occupied" }, { value: "Maintenance", label: "Maintenance" }]} />
          <div className="flex gap-3 pt-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} className="flex-1" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
