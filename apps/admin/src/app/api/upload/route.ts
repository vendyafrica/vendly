import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
    try {
        const form = await request.formData();
        const file = form.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: true, message: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: true, message: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: true, message: 'File too large. Max size is 5MB' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const filename = `store-assets/${timestamp}.${extension}`;

        // Upload to Vercel Blob
        const blob = await put(filename, file, {
            access: 'public',
        });

        return NextResponse.json({
            error: false,
            data: {
                url: blob.url,
                filename: blob.pathname,
            },
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: true, message: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
