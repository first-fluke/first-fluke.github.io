import Image, { type ImageProps } from "next/image";
import variants from "@/lib/responsive-image-variants.json";

export function ResponsiveImage({ src, sizes, alt, ...props }: ImageProps & { src: string }) {
  const entry = variants[src as keyof typeof variants];
  if (!entry) return <Image src={src} sizes={sizes} alt={alt} {...props} />;
  return (
    <picture>
      <source type="image/avif" srcSet={entry.srcSet} sizes={sizes} />
      <Image src={src} sizes={sizes} alt={alt} {...props} />
    </picture>
  );
}
