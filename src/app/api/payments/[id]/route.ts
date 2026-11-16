import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Invoice from '@/models/Invoice';
import mongoose from 'mongoose';

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid payment ID' }, { status: 400 });
    }
    await connectDB();
    const payment = await Payment.findById(id)
      .populate('customer', 'name email')
      .populate('invoice', 'invoiceNumber total status');
    if (!payment) {
      return NextResponse.json({ success: false, message: 'Payment record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: payment }, { status: 200 });
  } catch (error) {
    console.error('Fetch payment error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch payment' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid payment ID' }, { status: 400 });
    }
    await connectDB();
    const body = await req.json();

    const allowedStatuses = ['Successful', 'Failed', 'Pending'];
    if (body.status && !allowedStatuses.includes(body.status)) {
      return NextResponse.json({ success: false, message: 'Invalid payment status' }, { status: 400 });
    }

    const payment = await Payment.findById(id);
    if (!payment) {
      return NextResponse.json({ success: false, message: 'Payment record not found' }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    if (body.status) {
      updates.status = body.status;
      if (body.status === 'Successful') {
        updates.paidAt = new Date();
      }
    }
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.reference !== undefined) updates.reference = body.reference;

    const updatedPayment = await Payment.findByIdAndUpdate(id, updates, { new: true })
      .populate('customer', 'name email')
      .populate('invoice', 'invoiceNumber total status');

    // If marked Successful, ensure associated Invoice is marked Paid
    if (body.status === 'Successful' && payment.invoice) {
      await Invoice.findByIdAndUpdate(payment.invoice, { status: 'Paid' });
    }

    return NextResponse.json(
      { success: true, message: 'Payment status updated successfully', data: updatedPayment },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update payment error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update payment' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid payment ID' }, { status: 400 });
    }
    await connectDB();
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return NextResponse.json({ success: false, message: 'Payment record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Payment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete payment error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete payment' }, { status: 500 });
  }
}
