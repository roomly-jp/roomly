"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import PropertyFormModal from "./PropertyFormModal";

interface Owner {
  id: string;
  name: string;
}

interface PropertiesPageClientProps {
  owners: Owner[];
}

export default function PropertiesPageClient({
  owners,
}: PropertiesPageClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="btn-primary" onClick={() => setIsOpen(true)}>
        <Plus size={14} />
        物件を追加
      </button>
      <PropertyFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        owners={owners}
      />
    </>
  );
}
