import DirectUploaderClient from "./DirectUploaderClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function UploadPage() {
  return <DirectUploaderClient />;
}
