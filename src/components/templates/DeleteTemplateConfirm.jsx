import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function DeleteTemplateConfirm({
  isOpen,
  onClose,
  template,
  onConfirm,
}) {
  if (!template) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="DELETE TEMPLATE">
      <div className="text-center mb-5">
        <div className="text-5xl mb-3">🗑️</div>
        <p className="text-white font-semibold text-sm">
          Delete "{template.name}"?
        </p>
      </div>

      <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
        <p className="text-red-400 text-xs">
          ⚠️ This template will be permanently removed. Habits already created
          from it will not be affected.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="danger"
          onClick={() => {
            onConfirm(template._id);
            onClose();
          }}
          className="flex-1"
        >
          Delete Template
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
