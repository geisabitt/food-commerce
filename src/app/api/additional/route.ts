import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, price, additionalGroupId } = await req.json();

    const additional = await prisma.additional.create({
      data: { name, price, additionalGroupId },
    });

    return NextResponse.json(additional, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao criar adicional." , error}, { status: 400 });
  }
}

export async function GET() {
  try {
    const additionals = await prisma.additional.findMany({
      include: { additionalGroup: true },
    });

    return NextResponse.json(additionals, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar adicional." , error}, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, price, additionalGroupId, isActive } = await req.json();

    const updatedAdditional = await prisma.additional.update({
      where: { id },
      data: { name, price, additionalGroupId, isActive },
    });

    return NextResponse.json(updatedAdditional, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao atualizar adicional." , error}, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    await prisma.additional.delete({ where: { id } });

    return NextResponse.json({ message: "Adicional deletado com sucesso." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao deletar adicional." , error}, { status: 400 });
  }
}
