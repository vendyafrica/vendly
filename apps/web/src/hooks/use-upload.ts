import { upload } from "@vercel/blob/client";
import { useCallback, useState } from "react";

export function useUpload() {
    const [isUploading, setIsUploading] = useState(false);

    const uploadFile = useCallback(
        async (file: File, pathPrefix: string): Promise<{ url: string; pathname: string }> => {
            setIsUploading(true);
            try {
                const timestamp = Date.now();
                const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
                const path = `${pathPrefix}/${cleanName}-${timestamp}`;

                const blob = await upload(path, file, {
                    access: "public",
                    handleUploadUrl: "/api/upload",
                });

                return {
                    url: blob.url,
                    pathname: blob.pathname,
                };
            } finally {
                setIsUploading(false);
            }
        },
        []
    );

    return { uploadFile, isUploading };
}
