import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DeliveryForm from '../components/DeliveryForm';

describe('DeliveryForm Component', () => {
  it('validates required fields', () => {
    const handleSubmit = vi.fn();
    render(<DeliveryForm onSubmit={handleSubmit} />);

    const button = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(button);

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits correctly with valid data', () => {
    const handleSubmit = vi.fn();
    render(<DeliveryForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByPlaceholderText(/who is this for/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/where should we deliver/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText(/how can we reach you/i), { target: { value: '1234567890' } });

    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      deliveryName: 'John Doe',
      deliveryAddress: '123 Main St',
      deliveryPhone: '1234567890',
      notes: ''
    });
  });
});
