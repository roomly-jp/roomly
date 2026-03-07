"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import TenantFormModal from "./TenantFormModal";

export default function TenantsPageClient() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="btn-primary" onClick={() => setIsOpen(true)}>
        <Plus size={14} />
        入居者を追加
      </button>
      <TenantFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
