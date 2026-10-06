/**
 * Comprehensive Registry of Indian Electricity Distribution Companies (DISCOMs)
 * Mapped across all 28 States and 8 Union Territories.
 */

export interface DiscomInfo {
  code: string;
  name: string;
  fullName: string;
  state: string;
  type: 'State Gov' | 'Private' | 'Central/Joint';
  majorCoverageCities?: string[];
}

export const STATE_DISCOMS_MAP: Record<string, DiscomInfo[]> = {
  "Maharashtra": [
    {
      code: 'MSEDCL',
      name: 'MSEDCL (Mahavitaran)',
      fullName: 'Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)',
      state: 'Maharashtra',
      type: 'State Gov',
      majorCoverageCities: ['Pune', 'Thane', 'Navi Mumbai', 'Nashik', 'Nagpur', 'Aurangabad', 'Kolhapur', 'Solapur', 'All Maharashtra (excl. Mumbai Island)']
    },
    {
      code: 'TATA_MUMBAI',
      name: 'Tata Power - Mumbai',
      fullName: 'The Tata Power Company Limited (Mumbai Distribution)',
      state: 'Maharashtra',
      type: 'Private',
      majorCoverageCities: ['Mumbai City', 'Mumbai Suburban', 'Bandra', 'Andheri', 'Borivali', 'Chembur']
    },
    {
      code: 'AEML',
      name: 'Adani Electricity Mumbai (AEML)',
      fullName: 'Adani Electricity Mumbai Limited',
      state: 'Maharashtra',
      type: 'Private',
      majorCoverageCities: ['Mumbai Suburban', 'Western Suburbs', 'Eastern Suburbs', 'Mira-Bhayandar']
    },
    {
      code: 'BEST',
      name: 'BEST Undertaking',
      fullName: 'Brihanmumbai Electric Supply & Transport Undertaking',
      state: 'Maharashtra',
      type: 'State Gov',
      majorCoverageCities: ['Mumbai City (Colaba to Sion/Mahim)', 'South Mumbai', 'Central Mumbai']
    },
    {
      code: 'TORRENT_BHIWANDI',
      name: 'Torrent Power (Bhiwandi / Shil-Mumbra-Kalwa)',
      fullName: 'Torrent Power Limited - Maharashtra Franchises',
      state: 'Maharashtra',
      type: 'Private',
      majorCoverageCities: ['Bhiwandi', 'Mumbra', 'Kalwa', 'Shil']
    }
  ],

  "Delhi": [
    {
      code: 'BRPL',
      name: 'BSES Rajdhani Power (BRPL)',
      fullName: 'BSES Rajdhani Power Limited',
      state: 'Delhi',
      type: 'Private',
      majorCoverageCities: ['South Delhi', 'West Delhi', 'Dwarka', 'Saket', 'Janakpuri', 'Najafgarh', 'Nehru Place']
    },
    {
      code: 'BYPL',
      name: 'BSES Yamuna Power (BYPL)',
      fullName: 'BSES Yamuna Power Limited',
      state: 'Delhi',
      type: 'Private',
      majorCoverageCities: ['Central Delhi', 'East Delhi', 'Chandni Chowk', 'Laxmi Nagar', 'Shahdara', 'Daryaganj']
    },
    {
      code: 'TPDDL',
      name: 'Tata Power Delhi (TPDDL)',
      fullName: 'Tata Power Delhi Distribution Limited',
      state: 'Delhi',
      type: 'Private',
      majorCoverageCities: ['North Delhi', 'North West Delhi', 'Rohini', 'Pitampura', 'Civil Lines', 'Narela']
    },
    {
      code: 'NDMC',
      name: 'NDMC Electricity',
      fullName: 'New Delhi Municipal Council - Power Supply',
      state: 'Delhi',
      type: 'State Gov',
      majorCoverageCities: ['Lutyens Delhi', 'Connaught Place', 'Chanakyapuri']
    },
    {
      code: 'MES_DELHI',
      name: 'MES (Delhi Cantt)',
      fullName: 'Military Engineer Services - Delhi Cantonment',
      state: 'Delhi',
      type: 'Central/Joint',
      majorCoverageCities: ['Delhi Cantonment']
    }
  ],

  "Delhi (NCT)": [
    {
      code: 'BRPL',
      name: 'BSES Rajdhani Power (BRPL)',
      fullName: 'BSES Rajdhani Power Limited',
      state: 'Delhi (NCT)',
      type: 'Private',
      majorCoverageCities: ['South Delhi', 'West Delhi', 'Dwarka', 'Saket']
    },
    {
      code: 'BYPL',
      name: 'BSES Yamuna Power (BYPL)',
      fullName: 'BSES Yamuna Power Limited',
      state: 'Delhi (NCT)',
      type: 'Private',
      majorCoverageCities: ['Central Delhi', 'East Delhi', 'Shahdara']
    },
    {
      code: 'TPDDL',
      name: 'Tata Power Delhi (TPDDL)',
      fullName: 'Tata Power Delhi Distribution Limited',
      state: 'Delhi (NCT)',
      type: 'Private',
      majorCoverageCities: ['North Delhi', 'North West Delhi', 'Rohini', 'Pitampura']
    },
    {
      code: 'NDMC',
      name: 'NDMC Electricity',
      fullName: 'New Delhi Municipal Council',
      state: 'Delhi (NCT)',
      type: 'State Gov',
      majorCoverageCities: ['Connaught Place', 'Chanakyapuri']
    }
  ],

  "Haryana": [
    {
      code: 'DHBVN',
      name: 'DHBVN (Dakshin Haryana)',
      fullName: 'Dakshin Haryana Bijli Vitran Nigam',
      state: 'Haryana',
      type: 'State Gov',
      majorCoverageCities: ['Gurugram', 'Faridabad', 'Hisar', 'Bhiwani', 'Sirsa', 'Rewari', 'Palwal', 'Narnaul']
    },
    {
      code: 'UHBVN',
      name: 'UHBVN (Uttar Haryana)',
      fullName: 'Uttar Haryana Bijli Vitran Nigam',
      state: 'Haryana',
      type: 'State Gov',
      majorCoverageCities: ['Panchkula', 'Ambala', 'Yamunanagar', 'Kurukshetra', 'Karnal', 'Panipat', 'Sonipat', 'Rohtak']
    }
  ],

  "Karnataka": [
    {
      code: 'BESCOM',
      name: 'BESCOM (Bengaluru)',
      fullName: 'Bangalore Electricity Supply Company Limited',
      state: 'Karnataka',
      type: 'State Gov',
      majorCoverageCities: ['Bengaluru Urban', 'Bengaluru Rural', 'Ramanagara', 'Kolar', 'Chikkaballapura', 'Tumakuru', 'Davanagere', 'Chitradurga']
    },
    {
      code: 'MESCOM',
      name: 'MESCOM (Mangaluru)',
      fullName: 'Mangalore Electricity Supply Company Limited',
      state: 'Karnataka',
      type: 'State Gov',
      majorCoverageCities: ['Dakshina Kannada', 'Udupi', 'Shivamogga', 'Chikkamagaluru']
    },
    {
      code: 'HESCOM',
      name: 'HESCOM (Hubballi-Dharwad)',
      fullName: 'Hubli Electricity Supply Company Limited',
      state: 'Karnataka',
      type: 'State Gov',
      majorCoverageCities: ['Dharwad', 'Belagavi', 'Vijayapura', 'Bagalkote', 'Gadag', 'Haveri', 'Uttara Kannada']
    },
    {
      code: 'GESCOM',
      name: 'GESCOM (Kalaburagi)',
      fullName: 'Gulbarga Electricity Supply Company Limited',
      state: 'Karnataka',
      type: 'State Gov',
      majorCoverageCities: ['Kalaburagi', 'Ballari', 'Raichur', 'Koppal', 'Yadgir', 'Bidar', 'Vijayanagara']
    },
    {
      code: 'CHESCOM',
      name: 'CHESCOM (Mysuru)',
      fullName: 'Chamundeshwari Electricity Supply Corporation Limited',
      state: 'Karnataka',
      type: 'State Gov',
      majorCoverageCities: ['Mysuru', 'Mandya', 'Chamarajanagar', 'Hassan', 'Kodagu']
    }
  ],

  "Gujarat": [
    {
      code: 'DGVCL',
      name: 'DGVCL (Dakshin Gujarat)',
      fullName: 'Dakshin Gujarat Vij Company Limited',
      state: 'Gujarat',
      type: 'State Gov',
      majorCoverageCities: ['Surat Rural', 'Navsari', 'Valsad', 'Tapi', 'Dang', 'Bharuch', 'Narmada']
    },
    {
      code: 'MGVCL',
      name: 'MGVCL (Madhya Gujarat)',
      fullName: 'Madhya Gujarat Vij Company Limited',
      state: 'Gujarat',
      type: 'State Gov',
      majorCoverageCities: ['Vadodara', 'Anand', 'Kheda', 'Panchmahal', 'Dahod', 'Mahisagar', 'Chhota Udepur']
    },
    {
      code: 'PGVCL',
      name: 'PGVCL (Paschim Gujarat)',
      fullName: 'Paschim Gujarat Vij Company Limited',
      state: 'Gujarat',
      type: 'State Gov',
      majorCoverageCities: ['Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Kutch', 'Amreli', 'Surendranagar', 'Morbi', 'Porbandar']
    },
    {
      code: 'UGVCL',
      name: 'UGVCL (Uttar Gujarat)',
      fullName: 'Uttar Gujarat Vij Company Limited',
      state: 'Gujarat',
      type: 'State Gov',
      majorCoverageCities: ['Ahmedabad Rural', 'Gandhinagar Rural', 'Mehsana', 'Patan', 'Banaskantha', 'Sabarkantha', 'Aravalli']
    },
    {
      code: 'TORRENT_GUJARAT',
      name: 'Torrent Power (Ahmedabad / Gandhinagar / Surat)',
      fullName: 'Torrent Power Limited (Gujarat Operations)',
      state: 'Gujarat',
      type: 'Private',
      majorCoverageCities: ['Ahmedabad City', 'Gandhinagar City', 'Surat City']
    }
  ],

  "Uttar Pradesh": [
    {
      code: 'DVVNL',
      name: 'DVVNL (Dakshinanchal)',
      fullName: 'Dakshinanchal Vidyut Vitran Nigam Limited',
      state: 'Uttar Pradesh',
      type: 'State Gov',
      majorCoverageCities: ['Agra', 'Aligarh', 'Mathura', 'Firozabad', 'Jhansi', 'Banda', 'Kanpur Dehat']
    },
    {
      code: 'MVVNL',
      name: 'MVVNL (Madhyanchal)',
      fullName: 'Madhyanchal Vidyut Vitran Nigam Limited',
      state: 'Uttar Pradesh',
      type: 'State Gov',
      majorCoverageCities: ['Lucknow', 'Bareilly', 'Ayodhya', 'Rae Bareli', 'Sitapur', 'Unnao', 'Hardoi', 'Budaun']
    },
    {
      code: 'PVVNL',
      name: 'PVVNL (Paschimanchal)',
      fullName: 'Paschimanchal Vidyut Vitran Nigam Limited',
      state: 'Uttar Pradesh',
      type: 'State Gov',
      majorCoverageCities: ['Meerut', 'Noida', 'Greater Noida Rural', 'Ghaziabad', 'Bulandshahr', 'Moradabad', 'Saharanpur', 'Muzaffarnagar']
    },
    {
      code: 'PuVVNL',
      name: 'PuVVNL (Purvanchal)',
      fullName: 'Purvanchal Vidyut Vitran Nigam Limited',
      state: 'Uttar Pradesh',
      type: 'State Gov',
      majorCoverageCities: ['Varanasi', 'Gorakhpur', 'Prayagraj (Allahabad)', 'Azamgarh', 'Mirzapur', 'Basti', 'Ghazipur', 'Jaunpur']
    },
    {
      code: 'KESCO',
      name: 'KESCO (Kanpur Urban)',
      fullName: 'Kanpur Electricity Supply Company Limited',
      state: 'Uttar Pradesh',
      type: 'State Gov',
      majorCoverageCities: ['Kanpur Urban']
    },
    {
      code: 'NPCL',
      name: 'NPCL (Greater Noida)',
      fullName: 'Noida Power Company Limited',
      state: 'Uttar Pradesh',
      type: 'Private',
      majorCoverageCities: ['Greater Noida Urban', 'Knowledge Park', 'Yamuna Expressway']
    },
    {
      code: 'TORRENT_AGRA',
      name: 'Torrent Power (Agra)',
      fullName: 'Torrent Power Limited (Agra Franchise)',
      state: 'Uttar Pradesh',
      type: 'Private',
      majorCoverageCities: ['Agra City']
    }
  ],

  "Rajasthan": [
    {
      code: 'JVVNL',
      name: 'JVVNL (Jaipur Discom)',
      fullName: 'Jaipur Vidyut Vitran Nigam Limited',
      state: 'Rajasthan',
      type: 'State Gov',
      majorCoverageCities: ['Jaipur', 'Alwar', 'Dausa', 'Bharatpur', 'Dholpur', 'Kota', 'Baran', 'Jhalawar', 'Sawai Madhopur']
    },
    {
      code: 'AVVNL',
      name: 'AVVNL (Ajmer Discom)',
      fullName: 'Ajmer Vidyut Vitran Nigam Limited',
      state: 'Rajasthan',
      type: 'State Gov',
      majorCoverageCities: ['Ajmer', 'Bhilwara', 'Nagaur', 'Udaipur', 'Chittorgarh', 'Rajsamand', 'Banswara', 'Sikar', 'Jhunjhunu']
    },
    {
      code: 'JdVVNL',
      name: 'JdVVNL (Jodhpur Discom)',
      fullName: 'Jodhpur Vidyut Vitran Nigam Limited',
      state: 'Rajasthan',
      type: 'State Gov',
      majorCoverageCities: ['Jodhpur', 'Bikaner', 'Jaisalmer', 'Barmer', 'Pali', 'Sirohi', 'Jalore', 'Sri Ganganagar', 'Hanumangarh']
    }
  ],

  "Tamil Nadu": [
    {
      code: 'TANGEDCO',
      name: 'TANGEDCO (Tamil Nadu Power)',
      fullName: 'Tamil Nadu Generation and Distribution Corporation Ltd.',
      state: 'Tamil Nadu',
      type: 'State Gov',
      majorCoverageCities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'All Tamil Nadu']
    }
  ],

  "Telangana": [
    {
      code: 'TSSPDCL',
      name: 'TSSPDCL (Southern Telangana)',
      fullName: 'Southern Power Distribution Company of Telangana Ltd.',
      state: 'Telangana',
      type: 'State Gov',
      majorCoverageCities: ['Hyderabad', 'Rangareddy', 'Medchal-Malkajgiri', 'Nalgonda', 'Mahabubnagar', 'Suryapet', 'Sangareddy']
    },
    {
      code: 'TSNPDCL',
      name: 'TSNPDCL (Northern Telangana)',
      fullName: 'Northern Power Distribution Company of Telangana Ltd.',
      state: 'Telangana',
      type: 'State Gov',
      majorCoverageCities: ['Warangal', 'Karimnagar', 'Khammam', 'Nizamabad', 'Adilabad', 'Mancherial', 'Jagtial']
    }
  ],

  "Andhra Pradesh": [
    {
      code: 'APCPDCL',
      name: 'APCPDCL (Central AP)',
      fullName: 'Andhra Pradesh Central Power Distribution Corporation Ltd.',
      state: 'Andhra Pradesh',
      type: 'State Gov',
      majorCoverageCities: ['Vijayawada', 'Guntur', 'Prakasam', 'Krishna']
    },
    {
      code: 'APEPDCL',
      name: 'APEPDCL (Eastern AP)',
      fullName: 'Eastern Power Distribution Company of Andhra Pradesh Ltd.',
      state: 'Andhra Pradesh',
      type: 'State Gov',
      majorCoverageCities: ['Visakhapatnam', 'Kakinada', 'Rajahmundry', 'Srikakulam', 'Vizianagaram']
    },
    {
      code: 'APSPDCL',
      name: 'APSPDCL (Southern AP)',
      fullName: 'Southern Power Distribution Company of Andhra Pradesh Ltd.',
      state: 'Andhra Pradesh',
      type: 'State Gov',
      majorCoverageCities: ['Tirupati', 'Nellore', 'Kadapa', 'Kurnool', 'Anantapur', 'Chittoor']
    }
  ],

  "Madhya Pradesh": [
    {
      code: 'MPMKVVCL',
      name: 'MPMKVVCL (Central MP - Bhopal)',
      fullName: 'M.P. Madhya Kshetra Vidyut Vitaran Co. Ltd.',
      state: 'Madhya Pradesh',
      type: 'State Gov',
      majorCoverageCities: ['Bhopal', 'Gwalior', 'Sehore', 'Raisen', 'Vidisha', 'Rajgarh', 'Guna', 'Shivpuri', 'Bhind', 'Morena']
    },
    {
      code: 'MPPKVVCL_INDORE',
      name: 'MPPKVVCL (West MP - Indore)',
      fullName: 'M.P. Paschim Kshetra Vidyut Vitaran Co. Ltd.',
      state: 'Madhya Pradesh',
      type: 'State Gov',
      majorCoverageCities: ['Indore', 'Ujjain', 'Dewas', 'Dhar', 'Khargone', 'Khandwa', 'Ratlam', 'Mandsaur', 'Neemuch']
    },
    {
      code: 'MPPKVVCL_JABALPUR',
      name: 'MPPKVVCL (East MP - Jabalpur)',
      fullName: 'M.P. Poorv Kshetra Vidyut Vitaran Co. Ltd.',
      state: 'Madhya Pradesh',
      type: 'State Gov',
      majorCoverageCities: ['Jabalpur', 'Sagar', 'Rewa', 'Satna', 'Katni', 'Chhindwara', 'Singrauli', 'Shahdol']
    }
  ],

  "West Bengal": [
    {
      code: 'WBSEDCL',
      name: 'WBSEDCL (West Bengal State)',
      fullName: 'West Bengal State Electricity Distribution Company Limited',
      state: 'West Bengal',
      type: 'State Gov',
      majorCoverageCities: ['Howrah', 'Hooghly', 'Siliguri', 'Durgapur', 'Asansol', 'Kharagpur', 'North 24 Parganas', 'South 24 Parganas']
    },
    {
      code: 'CESC',
      name: 'CESC (Kolkata & Howrah)',
      fullName: 'Calcutta Electric Supply Corporation',
      state: 'West Bengal',
      type: 'Private',
      majorCoverageCities: ['Kolkata', 'Howrah Urban']
    }
  ],

  "Bihar": [
    {
      code: 'NBPDCL',
      name: 'NBPDCL (North Bihar)',
      fullName: 'North Bihar Power Distribution Company Limited',
      state: 'Bihar',
      type: 'State Gov',
      majorCoverageCities: ['Muzaffarpur', 'Darbhanga', 'Purnia', 'Saharsa', 'Motihari', 'Begusarai', 'Katihar', 'Samastipur']
    },
    {
      code: 'SBPDCL',
      name: 'SBPDCL (South Bihar)',
      fullName: 'South Bihar Power Distribution Company Limited',
      state: 'Bihar',
      type: 'State Gov',
      majorCoverageCities: ['Patna', 'Gaya', 'Bhagalpur', 'Munger', 'Nalanda', 'Sasaram', 'Ara', 'Dehri']
    }
  ],

  "Punjab": [
    {
      code: 'PSPCL',
      name: 'PSPCL (Punjab State Power)',
      fullName: 'Punjab State Power Corporation Limited',
      state: 'Punjab',
      type: 'State Gov',
      majorCoverageCities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)', 'Hoshiarpur', 'Pathankot']
    }
  ],

  "Kerala": [
    {
      code: 'KSEBL',
      name: 'KSEBL (Kerala State Electricity)',
      fullName: 'Kerala State Electricity Board Limited',
      state: 'Kerala',
      type: 'State Gov',
      majorCoverageCities: ['Thiruvananthapuram', 'Kochi (Ernakulam)', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha', 'Palakkad']
    }
  ],

  "Odisha": [
    {
      code: 'TPCODL',
      name: 'TPCODL (Central Odisha - Bhubaneswar)',
      fullName: 'TP Central Odisha Distribution Limited',
      state: 'Odisha',
      type: 'Private',
      majorCoverageCities: ['Bhubaneswar', 'Cuttack', 'Puri', 'Khurda', 'Kendrapada', 'Jagatsinghpur', 'Nayagarh']
    },
    {
      code: 'TPWODL',
      name: 'TPWODL (Western Odisha - Sambalpur)',
      fullName: 'TP Western Odisha Distribution Limited',
      state: 'Odisha',
      type: 'Private',
      majorCoverageCities: ['Rourkela', 'Sambalpur', 'Bargarh', 'Jharsuguda', 'Balangir', 'Kalahandi']
    },
    {
      code: 'TPNODL',
      name: 'TPNODL (Northern Odisha - Balasore)',
      fullName: 'TP Northern Odisha Distribution Limited',
      state: 'Odisha',
      type: 'Private',
      majorCoverageCities: ['Balasore', 'Bhadrak', 'Mayurbhanj', 'Keonjhar', 'Jajpur']
    },
    {
      code: 'TPSODL',
      name: 'TPSODL (Southern Odisha - Berhampur)',
      fullName: 'TP Southern Odisha Distribution Limited',
      state: 'Odisha',
      type: 'Private',
      majorCoverageCities: ['Berhampur', 'Ganjam', 'Gajapati', 'Koraput', 'Rayagada', 'Nabarangpur']
    }
  ],

  "Assam": [
    {
      code: 'APDCL',
      name: 'APDCL (Assam Power Distribution)',
      fullName: 'Assam Power Distribution Company Limited',
      state: 'Assam',
      type: 'State Gov',
      majorCoverageCities: ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon']
    }
  ],

  "Uttarakhand": [
    {
      code: 'UPCL',
      name: 'UPCL (Uttarakhand Power)',
      fullName: 'Uttarakhand Power Corporation Limited',
      state: 'Uttarakhand',
      type: 'State Gov',
      majorCoverageCities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Rishikesh', 'Kashipur', 'Nainital']
    }
  ],

  "Himachal Pradesh": [
    {
      code: 'HPSEBL',
      name: 'HPSEBL (Himachal Pradesh)',
      fullName: 'Himachal Pradesh State Electricity Board Limited',
      state: 'Himachal Pradesh',
      type: 'State Gov',
      majorCoverageCities: ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Baddi', 'Hamirpur', 'Una']
    }
  ],

  "Chhattisgarh": [
    {
      code: 'CSPDCL',
      name: 'CSPDCL (Chhattisgarh Power)',
      fullName: 'Chhattisgarh State Power Distribution Company Limited',
      state: 'Chhattisgarh',
      type: 'State Gov',
      majorCoverageCities: ['Raipur', 'Bhilai', 'Durg', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Jagdalpur', 'Raigarh']
    }
  ],

  "Jharkhand": [
    {
      code: 'JBVNL',
      name: 'JBVNL (Jharkhand Bijli Vitran)',
      fullName: 'Jharkhand Bijli Vitran Nigam Limited',
      state: 'Jharkhand',
      type: 'State Gov',
      majorCoverageCities: ['Ranchi', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih']
    },
    {
      code: 'TSUISL',
      name: 'Tata Steel UISL / JUSCO (Jamshedpur)',
      fullName: 'Tata Steel Utilities and Infrastructure Services Limited',
      state: 'Jharkhand',
      type: 'Private',
      majorCoverageCities: ['Jamshedpur Urban Area']
    }
  ],

  "Goa": [
    {
      code: 'GED',
      name: 'Goa Electricity Department',
      fullName: 'Electricity Department, Government of Goa',
      state: 'Goa',
      type: 'State Gov',
      majorCoverageCities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda']
    }
  ],

  "Chandigarh": [
    {
      code: 'CED',
      name: 'Chandigarh Electricity Department',
      fullName: 'Electricity Wing, Engineering Department, UT Chandigarh',
      state: 'Chandigarh',
      type: 'State Gov',
      majorCoverageCities: ['Chandigarh All Sectors']
    }
  ],

  "Jammu and Kashmir": [
    {
      code: 'JPDCL',
      name: 'JPDCL (Jammu Power)',
      fullName: 'Jammu Power Distribution Corporation Limited',
      state: 'Jammu and Kashmir',
      type: 'State Gov',
      majorCoverageCities: ['Jammu City', 'Udhampur', 'Kathua', 'Samba']
    },
    {
      code: 'KPDCL',
      name: 'KPDCL (Kashmir Power)',
      fullName: 'Kashmir Power Distribution Corporation Limited',
      state: 'Jammu and Kashmir',
      type: 'State Gov',
      majorCoverageCities: ['Srinagar', 'Anantnag', 'Baramulla', 'Pulwama']
    }
  ],

  "Puducherry": [
    {
      code: 'PED',
      name: 'Puducherry Electricity Department',
      fullName: 'Electricity Department, Government of Puducherry',
      state: 'Puducherry',
      type: 'State Gov',
      majorCoverageCities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
    }
  ]
};

/**
 * Returns list of DISCOMs operating in the specified state.
 * Normalizes state name matching (handles aliases, casing, suffixes).
 */
export function getDiscomsForState(stateName: string): DiscomInfo[] {
  if (!stateName) return [];
  const normalized = stateName.trim();

  // 1. Direct match
  if (STATE_DISCOMS_MAP[normalized]) {
    return STATE_DISCOMS_MAP[normalized];
  }

  // 2. Case-insensitive / alias match
  const lower = normalized.toLowerCase();
  for (const [key, discoms] of Object.entries(STATE_DISCOMS_MAP)) {
    if (key.toLowerCase() === lower) return discoms;
    if (lower.startsWith('delhi') && key.startsWith('Delhi')) return discoms;
    if ((lower.includes('odisha') || lower.includes('orissa')) && key === 'Odisha') return discoms;
    if (lower.includes('jammu') && key.includes('Jammu')) return discoms;
  }

  // Fallback generic discom for other States/UTs
  return [
    {
      code: `${normalized.substring(0, 3).toUpperCase()}_DISCOM`,
      name: `${normalized} State Power Distribution Co.`,
      fullName: `${normalized} State Electricity Board / Discom`,
      state: normalized,
      type: 'State Gov'
    }
  ];
}

/**
 * Returns clean array of DISCOM names (for dropdown select options) for a state.
 */
export function getDiscomNamesForState(stateName: string): string[] {
  const discoms = getDiscomsForState(stateName);
  return discoms.map(d => d.fullName);
}

/**
 * Returns all DISCOMs across India.
 */
export function getAllIndianDiscoms(): DiscomInfo[] {
  const all: DiscomInfo[] = [];
  for (const list of Object.values(STATE_DISCOMS_MAP)) {
    all.push(...list);
  }
  return all;
}
