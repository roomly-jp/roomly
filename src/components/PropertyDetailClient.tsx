"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import UnitFormModal from "./UnitFormModal";

interface PropertyDetailClientProps {
  propertyId: string;
}

export default function PropertyDetailClient({
  propertyId,
}: PropertyDetailClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="btn-primary" onClick={() => setIsOpen(true)}>
        <Plus size={14} />
        部屋を追加
      </button>
      <UnitFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        propertyId={propertyId}
      />
    </>
  );
}
