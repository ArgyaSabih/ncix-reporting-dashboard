# NCIX Reporting Dashboard

Interactive dashboard untuk visualisasi dan analisis data member NCIX (neuCentrIX) di seluruh Indonesia.

## Fitur Utama

### 🗺️ Interactive Map

- **3 Layer Visualisasi:**
  - **Presence Heatmap**: Menampilkan intensitas customer berdasarkan jumlah (merah: tinggi, oranye: sedang, kuning: rendah)
  - **Presence Bubbles**: Ukuran bubble menunjukkan jumlah customer per kota
  - **Trace ASN**: Menampilkan koneksi network antar kota dengan garis putus-putus
- **Legend**: Panduan visual untuk setiap layer di kanan bawah map
- **City Selection**: Klik kota untuk melihat detail spesifik
- **Reset Button**: Kembalikan map dan semua filter ke kondisi awal
- **Popup Dinamis**: Info popup disesuaikan dengan view mode aktif

### 📊 View Modes

#### 1. Facility View (Default)

- Summary per kota dengan breakdown membership (Class A/B/C, Non-Member)
- Chart distribusi membership
- Tabel customer dengan pagination

#### 2. Network View

- Analisis network berdasarkan customer/company
- Top companies per kota atau locations per company
- Click customer di tabel untuk melihat detail network
- Network Summary dengan prioritas: Customer → City → Overall

#### 3. Exchange View

- Overview NCIX Exchange di seluruh Indonesia
- Membership mix dalam persentase
- Top cities berdasarkan jumlah customer

### 📋 Dynamic Panels

**City Summary Panel:**

- Facility: Breakdown membership per kota
- Network: Info companies dan connections (dengan prioritas customer selection)
- Exchange: Distribusi membership dalam persentase

**Analytics Panel:**

- Facility: Membership mix chart
- Network: Top companies atau locations chart
- Exchange: Top cities chart

**Data Table Panel:**

- Pagination otomatis (15 items per page)
- Reset ke halaman 1 saat city berubah
- Network view: Clickable rows untuk customer details
- Facility & Exchange: Read-only table

### ✨ Interaktivitas

- Semua panel merespons city selection dari map
- Network view mendukung customer selection
- Popup tooltip otomatis close saat reset
- Smooth map animation saat zoom ke kota
- View mode dan layer dapat dikombinasikan sesuai kebutuhan

## Teknologi

- **Next.js 15** - React framework
- **React Leaflet** - Interactive maps
- **Tailwind CSS** - Styling
- **Dynamic data processing** - Real-time filtering dan grouping

## How To Run

Install all dependencies and run the development server using this command

- **yarn** (recommended)

  ```bash
  yarn install
  yarn dev
  ```

- **npm**

  ```bash
  npm i
  npm run dev
  ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Source

Dashboard menggunakan data dari `src/data/processed/members-latest.json` yang diproses dari CSV member NCIX dengan informasi:

- Customer name
- Location & coordinates
- Membership type (Class A/B/C, Non-Member)
- Regional distribution

## Project Structure

```
src/
├── components/
│   ├── dashboard/      # Map, panels, dan komponen utama
│   └── layout/         # Header, Sidebar
├── data/
│   ├── processed/      # JSON data yang sudah diproses
│   └── raw/            # CSV dan JSON mentah
├── hooks/              # Custom React hooks
└── utils/              # Helper functions
```

## 📊 Data Flow Documentation

Untuk memahami alur proses data dalam aplikasi ini secara detail, lihat dokumentasi flowchart lengkap:

👉 **[Flowchart Proses Data](docs/FLOWCHART.md)**

Dokumentasi ini mencakup:
- Alur lengkap dari upload CSV hingga visualisasi UI
- Flowchart detail untuk setiap tahapan proses
- Penjelasan state management dan user interactions
- Data transformation dan filtering logic
- Sequence diagram untuk real-time updates
