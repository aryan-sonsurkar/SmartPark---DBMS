"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import VehicleCard from "@/components/parking/VehicleCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { mockVehicles } from "@/lib/mock-data";
import type { Vehicle } from "@/types";

export default function MyVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState({ plate_number: "", model: "", color: "", vehicle_type: "car" });

  const openAdd = () => {
    setEditingVehicle(null);
    setForm({ plate_number: "", model: "", color: "", vehicle_type: "car" });
    setModalOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setForm({ plate_number: v.plate_number, model: v.model, color: v.color, vehicle_type: v.vehicle_type });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingVehicle) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === editingVehicle.id ? { ...v, ...form } as Vehicle : v))
      );
    } else {
      const newVehicle: Vehicle = {
        id: `v${Date.now()}`,
        owner_id: "u1",
        ...form,
        vehicle_type: form.vehicle_type as Vehicle["vehicle_type"],
        created_at: new Date().toISOString(),
      };
      setVehicles((prev) => [...prev, newVehicle]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

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
            key={vehicle.id}
            vehicle={vehicle}
            actions={
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(vehicle)} className="p-2 rounded-lg hover:bg-surface text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(vehicle.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-600 transition-colors">
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
            label="Plate Number"
            placeholder="MH-12-AB-1234"
            value={form.plate_number}
            onChange={(e) => setForm({ ...form, plate_number: e.target.value })}
          />
          <Input
            label="Model"
            placeholder="Maruti Swift"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
          />
          <Input
            label="Color"
            placeholder="White"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
          <Select
            label="Vehicle Type"
            value={form.vehicle_type}
            onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}
            options={[
              { value: "car", label: "Car" },
              { value: "bike", label: "Bike" },
              { value: "suv", label: "SUV" },
              { value: "truck", label: "Truck" },
            ]}
          />
          <div className="flex gap-3 pt-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {editingVehicle ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
