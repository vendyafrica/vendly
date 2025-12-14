import { auth } from "../../lib/auth.js";


//Authenticate Instagram User
export async function authenticateInstagram() {
  const data = await auth.api.signInWithOAuth2({
   body: {
     providerId: "instagram",
   },
  });
  return data;
}

//Get Instagram User Info
export async function getUserInfo(access_token: string) {
     
}
//https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1963347854243280&redirect_uri=https://vendly-api.onrender.com/api/auth/callback/instagram&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights