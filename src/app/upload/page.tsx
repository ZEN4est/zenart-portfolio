import DirectUploaderClient from "./DirectUploaderClient";
import AdminLockGate from "@/components/AdminLockGate";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function UploadPage() {
  return (
    <AdminLockGate title="Uploader Plików Serwera">
      <DirectUploaderClient />
    </AdminLockGate>
  );
}
