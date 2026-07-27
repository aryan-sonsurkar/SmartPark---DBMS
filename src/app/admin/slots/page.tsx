"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { mockSlots } from "@/lib/mock-data";
import type { ParkingSlot } from "@/types";

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<ParkingSlot[]>(mockSlots);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ParkingSlot | null>(null);
  const [form, setForm] = useState({ slot_number: "", floor: 1, slot_type: "standard", status: "available" });

  const openAdd = () => {
    setEditingSlot(null);
    setForm({ slot_number: "", floor: 1, slot_type: "standard", status: "available" });
    setModalOpen(true);
  };

  const openEdit = (s: ParkingSlot) => {
    setEditingSlot(s);
    setForm({ slot_number: s.slot_number, floor: s.floor, slot_type: s.slot_type, status: s.status });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingSlot) {
      setSlots((prev) =>
        prev.map((s) => (s.id === editingSlot.id ? { ...s, ...form, floor: Number(form.floor) } as ParkingSlot : s))
      );
    } else {
      const newSlot: ParkingSlot = {
        id: `s${Date.now()}`,
        ...form,
        floor: Number(form.floor),
        slot_type: form.slot_type as ParkingSlot["slot_type"],
        status: form.status as ParkingSlot["status"],
      };
      setSlots((prev) => [...prev, newSlot]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const statusStyles: Record<string, string> = {
    available: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    occupied: "bg-red-500/10 text-red-600 dark:text-red-400",
    maintenance: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

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
                <th className="px-5 py-3 font-bold">Slot</th>
                <th className="px-5 py-3 font-bold">Floor</th>
                <th className="px-5 py-3 font-bold">Type</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots
                .sort((a, b) => a.slot_number.localeCompare(b.slot_number))
                .map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-surface transition-colors">
                    <td className="px-5 py-3.5 font-bold text-foreground font-mono text-sm">{s.slot_number}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-sm">{s.floor}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-sm capitalize">{s.slot_type}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${statusStyles[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-surface text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-600 transition-colors">
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
          <Input
            label="Slot Number"
            placeholder="A1"
            value={form.slot_number}
            onChange={(e) => setForm({ ...form, slot_number: e.target.value })}
          />
          <Input
            label="Floor"
            type="number"
            value={form.floor}
            onChange={(e) => setForm({ ...form, floor: Number(e.target.value) })}
          />
          <Select
            label="Slot Type"
            value={form.slot_type}
            onChange={(e) => setForm({ ...form, slot_type: e.target.value })}
            options={[
              { value: "compact", label: "Compact" },
              { value: "standard", label: "Standard" },
              { value: "large", label: "Large" },
            ]}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[
              { value: "available", label: "Available" },
              { value: "occupied", label: "Occupied" },
              { value: "maintenance", label: "Maintenance" },
            ]}
          />
          <div className="flex gap-3 pt-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {editingSlot ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
