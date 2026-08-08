import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { patientId, fileData, fileName, fileType, uploadedBy, uploaderRole } = await request.json();

    if (!patientId || !fileData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const document = await db.patientDocument.create({
      data: {
        patientId,
        title: fileName,
        fileData,
        fileType
      }
    });

    // Don't send back the full fileData to keep the response small
    return NextResponse.json({ 
      success: true, 
      document: {
        id: document.id,
        title: document.title,
        fileType: document.fileType,
        createdAt: document.createdAt
      } 
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    if (!patientId) {
       return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    // In a real app we'd verify doctorId has an appointment with patientId, but for now we trust the client 
    // as per the rest of the application's auth approach.

    const documents = await db.patientDocument.findMany({
      where: { patientId: patientId },
      orderBy: { createdAt: 'desc' },
      // Include fileData so it can be downloaded/viewed
      select: {
        id: true,
        title: true,
        fileData: true,
        fileType: true,
        createdAt: true
      }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Fetch documents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    await db.patientDocument.delete({
      where: { id: documentId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
