"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import VehicleCard from "@/components/parking/VehicleCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { fetchVehicles, addVehicle, updateVehicle, deleteVehicle } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import type { Vehicle } from "@/types";

export default function MyVehiclesPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState({ vehicle_number: "", vehicle_type: "Car" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVehicles()
      .then((v) => setVehicles(v))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingVehicle(null);
    setForm({ vehicle_number: "", vehicle_type: "Car" });
    setModalOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setForm({ vehicle_number: v.vehicle_number, vehicle_type: v.vehicle_type });
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
        setVehicles((prev) =>
          prev.map((v) => (v.vehicle_id === editingVehicle.vehicle_id ? { ...v, ...form, vehicle_type: form.vehicle_type as Vehicle["vehicle_type"] } : v))
        );
      } else {
        const newId = `V${Date.now()}`;
        await addVehicle({
          vehicle_id: newId,
          vehicle_number: form.vehicle_number,
          vehicle_type: form.vehicle_type as Vehicle["vehicle_type"],
          owner_id: user?.owner_id || 103,
        });
        const updated = await fetchVehicles();
        setVehicles(updated);
      }
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
          <h1 className="text-2xl font-bold text-foreground tracking-tight">My Vehicles</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your registered vehicles.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4" /> Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.vehicle_id}
            vehicle={vehicle}
            actions={
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(vehicle)} className="p-2 rounded-lg hover:bg-surface text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(vehicle.vehicle_id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            }
          />
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingVehicle ? "Edit Vehicle" : "Add Vehicle"}>
        <div className="space-y-4">
          <Input
            label="Vehicle Number"
            placeholder="MH01AB1234"
            value={form.vehicle_number}
            onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })}
          />
          <Select
            label="Vehicle Type"
            value={form.vehicle_type}
            onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}
            options={[
              { value: "Car", label: "Car" },
              { value: "Bike", label: "Bike" },
              { value: "SUV", label: "SUV" },
              { value: "Truck", label: "Truck" },
            ]}
          />
          <div className="flex gap-3 pt-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1" disabled={saving}>
              {saving ? "Saving..." : editingVehicle ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
