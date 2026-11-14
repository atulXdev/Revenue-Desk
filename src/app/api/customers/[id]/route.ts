import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import mongoose from "mongoose";

type props = {
    params: Promise<{id: string}>
}

export async function PUT(
    req: Request,
    {params}: props
){
    try{
        const {id} = await params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return NextResponse.json(
                {success: false,
                    message: "Invalid customer ID"
                },
                {status: 400}
            )
        }

        await connectDB();

        const body = await req.json();

        const customer = await Customer.findByIdAndUpdate(
            id,
            {
                name: body.name,
                email: body.email,
                phone: body.phone,
                address: body.address
            },
            {
                new: true,
                runValidators: true
            }
        );

        if(!customer){
            return NextResponse.json(
                {
                    success: false,
                    message: "Customer not found"
                },
                {status: 404}
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Customer update successfully",
                data: customer
            },
            {status: 200}
        )
    }
    catch(error){
        console.error("Customer update error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update customer"
            },
            {status: 500}
        )
    }
}

export async function DELETE(
    req: Request,
    {params}: props
){
    try{
        const {id} = await params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid customer Id",
                },
                {status: 400}
            )
        }

        await connectDB();

        const customer = await Customer.findByIdAndDelete(id);

        if(!customer){
            return NextResponse.json(
                {
                    success: false,
                    message: "customer not found"
                },
                {status: 404}
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Customer deleted successfully"
            },
            {status: 200}
        )
    }
    catch(error){
        console.error("Customer deletion error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete customer"
            },
            {status: 500}
        )
    }
}
