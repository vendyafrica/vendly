"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function InstagramCallbackPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("")
    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get("code")
            const error = searchParams.get("error")
            const errorDescription = searchParams.get("error_description")

            if (error) {
                setStatus("error")
                setMessage(errorDescription || "Instagram authentication failed")
                return
            }

            if (!code) {
                setStatus("error")
                setMessage("No authorization code received")
                return
            }

            try {
                const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

                // 1) Exchange authorization code for long-lived token on the backend
                const exchangeRes = await fetch(`${backendUrl}/auth/instagram/exchange`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code })
                });

                if (!exchangeRes.ok) {
                    const err = await exchangeRes.json().catch(() => ({}));
                    throw new Error(err?.error || "Failed to exchange Instagram code");
                }

                const exchange = await exchangeRes.json();
                const userId = exchange?.data?.user_id;

                // 2) Fetch the profile to confirm the token works
                const profileUrl = `${backendUrl}/me${userId ? `?user_id=${encodeURIComponent(userId)}` : ""}`;
                const profileRes = await fetch(profileUrl);
                if (!profileRes.ok) {
                    const err = await profileRes.json().catch(() => ({}));
                    throw new Error(err?.error || "Failed to fetch profile");
                }

                const data = await profileRes.json();
                setProfile(data.profile);
                setStatus("success");
                setMessage("Successfully authenticated with Instagram!");

                // Redirect to home after 3 seconds
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            } catch (error: any) {
                setStatus("error");
                setMessage(error?.message || "Failed to complete authentication");
            }
        }

        handleCallback()
    }, [searchParams, router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md space-y-6">
                {status === "loading" && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold">Completing Instagram Login...</h2>
                        <p className="text-gray-600 mt-2">Please wait while we authenticate your account</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="text-center">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-green-700 mb-2">Success!</h2>
                            <p className="text-green-600 mb-4">{message}</p>
                            
                            {profile && (
                                <div className="bg-white rounded-lg p-4 mt-4 text-left">
                                    <h3 className="font-semibold mb-2">Your Instagram Profile:</h3>
                                    <div className="space-y-1 text-sm">
                                        <p><span className="font-medium">Username:</span> @{profile.username}</p>
                                        <p><span className="font-medium">Account Type:</span> {profile.account_type}</p>
                                        <p><span className="font-medium">Media Count:</span> {profile.media_count}</p>
                                    </div>
                                </div>
                            )}
                            
                            <p className="text-sm text-gray-500 mt-4">Redirecting to home...</p>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="text-center">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-red-700 mb-2">Authentication Failed</h2>
                            <p className="text-red-600 mb-4">{message}</p>
                            <button
                                onClick={() => router.push("/login")}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}