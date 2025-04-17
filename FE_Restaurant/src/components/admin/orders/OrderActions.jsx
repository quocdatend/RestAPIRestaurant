import React from 'react';
import { MdRemoveRedEye, MdEdit, MdDelete } from 'react-icons/md';

const OrderActions = ({ orderId, onView, onEdit, onDelete }) => {
  return (
    <div className="flex justify-end space-x-2">
      <button
        onClick={() => onView(orderId)}
        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
      >
        <MdRemoveRedEye size={20} />
      </button>
      <button
        onClick={() => onEdit(orderId)}
        className="p-1 text-green-600 hover:bg-green-50 rounded"
      >
        <MdEdit size={20} />
      </button>
      <button
        onClick={() => onDelete(orderId)}
        className="p-1 text-red-600 hover:bg-red-50 rounded"
      >
        <MdDelete size={20} />
      </button>
    </div>
  );
};

export default OrderActions; 