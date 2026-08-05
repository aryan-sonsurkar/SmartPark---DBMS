"use client";

import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { fetchVehicles, addVehicle, updateVehicle, deleteVehicle } from "@/lib/db";
import type { Vehicle } from "@/types";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState({ vehicle_number: "", vehicle_type: "Car", owner_id: 101 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVehicles()
      .then(setVehicles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = vehicles.filter(
    (v) =>
      v.vehicle_number.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicle_type.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingVehicle(null);
    setForm({ vehicle_number: "", vehicle_type: "Car", owner_id: 101 });
    setModalOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setForm({ vehicle_number: v.vehicle_number, vehicle_type: v.vehicle_type, owner_id: v.owner_id });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.vehicle_id, {
          vehicle_number: form.vehicle_number,
          vehicle_type: form.vehicle_type as Vehicle["vehicle_type"],
        });
      } else {
        await addVehicle({
          vehicle_id: `V${Date.now()}`,
          vehicle_number: form.vehicle_number,
          vehicle_type: form.vehicle_type as Vehicle["vehicle_type"],
          owner_id: form.owner_id,
        });
      }
      const updated = await fetchVehicles();
      setVehicles(updated);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error saving vehicle");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;
    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.vehicle_id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting vehicle");
    }
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
          <h1 className="text-2xl font-bold text-foreground tracking-tight">All Vehicles</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage all registered vehicles in the system.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4" /> Add Vehicle
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by vehicle number or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border uppercase tracking-wider">
                <th className="px-5 py-3 font-bold">ID</th>
                <th className="px-5 py-3 font-bold">Number</th>
                <th className="px-5 py-3 font-bold">Type</th>
                <th className="px-5 py-3 font-bold">Owner</th>
                <th className="px-5 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.vehicle_id} className="border-b border-border/50 hover:bg-surface transition-colors">
                  <td className="px-5 py-3.5 font-mono text-sm text-muted-foreground">{v.vehicle_id}</td>
                  <td className="px-5 py-3.5 font-bold text-foreground font-mono text-sm">{v.vehicle_number}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-surface border border-border text-muted-foreground">
                      {v.vehicle_type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-sm">{v.owner?.owner_name}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(v)} className="p-2 rounded-lg hover:bg-surface text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(v.vehicle_id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-600 transition-colors">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingVehicle ? "Edit Vehicle" : "Add Vehicle"}>
        <div className="space-y-4">
          <Input label="Vehicle Number" placeholder="MH01AB1234" value={form.vehicle_number} onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })} />
          <Select label="Vehicle Type" value={form.vehicle_type} onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })} options={[{ value: "Car", label: "Car" }, { value: "Bike", label: "Bike" }, { value: "SUV", label: "SUV" }, { value: "Truck", label: "Truck" }]} />
          <Input label="Owner ID" type="number" value={form.owner_id} onChange={(e) => setForm({ ...form, owner_id: Number(e.target.value) })} />
          <div className="flex gap-3 pt-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} className="flex-1" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
