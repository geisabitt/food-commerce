import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Criar um novo produto
export async function POST(req: NextRequest) {
  const { name, price, description, categoryId } = await req.json();

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        category: { connect: { id: categoryId } },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error}, { status: 400 });
  }
}


export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}


export async function PUT(req: NextRequest) {
  const { id, name, price, description, categoryId } = await req.json();

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        category: { connect: { id: categoryId } },
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}


export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  try {
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Produto deletado com sucesso!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
