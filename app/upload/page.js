"use client";

import DataUploader from "@/src/components/dashboard/DataUploader";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function AdminPage() {
  const router = useRouter();
  const [uploadResult, setUploadResult] = useState(null);

  const handleUploadSuccess = (result) => {
    setUploadResult(result);

    // Optional: redirect to dashboard after successful upload
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Data CSV</h2>
          <Link href="/">
            <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors">
              Kembali ke Dashboard
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Data CSV Member NCIX</h2>
          <p className="text-gray-600 mb-6">
            Upload file CSV untuk memperbarui data member NCIX. File akan diproses secara otomatis dan data
            dashboard akan terupdate.
          </p>

          <DataUploader onUploadSuccess={handleUploadSuccess} />

          {uploadResult && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-semibold text-green-800 mb-2">Upload Berhasil!</h3>
              <p className="text-green-700">{uploadResult.statistics.processed} data berhasil diproses.</p>
              <p className="text-sm text-green-600 mt-2">File output: {uploadResult.outputFile}</p>
              <p className="text-sm text-green-600 mt-1">Mengalihkan ke dashboard...</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Informasi</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• File harus dalam format CSV</li>
            <li>• Kolom yang diperlukan: PERIOD, CUSTOMER, LOCATION_DC, MEMBERSHIP_NCIX</li>
            <li>• Data akan otomatis diproses dan tersimpan di folder processed/</li>
            <li>• Dashboard akan otomatis menggunakan data terbaru setelah upload</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
