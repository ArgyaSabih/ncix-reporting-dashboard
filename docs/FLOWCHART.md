# Flowchart Proses Data - NCIX Reporting Dashboard

Dokumen ini menjelaskan alur proses data dalam aplikasi NCIX Reporting Dashboard, dari upload data CSV hingga visualisasi di UI.

## 📊 Overview Arsitektur

Aplikasi ini menggunakan arsitektur **Next.js dengan Client-Side State Management** dan **Server-Side API**. Data mengalir melalui beberapa tahap:

1. **Data Ingestion** (Upload CSV)
2. **Data Processing** (Validasi & Transformasi)
3. **Data Storage** (File System JSON)
4. **Data Retrieval** (API Endpoints)
5. **State Management** (React Context & Hooks)
6. **UI Rendering** (Components)

---

## 🔄 Flowchart Utama - Complete Data Flow

```mermaid
flowchart TD
    Start([User Uploads CSV]) --> Upload[Upload via DataUploader Component]
    Upload --> API1[POST /api/upload]
    
    API1 --> Validate{Validate Headers}
    Validate -->|Invalid| Error1[Return Error: Missing Columns]
    Validate -->|Valid| Parse[Parse CSV Content]
    
    Parse --> Normalize[Normalize Locations]
    Normalize --> MatchCoords[Match with LOCATION_COORDINATES Config]
    MatchCoords --> Classify[Classify Membership Types]
    Classify --> GenStats[Generate Statistics]
    
    GenStats --> Save[Save to File System]
    Save --> Save1[members-timestamp.json]
    Save --> Save2[members-latest.json]
    
    Save2 --> Ready([Data Ready for Consumption])
    
    Ready --> UserAction{User Action}
    
    UserAction -->|Load Dashboard| LoadData[GET /api/data/members]
    LoadData --> FetchJSON[Fetch members-latest.json + facilities.json]
    FetchJSON --> ReturnData[Return Combined Data Object]
    
    ReturnData --> Hook1[useMemberData Hook]
    Hook1 --> Context[PeriodFilterProvider Context]
    
    Context --> Filter[Filter Members by Period]
    Filter --> Transform[Transform & Group Data]
    
    Transform --> Components{Which Component?}
    
    Components -->|Map| MapComp[MemberMap Component]
    Components -->|Summary| SummaryComp[CitySummary Component]
    Components -->|Chart| ChartComp[MembershipChart Component]
    Components -->|Table| TableComp[DataTable Component]
    
    MapComp --> Render1[Render Leaflet Map<br/>with Heatmap/Bubbles]
    SummaryComp --> Render2[Render City Statistics<br/>& Membership Breakdown]
    ChartComp --> Render3[Render Membership<br/>Distribution Chart]
    TableComp --> Render4[Render Paginated<br/>Member List]
    
    Render1 --> UI([User Sees Dashboard])
    Render2 --> UI
    Render3 --> UI
    Render4 --> UI
    
    UI -->|Select Period| PeriodChange[Update PeriodFilterContext]
    PeriodChange --> Filter
    
    UI -->|Click City on Map| CitySelect[Update selectedCity State]
    CitySelect --> Transform
    
    UI -->|Click Customer| CustomerSelect[Update selectedCustomer State]
    CustomerSelect --> Transform
    
    UI -->|Toggle Layers| LayerToggle[Update activeLayers State]
    LayerToggle --> MapComp
    
    UI -->|Upload New CSV| Upload
```

---

## 📥 Flowchart Detail 1: Data Ingestion & Processing

```mermaid
flowchart TD
    A([User Uploads CSV File]) --> B[DataUploader Component]
    B --> C[POST /api/upload]
    
    C --> D{Check Required Headers}
    D -->|Missing: PERIOD| E1[Error: Missing PERIOD]
    D -->|Missing: CUSTOMER| E2[Error: Missing CUSTOMER]
    D -->|Missing: LOCATION_DC| E3[Error: Missing LOCATION_DC]
    D -->|Missing: MEMBERSHIP_NCIX| E4[Error: Missing MEMBERSHIP_NCIX]
    D -->|All Present| F[Parse CSV Rows]
    
    F --> G[For Each Row]
    
    G --> H[Normalize Location Name]
    H --> I[Match with LOCATION_COORDINATES]
    I --> J{Location Found?}
    J -->|No| K[Skip Row / Log Warning]
    J -->|Yes| L[Get Coordinates<br/>lat, lng, city, region]
    
    L --> M[Classify Membership]
    M --> N{Membership Type}
    N -->|CLASS A| O1[membershipType: 'Class A']
    N -->|CLASS B| O2[membershipType: 'Class B']
    N -->|CLASS C| O3[membershipType: 'Class C']
    N -->|Member| O4[membershipType: 'Member']
    N -->|Non-Member| O5[membershipType: 'Non-Member']
    
    O1 --> P[Add to processedData Array]
    O2 --> P
    O3 --> P
    O4 --> P
    O5 --> P
    
    P --> Q{More Rows?}
    Q -->|Yes| G
    Q -->|No| R[Generate Statistics]
    
    R --> S[Calculate Total Records]
    S --> T[Count by Membership Type]
    T --> U[Count by Location]
    U --> V[Count by Region]
    
    V --> W[Create Metadata Object]
    W --> X[Save members-timestamp.json]
    X --> Y[Save members-latest.json]
    Y --> Z([Processing Complete])
```

---

## 🔍 Flowchart Detail 2: Data Retrieval & Loading

```mermaid
flowchart TD
    A([Dashboard Page Loads]) --> B[app/page.js Renders]
    B --> C[useMemberData Hook Executes]
    
    C --> D[useEffect Triggered]
    D --> E[Fetch GET /api/data/members]
    
    E --> F[API Route Handler]
    F --> G[Read members-latest.json]
    G --> H[Read facilities.json]
    
    H --> I[Combine Data]
    I --> J{Data Valid?}
    J -->|No| K[Return Error Response]
    J -->|Yes| L[Return JSON Response]
    
    L --> M[Hook Receives Data]
    M --> N[Update State: data, loading, error]
    
    N --> O[PeriodFilterProvider Context]
    O --> P{Period Selected?}
    P -->|No| Q[Use All Data]
    P -->|Yes| R[Filter by selectedPeriod]
    
    Q --> S[Pass to Components]
    R --> S
    
    S --> T[Components Subscribe to Context]
    T --> U([Data Available in Components])
```

---

## 🎯 Flowchart Detail 3: State Management & User Interactions

```mermaid
flowchart TD
    A([User Interaction]) --> B{Action Type}
    
    B -->|Select Period| C1[Click Period Dropdown in Header]
    C1 --> C2[setSelectedPeriod in Context]
    C2 --> C3[PeriodFilterContext Updates]
    C3 --> C4[All Consumer Components Re-render]
    C4 --> C5[filterMembersByPeriod Executed]
    C5 --> C6[Deduplicate by customer+location]
    C6 --> C7[Keep Newest Period Entry]
    C7 --> C8([UI Updates with Filtered Data])
    
    B -->|Click City| D1[Click on Map Marker/City]
    D1 --> D2[onCityClick Handler]
    D2 --> D3[setSelectedCity State]
    D3 --> D4[State Updates in app/page.js]
    D4 --> D5[Props Passed to Child Components]
    D5 --> D6{Which Component?}
    D6 -->|CitySummary| D7[Shows City-Specific Stats]
    D6 -->|DataTable| D8[Filters Table by City]
    D6 -->|MembershipChart| D9[Shows City Membership Mix]
    D7 --> D10([UI Shows City Details])
    D8 --> D10
    D9 --> D10
    
    B -->|Click Customer| E1[Click Row in DataTable]
    E1 --> E2[onCustomerClick Handler]
    E2 --> E3[setSelectedCustomer State]
    E3 --> E4[State Updates in app/page.js]
    E4 --> E5[Props Passed to NetworkView]
    E5 --> E6[Show Customer Network Details]
    E6 --> E7([UI Shows Customer Info])
    
    B -->|Toggle Layer| F1[Click Layer Toggle Button]
    F1 --> F2[Update activeLayers Array]
    F2 --> F3[State Updates]
    F3 --> F4[MemberMap Component Re-renders]
    F4 --> F5{Layer Active?}
    F5 -->|Heatmap| F6[Show Heatmap Overlay]
    F5 -->|Bubbles| F7[Show Bubble Markers]
    F5 -->|Trace ASN| F8[Show Network Lines]
    F6 --> F9([Map Layer Updates])
    F7 --> F9
    F8 --> F9
    
    B -->|Reset| G1[Click Reset Button]
    G1 --> G2[Clear selectedCity]
    G2 --> G3[Clear selectedCustomer]
    G3 --> G4[Reset Map Zoom]
    G4 --> G5([Dashboard Returns to Initial State])
```

---

## 🧮 Flowchart Detail 4: Data Transformation & Filtering

```mermaid
flowchart TD
    A([Raw Members Data]) --> B[filterMembersByPeriod]
    
    B --> C[Group by customer + location]
    C --> D[Sort by period DESC]
    D --> E[Take first entry per group]
    E --> F([Deduplicated Members])
    
    F --> G{View Mode}
    
    G -->|Facility View| H1[groupByLocation]
    H1 --> H2[Group members by location code]
    H2 --> H3[Count total per location]
    H3 --> H4[Count by membership type]
    H4 --> H5[Calculate percentages]
    H5 --> H6([Location Statistics])
    
    G -->|Network View| I1[groupByCustomer or Company]
    I1 --> I2[Aggregate customer locations]
    I2 --> I3[Count connections]
    I3 --> I4[List unique cities]
    I4 --> I5([Network Statistics])
    
    G -->|Exchange View| J1[getLocationStats]
    J1 --> J2[Calculate membership mix]
    J2 --> J3[Get top N cities]
    J3 --> J4[Calculate percentages]
    J4 --> J5([Exchange Statistics])
    
    H6 --> K[prepareMapMarkers]
    I5 --> K
    J5 --> K
    
    K --> L[Convert to Leaflet Format]
    L --> M{Selected City?}
    M -->|Yes| N[Filter markers by city]
    M -->|No| O[Show all markers]
    N --> P([Map Markers Ready])
    O --> P
    
    P --> Q[Pass to Components]
    Q --> R[MemberMap renders markers]
    Q --> S[CitySummary shows stats]
    Q --> T[DataTable shows filtered list]
    Q --> U[MembershipChart shows distribution]
    
    R --> V([UI Rendered])
    S --> V
    T --> V
    U --> V
```

---

## 🗂️ Data Structure Flow

### Input (CSV Format)
```
PERIOD, CUSTOMER, LOCATION_DC, MEMBERSHIP_NCIX
202401, PT ABC, JAKARTA, Class A
202401, PT XYZ, SURABAYA, Member
```

### After Processing (JSON)
```json
{
  "metadata": {
    "processedAt": "2024-01-15T10:30:00Z",
    "sourceFile": "members.csv",
    "totalRecords": 150,
    "statistics": {
      "byMembershipType": { "Class A": 50, "Class B": 30, ... },
      "byLocation": { "JAKARTA": 70, "SURABAYA": 40, ... },
      "byRegion": { "Jabodetabek": 100, "Jawa": 30, ... }
    }
  },
  "locations": [
    { "name": "JAKARTA", "lat": -6.2088, "lng": 106.8456, "city": "Jakarta", "region": "Jabodetabek" }
  ],
  "members": [
    {
      "period": "202401",
      "customer": "PT ABC",
      "location": "JAKARTA",
      "locationDisplay": "Jakarta",
      "region": "Jabodetabek",
      "latitude": -6.2088,
      "longitude": 106.8456,
      "membershipType": "Class A"
    }
  ]
}
```

### After Context Filter (React State)
```javascript
{
  members: [...], // filtered by selectedPeriod
  selectedCity: { city: "Jakarta", region: "Jabodetabek", ... },
  selectedCustomer: { customer: "PT ABC", ... },
  activeLayers: ["heatmap", "bubbles"],
  viewMode: "facility"
}
```

---

## 🔑 Key Components & Responsibilities

| Component | Input | Processing | Output |
|-----------|-------|------------|--------|
| **DataUploader** | CSV file | Upload to API | Success/Error message |
| **API /upload** | CSV content | Validate, parse, normalize, classify | Saved JSON files |
| **API /data/members** | - | Read JSON files | Combined data object |
| **useMemberData** | API endpoint | Fetch & cache | { data, loading, error } |
| **PeriodFilterProvider** | Selected period | Filter members | Filtered data to consumers |
| **MemberMap** | Members, layers | Group by location, render map | Map visualization |
| **CitySummary** | Selected city, members | Calculate stats | Statistics display |
| **DataTable** | Members, filters | Paginate & filter | Table rows |
| **MembershipChart** | Members | Aggregate by type | Chart visualization |

---

## 🎨 View Modes & Data Display

### Facility View
1. **Data Source**: All members filtered by period & city
2. **Processing**: Group by location → Count by membership type
3. **Display**:
   - Map: Heatmap/bubbles by member count
   - Summary: Total members, breakdown by Class A/B/C
   - Chart: Membership distribution pie/bar chart
   - Table: List of all members with pagination

### Network View
1. **Data Source**: Members filtered by customer & city
2. **Processing**: Group by customer/company → Count connections
3. **Display**:
   - Map: Network trace lines between cities
   - Summary: Company info, connection count, unique cities
   - Chart: Top companies by member count or locations
   - Table: Clickable customer rows for detail view

### Exchange View
1. **Data Source**: All members across Indonesia
2. **Processing**: Aggregate statistics nationwide
3. **Display**:
   - Map: Overall distribution heatmap
   - Summary: Total members, membership mix in percentages
   - Chart: Top cities by member count
   - Table: Summary statistics (read-only)

---

## 🔄 Real-time Update Flow

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant Context
    participant Hook
    participant API
    participant FileSystem
    
    User->>Component: Upload CSV
    Component->>API: POST /api/upload
    API->>FileSystem: Parse & Save JSON
    FileSystem-->>API: Success
    API-->>Component: Upload Complete
    Component->>Hook: Trigger refetch()
    Hook->>API: GET /api/data/members
    API->>FileSystem: Read members-latest.json
    FileSystem-->>API: JSON Data
    API-->>Hook: Data Response
    Hook->>Context: Update Data State
    Context-->>Component: Notify Consumers
    Component-->>User: Dashboard Updates
    
    User->>Component: Select Period
    Component->>Context: setSelectedPeriod()
    Context->>Context: Filter Members
    Context-->>Component: Filtered Data
    Component-->>User: UI Updates
    
    User->>Component: Click City
    Component->>Component: setSelectedCity()
    Component->>Component: Re-render Children
    Component-->>User: Show City Details
```

---

## 📊 Performance Considerations

1. **Data Caching**: `useMemberData` caches API response until manual refetch
2. **Deduplication**: `filterMembersByPeriod` removes duplicate entries
3. **Lazy Loading**: Components only process data when rendered
4. **Pagination**: DataTable limits to 15 items per page
5. **Memoization**: Map markers only recalculate on data/filter changes

---

## 🔐 Data Validation Rules

### CSV Upload Validation
- ✅ Required columns: PERIOD, CUSTOMER, LOCATION_DC, MEMBERSHIP_NCIX
- ✅ Period format: YYYYMM (e.g., 202401)
- ✅ Location must match LOCATION_COORDINATES config
- ✅ Membership type must be valid classification

### Location Normalization
```javascript
Input: "jakarta", "JAKARTA", "Jakarta DC"
↓
Normalized: "JAKARTA"
↓
Matched: { name: "JAKARTA", lat: -6.2088, lng: 106.8456 }
```

### Membership Classification
```javascript
Input: "CLASS A NCIX", "Class A", "NCIX CLASS-A"
↓
Classified: "Class A"

Input: "Member NCIX", "member"
↓
Classified: "Member"

Input: "Non Member", "Non-member"
↓
Classified: "Non-Member"
```

---

## 📝 Summary

Aplikasi NCIX Reporting Dashboard mengimplementasikan alur data yang terstruktur:

1. **Upload** → CSV diunggah oleh user
2. **Process** → API memvalidasi, menormalisasi, dan menyimpan sebagai JSON
3. **Retrieve** → React hooks mengambil data via API
4. **Filter** → Context menyaring berdasarkan period
5. **Transform** → Utils mengelompokkan dan mengagregasi data
6. **Render** → Components menampilkan visualisasi interaktif

Setiap interaksi user memicu update state yang cascading melalui component tree, memastikan UI selalu sinkron dengan data terbaru.
