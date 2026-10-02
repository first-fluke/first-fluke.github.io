import SocialPreviewImage from "@/components/site/social-preview-image";

export const dynamic = "force-static";

export async function GET() {
  return SocialPreviewImage();
}
