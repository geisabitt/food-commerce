import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, maxSelect } = await req.json();

    const additionalGroup = await prisma.additionalGroup.create({
      data: { name, maxSelect },
    });

    return NextResponse.json(additionalGroup, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error, message: "Erro ao criar grupo." }, { status: 400 });
  }
}

export async function GET() {
  try {
    const additionalGroups = await prisma.additionalGroup.findMany({
      include: { additional: true },
    });

    return NextResponse.json(additionalGroups, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, message: "Erro ao buscar grupos." }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name , maxSelect } = await req.json();

    const updatedGroup = await prisma.additionalGroup.update({
      where: { id },
      data: { name , maxSelect },
    });

    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, message: "Erro ao atualizar grupo." }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    await prisma.additionalGroup.delete({ where: { id } });

    return NextResponse.json({ message: "Grupo deletado com sucesso." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, message: "Erro ao deletar grupo." }, { status: 400 });
  }
}
