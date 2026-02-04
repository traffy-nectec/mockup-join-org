import React, { useState, useEffect, useRef } from 'react';
import { Search, Building2, UserPlus, ArrowRight, CheckCircle2, X, Send, ShieldCheck, Loader2, MapPin, Sparkles, Clock, AlertCircle } from 'lucide-react';

// --- Mock Data: Thai Government Agencies (Traffy Fondue Context) ---
const MOCK_ORGS = [
  { id: 1, name: "สำนักงานเขตจตุจักร", members: 450, description: "ศูนย์รับเรื่องราวร้องทุกข์ เขตจตุจักร", theme: "green", lastActive: "5 นาทีที่แล้ว" },
  { id: 2, name: "เทศบาลนครปากเกร็ด", members: 320, description: "งานสาธารณูปโภคและสิ่งแวดล้อม", theme: "blue", lastActive: "1 ชม. ที่แล้ว" },
  { id: 3, name: "กรมทางหลวง", members: 1250, description: "แจ้งซ่อมบำรุงทางหลวงและไฟส่องสว่าง", theme: "orange", lastActive: "20 นาทีที่แล้ว" },
  { id: 4, name: "การประปานครหลวง", members: 890, description: "แจ้งท่อแตกรั่ว น้ำไม่ไหล คุณภาพน้ำ", theme: "blue", lastActive: "เมื่อวาน" },
];

const SUGGESTED_ORGS = [
  { id: 101, name: "สำนักงานเขตปทุมวัน", distance: "0.5 กม.", members: 560, theme: "green", description: "ศูนย์ประสานงานเขตปทุมวัน", lastActive: "2 นาทีที่แล้ว" },
  { id: 102, name: "สำนักการระบายน้ำ กทม.", distance: "1.2 กม.", members: 1200, theme: "blue", description: "แจ้งปัญหาน้ำท่วมขังและการระบายน้ำ", lastActive: "15 นาทีที่แล้ว" },
  { id: 103, name: "เทศบาลนครรังสิต", distance: "2.0 กม.", members: 430, theme: "orange", description: "งานบริการประชาชน เทศบาลนครรังสิต", lastActive: "3 ชม. ที่แล้ว" },
  { id: 104, name: "กรมควบคุมมลพิษ", distance: "3.5 กม.", members: 280, theme: "purple", description: "แจ้งปัญหามลพิษทางอากาศและเสียง", lastActive: "1 วันที่แล้ว" },
  { id: 105, name: "สำนักงานเขตดินแดง", distance: "4.1 กม.", members: 390, theme: "green", description: "รับเรื่องร้องเรียน เขตดินแดง", lastActive: "ครึ่งชั่วโมงที่แล้ว" },
  { id: 106, name: "แขวงทางหลวงปทุมธานี", distance: "5.0 กม.", members: 150, theme: "orange", description: "หมวดทางหลวงปทุมธานี", lastActive: "45 นาทีที่แล้ว" },
  { id: 107, name: "การรถไฟฟ้าขนส่งมวลชนแห่งประเทศไทย", distance: "6.2 กม.", members: 980, theme: "purple", description: "รฟม. (MRTA) แจ้งปัญหาการก่อสร้าง", lastActive: "2 ชม. ที่แล้ว" },
  { id: 108, name: "อบต.ราชาเทวะ", distance: "7.8 กม.", members: 210, theme: "blue", description: "องค์การบริหารส่วนตำบลราชาเทวะ", lastActive: "5 ชม. ที่แล้ว" },
  { id: 109, name: "สำนักงานเขตบางรัก", distance: "8.5 กม.", members: 410, theme: "green", description: "ศูนย์บริหารราชการ เขตบางรัก", lastActive: "10 นาทีที่แล้ว" },
  { id: 110, name: "เทศบาลเมืองแสนสุข", distance: "9.0 กม.", members: 350, theme: "blue", description: "งานดูแลความสะอาดชายหาดและเมือง", lastActive: "เมื่อวาน" },
];

const CODE_REGEX = /^[a-z0-9]{6}$/;

// Helper function to get high contrast colors based on theme
const getThemeColors = (theme) => {
  switch(theme) {
    case 'blue': return 'bg-blue-100 text-blue-900';
    case 'purple': return 'bg-purple-100 text-purple-900';
    case 'orange': return 'bg-orange-100 text-orange-900';
    case 'green': return 'bg-green-100 text-green-900';
    case 'yellow': return 'bg-yellow-100 text-yellow-900';
    default: return 'bg-gray-200 text-gray-900';
  }
};

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for Modals
  const [selectedOrg, setSelectedOrg] = useState(null); 
  const [isRequestMode, setIsRequestMode] = useState(false); 
  const [directJoinData, setDirectJoinData] = useState(null); 

  // Modal Interaction States
  const [modalCodeInput, setModalCodeInput] = useState('');
  const [joinStatus, setJoinStatus] = useState('idle'); // idle, loading, success, error
  const [requestStatus, setRequestStatus] = useState('idle'); // idle, loading, success

  // Refs for accessibility focus management
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (selectedOrg && modalRef.current) {
      modalRef.current.focus();
    }
  }, [selectedOrg]);

  // --- Handlers ---

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = MOCK_ORGS.filter(org => 
      org.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleMainAction = (e) => {
    e.preventDefault();
    if (CODE_REGEX.test(inputValue)) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setDirectJoinData({ name: "หน่วยงานทดสอบระบบ", code: inputValue });
      }, 1500);
    }
  };

  const openOrgModal = (org) => {
    setSelectedOrg(org);
    setIsRequestMode(false);
    setJoinStatus('idle'); // Reset statuses
    setRequestStatus('idle');
    setModalCodeInput('');
  };

  const closeOrgModal = () => {
    setSelectedOrg(null);
    setIsRequestMode(false);
    setJoinStatus('idle');
    setRequestStatus('idle');
    setModalCodeInput('');
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const handleRequestSubmit = () => {
    setRequestStatus('loading');
    // Simulate API call
    setTimeout(() => {
        setRequestStatus('success');
    }, 1500);
  };

  const handleCodeSubmitInsideModal = () => {
     setJoinStatus('loading');
     // Simulate API call
     setTimeout(() => {
        // Simple validation simulation
        if (CODE_REGEX.test(modalCodeInput)) {
            setJoinStatus('success');
            // Close modal after showing success for a moment
            setTimeout(() => {
                closeOrgModal();
                setDirectJoinData({ name: selectedOrg.name, code: modalCodeInput });
            }, 1000);
        } else {
            setJoinStatus('error');
        }
     }, 1500);
  };

  // Helper to determine active color
  const getActiveColorClass = (text) => {
    if (text.includes("นาที") || text.includes("ชั่วโมง")) return "text-green-700";
    return "text-gray-500";
  };

  // --- Render Components ---

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-10">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">เข้าร่วมหน่วยงาน</h1>
          <div 
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300"
            aria-label="โปรไฟล์ผู้ใช้"
            role="img"
          >
            <span className="text-sm font-bold text-gray-800">ME</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-8 space-y-8">
        
        {/* Instruction */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">ค้นหาหรือใส่รหัส</h2>
          <p className="text-base text-gray-700 leading-relaxed font-medium">
            กรอกรหัสเข้าหน่วยงาน 6 หลักเพื่อเข้าทันที หากไม่มีรหัส สามารถค้นหาชื่อหน่วยงานเพื่อส่งคำขอถึง Admin
          </p>
        </div>

        {/* Input Section */}
        <form onSubmit={handleMainAction} className="relative group">
          <label htmlFor="search-input" className="sr-only">
            รหัสเข้าหน่วยงานหรือชื่อหน่วยงาน
          </label>
          
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {loading ? (
              <Loader2 className="h-6 w-6 text-[#553924] animate-spin" />
            ) : (
              <Search className="h-6 w-6 text-gray-700" aria-hidden="true" />
            )}
          </div>
          
          <input
            id="search-input"
            ref={searchInputRef}
            type="text"
            // Replaced indigo focus colors with #553924
            className="block w-full pl-12 pr-14 py-4 bg-white border-2 border-gray-400 rounded-2xl shadow-sm placeholder-gray-600 text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#553924]/20 focus:border-[#553924] text-lg font-medium transition-all"
            placeholder="รหัส เช่น ab12cd หรือชื่อ"
            value={inputValue}
            onChange={handleInputChange}
            aria-describedby="search-hint"
          />
          <span id="search-hint" className="sr-only">กรอกตัวอักษรพิมพ์เล็กและตัวเลข 6 หลักสำหรับรหัส</span>

          {inputValue && (
            <button 
              type="submit"
              aria-label="ค้นหาหรือเข้าร่วม"
              className="absolute inset-y-0 right-2 flex items-center my-2"
            >
              {/* Replaced indigo button with #553924 and hover darken */}
              <div className="bg-[#553924] text-white p-2.5 rounded-xl hover:bg-[#3e2b1b] focus:ring-2 focus:ring-offset-2 focus:ring-[#553924] transition-colors">
                <ArrowRight className="h-5 w-5" />
              </div>
            </button>
          )}
        </form>

        {/* --- Suggested / Nearby Section --- */}
        {!inputValue && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-700" aria-hidden="true" />
                หน่วยงานแนะนำใกล้คุณ
              </h3>
              {/* Text Link Color */}
              <button className="text-sm text-[#553924] font-bold underline decoration-2 underline-offset-4 hover:text-[#3e2b1b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#553924] rounded">
                ดูทั้งหมด
              </button>
            </div>
            
            <div className="space-y-4">
              {SUGGESTED_ORGS.map((org) => (
                <button 
                  key={org.id}
                  onClick={() => openOrgModal(org)}
                  // Hover border color
                  className="w-full text-left bg-white p-4 rounded-2xl border-2 border-gray-200 hover:border-[#553924] shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99] flex items-start space-x-4 relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-[#553924]/20"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border border-opacity-10 border-black ${getThemeColors(org.theme)}`}>
                    <Building2 className="h-7 w-7" aria-hidden="true" />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col pt-1 gap-1">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{org.name}</h3>
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-700 font-medium gap-y-1">
                       <span className="flex items-center bg-gray-100 px-2 py-0.5 rounded border border-gray-300 mr-2">
                          <MapPin className="h-3 w-3 mr-1 text-gray-700" aria-hidden="true" />
                          {org.distance}
                       </span>
                       <span className="mr-2">{org.members} สมาชิก</span>
                       
                       {/* Last Active */}
                       <span className="flex items-center text-xs font-semibold ml-auto sm:ml-0">
                          <Clock className={`h-3 w-3 mr-1 ${getActiveColorClass(org.lastActive)}`} />
                          <span className={getActiveColorClass(org.lastActive)}>{org.lastActive}</span>
                       </span>
                    </div>
                    <span className="sr-only">{org.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Area */}
        {inputValue && (
          <div className="space-y-4" role="region" aria-label="ผลการค้นหา">
            {searchResults.length === 0 && !CODE_REGEX.test(inputValue) && (
              <div className="text-center py-12 text-gray-600">
                <Building2 className="mx-auto h-14 w-14 opacity-30 mb-3" aria-hidden="true" />
                <p className="text-lg font-medium">ไม่พบหน่วยงานที่ค้นหา</p>
              </div>
            )}

            {searchResults.map((org) => (
              <button 
                key={org.id}
                onClick={() => openOrgModal(org)}
                // Hover border color
                className="w-full text-left bg-white p-4 rounded-2xl border-2 border-gray-200 hover:border-[#553924] shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99] flex items-start space-x-4 focus:outline-none focus:ring-4 focus:ring-[#553924]/20"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border border-opacity-10 border-black ${getThemeColors(org.theme)}`}>
                  <Building2 className="h-7 w-7" aria-hidden="true" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col pt-1 gap-0.5">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{org.name}</h3>
                  <p className="text-base text-gray-700 line-clamp-1">{org.description}</p>
                  
                  <div className="mt-1.5 flex items-center text-sm text-gray-600 font-medium space-x-3">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-800 border border-gray-300">
                      {org.members} สมาชิก
                    </span>
                    <span aria-hidden="true" className="text-gray-300">•</span>
                    {/* Last Active in Search Results */}
                    <span className={`flex items-center text-xs ${getActiveColorClass(org.lastActive)}`}>
                       <Clock className="h-3 w-3 mr-1" />
                       {org.lastActive}
                    </span>
                  </div>
                  {/* Tap to view detail text color */}
                  <div className="mt-1 text-sm font-bold text-[#553924]">แตะเพื่อดูรายละเอียด</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* --- POPUP 1: Direct Entry Code Success --- */}
      {directJoinData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl transform transition-all scale-100 text-center border-2 border-green-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">
              <CheckCircle2 className="h-10 w-10 text-green-800" aria-hidden="true" />
            </div>
            <h3 id="success-title" className="text-2xl font-bold text-gray-900 mb-3">เข้าร่วมสำเร็จ!</h3>
            <p className="text-gray-700 text-lg mb-8 font-medium">
              คุณได้เข้าร่วมหน่วยงาน <br/>
              <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">"{directJoinData.name}"</span> <br/>
              เรียบร้อยแล้ว
            </p>
            <button 
              onClick={() => {
                setDirectJoinData(null);
                setInputValue('');
                alert("Redirecting to org page...");
              }}
              className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-800/30 transition-colors"
            >
              ไปยังหน้าหน่วยงาน
            </button>
          </div>
        </div>
      )}

      {/* --- POPUP 2: Organization Interaction (Join / Request) --- */}
      {selectedOrg && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeOrgModal}
            aria-hidden="true"
          ></div>
          
          <div 
            ref={modalRef}
            tabIndex={-1}
            className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative z-10 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-5 duration-300 focus:outline-none"
          >
            {/* Header of Modal */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-opacity-10 border-black ${getThemeColors(selectedOrg.theme)}`}>
                    <Building2 className="h-6 w-6" aria-hidden="true" />
                 </div>
                 <div>
                    <h3 id="modal-title" className="text-xl font-bold text-gray-900 leading-tight">{selectedOrg.name}</h3>
                    <p className="text-sm font-medium text-gray-600 mt-1">ID: {selectedOrg.id}00{selectedOrg.id}</p>
                 </div>
              </div>
              <button 
                onClick={closeOrgModal} 
                aria-label="ปิดหน้าต่าง"
                className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content Switcher */}
            {!isRequestMode ? (
              // MODE: Join with Code
              <div className="space-y-5">
                <div>
                  <label htmlFor="entry-code-input" className="block text-base font-bold text-gray-900 mb-2">
                    รหัสเข้าหน่วยงาน
                  </label>
                  <input 
                    id="entry-code-input"
                    type="text" 
                    value={modalCodeInput}
                    onChange={(e) => {
                        setModalCodeInput(e.target.value);
                        setJoinStatus('idle'); // Clear error on typing
                    }}
                    placeholder="กรอกรหัสเข้าร่วม 6 หลัก"
                    // Changed focus ring color to #553924
                    className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:outline-none text-center text-xl font-bold tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-600 text-gray-900 ${
                        joinStatus === 'error' ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-400 focus:ring-[#553924]/20 focus:border-[#553924]'
                    }`}
                  />
                  
                  {/* Join Status Feedback */}
                  {joinStatus === 'error' && (
                      <p className="text-red-600 text-sm font-medium text-center mt-2 flex items-center justify-center animate-in fade-in">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          รหัสไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง
                      </p>
                  )}
                  {joinStatus === 'success' && (
                      <p className="text-green-700 text-sm font-bold text-center mt-2 flex items-center justify-center animate-in fade-in">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          เข้าร่วมสำเร็จ!
                      </p>
                  )}
                </div>
                
                <button 
                  onClick={handleCodeSubmitInsideModal}
                  disabled={joinStatus === 'loading'}
                  // Button color #553924
                  className="w-full bg-[#553924] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#3e2b1b] flex items-center justify-center space-x-3 shadow-lg shadow-[#553924]/20 focus:outline-none focus:ring-4 focus:ring-[#553924]/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {joinStatus === 'loading' ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                      <>
                        <UserPlus className="h-6 w-6" />
                        <span>เข้าร่วมหน่วยงาน</span>
                      </>
                  )}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm font-medium">
                    <span className="px-3 bg-white text-gray-600">หรือ</span>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                    <p className="text-sm text-gray-500 text-center px-2 leading-relaxed">
                        หากคุณต้องการเป็นเจ้าหน้าที่ แต่ไม่มีรหัสเข้าหน่วยงาน <br/>
                        สามารถส่งคำขอให้ Admin อนุมัติสิทธิ์เข้าใช้งานได้โดยตรง
                    </p>
                    <button 
                    onClick={() => setIsRequestMode(true)}
                    // Updated border and text color to match theme
                    className="w-full bg-white border-2 border-[#553924]/20 text-[#553924] py-3.5 rounded-xl font-bold hover:bg-[#553924]/5 hover:border-[#553924]/40 flex items-center justify-center space-x-3 focus:outline-none focus:ring-4 focus:ring-[#553924]/10 transition-colors"
                    >
                    <ShieldCheck className="h-6 w-6" />
                    <span>ไม่มีรหัส? ส่งคำขอเข้าใช้งานถึง Admin</span>
                    </button>
                </div>
              </div>
            ) : (
              // MODE: Request Approval
              requestStatus === 'success' ? (
                  // SUCCESS STATE for Request
                  <div className="py-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle2 className="h-10 w-10 text-green-700" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">ส่งคำขอสำเร็จ</h3>
                      <p className="text-gray-600 font-medium mb-6">
                          คำขอของคุณถูกส่งไปยัง Admin เรียบร้อยแล้ว <br/>
                          กรุณารอการอนุมัติในเร็วๆ นี้
                      </p>
                      <button 
                        onClick={closeOrgModal}
                        className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-200"
                      >
                        ปิดหน้าต่าง
                      </button>
                  </div>
              ) : (
                  // FORM STATE for Request
                  <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-blue-50 p-4 rounded-xl flex items-start space-x-3 border border-blue-200">
                    <ShieldCheck className="h-6 w-6 text-blue-800 mt-0.5 shrink-0" aria-hidden="true" />
                    <p className="text-sm text-blue-900 font-medium leading-relaxed">
                        Admin จะตรวจสอบคำขอของคุณ หากอนุมัติ คุณจะได้รับการแจ้งเตือน
                    </p>
                    </div>

                    <div>
                    <label htmlFor="request-message" className="block text-base font-bold text-gray-900 mb-2">
                        ข้อความถึง Admin (ระบุชื่อ/แผนก และต้องการเป็น Admin หรือ Staff)
                    </label>
                    <textarea 
                        id="request-message"
                        rows="3"
                        placeholder="สวัสดีครับ ขอเข้าร่วมกลุ่มครับ ผมชื่อ... ต้องการขอสิทธิ์เป็น Staff ครับ"
                        // Changed focus ring for textarea
                        className="w-full p-4 border-2 border-gray-400 rounded-xl focus:ring-4 focus:ring-[#553924]/20 focus:border-[#553924] focus:outline-none resize-none text-gray-900 placeholder-gray-600"
                    ></textarea>
                    </div>

                    <div className="flex space-x-3 pt-2">
                    <button 
                        onClick={() => setIsRequestMode(false)}
                        className="flex-1 bg-gray-100 border border-gray-300 text-gray-900 py-3.5 rounded-xl font-bold hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-500/20"
                    >
                        ย้อนกลับ
                    </button>
                    <button 
                        onClick={handleRequestSubmit}
                        disabled={requestStatus === 'loading'}
                        // Updated Send button to primary theme color
                        className="flex-1 bg-[#553924] text-white py-3.5 rounded-xl font-bold hover:bg-[#3e2b1b] flex items-center justify-center space-x-2 shadow-lg shadow-[#553924]/20 focus:outline-none focus:ring-4 focus:ring-[#553924]/30 disabled:opacity-70 transition-all"
                    >
                        {requestStatus === 'loading' ? (
                             <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <Send className="h-5 w-5" />
                                <span>ส่งคำขอ</span>
                            </>
                        )}
                    </button>
                    </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

    </div>
  );
}