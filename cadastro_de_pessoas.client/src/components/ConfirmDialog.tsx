import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-80">
        <h3 className="font-bold mb-2">{title}</h3>
        <p className="mb-4 text-sm">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 border rounded">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="px-3 py-1 bg-red-600 text-white rounded">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
