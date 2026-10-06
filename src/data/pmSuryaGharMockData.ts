import { PMSuryaGharCustomerRecord } from '../types';

export const INITIAL_PM_SURYA_GHAR_RECORDS: PMSuryaGharCustomerRecord[] = [
  {
    id: 'PMSG-2026-001',
    customerId: 'CUST-001',
    consumerName: 'Rajesh Patil',
    mobile: '+91 98201 44552',
    alternateMobile: '+91 98201 99887',
    email: 'rajesh.patil@acssolar.in',
    address: 'Bungalow No. 14, Green Valley Enclave, Kothrud',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411038',

    consumerNumber: '028659104823',
    discomName: 'MSEDCL (Maharashtra State Electricity Distribution Co)',
    sanctionedLoadKW: 5,
    proposedCapacityKW: 3,
    estimatedSubsidyAmount: 78000,

    electricityBillUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    electricityBillFileName: 'MSEDCL_Bill_Jan2026_028659104823.pdf',

    aadhaarNumber: '4829 1056 7721',
    aadhaarFrontUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    aadhaarFrontFileName: 'Aadhaar_Card_Front_Rajesh_Patil.jpg',
    aadhaarBackUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    aadhaarBackFileName: 'Aadhaar_Card_Back_Address.jpg',

    sitePhotoUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    sitePhotoFileName: 'Rooftop_RCC_Terrace_Clear_Sunlight.jpg',
    roofType: 'RCC Flat',
    additionalSitePhotos: [
      {
        url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80',
        name: 'Electrical_Distribution_Box_Location.jpg'
      }
    ],

    siteVideoSouthUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    siteVideoSouthFileName: 'Site_Video_South_Facing_180deg_Sweep.mp4',
    videoDuration: '00:32',
    isSouthDirectionConfirmed: true,

    geotag: {
      latitude: 18.5074,
      longitude: 73.8077,
      accuracy: 3.2,
      altitude: 562,
      timestamp: '2026-03-10 11:45:12',
      formattedAddress: 'Green Valley, Kothrud, Pune, Maharashtra 411038',
      compassHeading: 180,
      compassDirection: '180° South (True Azimuth)'
    },

    schemeStatus: 'National Portal Submitted',
    nationalPortalAppNumber: 'PMSURYA/MH/PUN/2026/049182',
    notes: 'South orientation is 100% shadow-free between 9:00 AM and 4:30 PM. 3kW Mono PERC recommended.',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-12',
    franchiseId: 'ACS-MH-01',
    franchiseName: 'ACS Solar Mumbai West',
    submittedBy: 'Rajesh Patil'
  },
  {
    id: 'PMSG-2026-002',
    customerId: 'CUST-002',
    consumerName: 'Amit Saxena',
    mobile: '+91 98101 22334',
    alternateMobile: '+91 98101 44556',
    email: 'amit.saxena@outlook.com',
    address: 'Plot 55, DLF Phase 3',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',

    consumerNumber: 'DHBVN-77402918',
    discomName: 'DHBVN (Dakshin Haryana Bijli Vitran Nigam)',
    sanctionedLoadKW: 4,
    proposedCapacityKW: 2,
    estimatedSubsidyAmount: 60000,

    electricityBillUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    electricityBillFileName: 'DHBVN_ElectricityBill_Feb2026.pdf',

    aadhaarNumber: '8910 4452 3319',
    aadhaarFrontUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    aadhaarFrontFileName: 'Aadhaar_Front_AmitSaxena.jpg',
    aadhaarBackUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    aadhaarBackFileName: 'Aadhaar_Back_DLF_Phase3.jpg',

    sitePhotoUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
    sitePhotoFileName: 'Rooftop_Tin_Shed_Structure.jpg',
    roofType: 'Elevated Metal',

    siteVideoSouthUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    siteVideoSouthFileName: 'Gurugram_Site_Facing_South.mp4',
    videoDuration: '00:24',
    isSouthDirectionConfirmed: true,

    geotag: {
      latitude: 28.4907,
      longitude: 77.0945,
      accuracy: 4.8,
      altitude: 221,
      timestamp: '2026-03-14 14:15:30',
      formattedAddress: 'DLF Phase 3, Gurugram, Haryana 122002',
      compassHeading: 180,
      compassDirection: '180° South (True Azimuth)'
    },

    schemeStatus: 'Documents Ready for Portal',
    nationalPortalAppNumber: 'PMSURYA/HR/GGN/2026/012891',
    notes: 'Client requested elevated structure to preserve terrace recreational space.',
    createdAt: '2026-03-14',
    updatedAt: '2026-03-15',
    franchiseId: 'ACS-DL-02',
    franchiseName: 'ACS Solar Delhi NCR',
    submittedBy: 'Vikram Malhotra'
  }
];
