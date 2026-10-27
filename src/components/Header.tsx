import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ClipboardCheck, 
  FileText, 
  CalendarDays, 
  LayoutDashboard,
  Settings,
  Printer,
  Menu,
  X,
  Compass,
  ChevronDown,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { InspectorProfile } from '../data/storage';

interface HeaderProps {
  activeTab: 'dashboard' | 'institutions' | 'teachers' | 'evaluation' | 'reports' | 'schedule';
  setActiveTab: (tab: 'dashboard' | 'institutions' | 'teachers' | 'evaluation' | 'reports' | 'schedule') => void;
  inspector: InspectorProfile;
  onOpenSettings: () => void;
  selectedZoneFilter: string;
  setSelectedZoneFilter: (zone: string) => void;
  zones: { id: string; name: string }[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  inspector,
  onOpenSettings,
  selectedZoneFilter,
  setSelectedZoneFilter,
  zones,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="no-print bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        
        {/* Top Official Banner (Responsive: compact on mobile, detailed on tablet/desktop) */}
        <div className="bg-stone-900 text-stone-200 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="font-semibold text-emerald-400 shrink-0">الجمهورية الجزائرية الديمقراطية الشعبية</span>
            <span className="hidden sm:inline text-stone-500">|</span>
            <span className="hidden sm:inline text-stone-300">وزارة التربية الوطنية</span>
            <span className="hidden md:inline text-stone-500">|</span>
            <span className="hidden md:inline text-stone-400 truncate max-w-xs">{inspector.directorate}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-stone-400 shrink-0 text-[10px] sm:text-xs">
            <span>الموسم: <strong className="text-stone-200 tabular-nums font-mono">{inspector.academicYear}</strong></span>
            <span className="hidden sm:inline text-stone-600">·</span>
            <span className="hidden sm:inline text-stone-300 font-medium">{inspector.name}</span>
          </div>
        </div>

        {/* Main Bar (Desktop / Tablet / Mobile) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-6 h-15 sm:h-16">
            
            {/* Zone 1: Brand Wordmark */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-serif text-lg sm:text-xl font-bold shadow-xs">
                ض
              </div>
              <div>
                <button 
                  onClick={() => setActiveTab('dashboard')} 
                  className="text-right text-stone-900 font-bold text-sm sm:text-base lg:text-lg tracking-tight hover:text-emerald-800 transition-colors whitespace-nowrap block"
                >
                  مفتشية التعليم الابتدائي | أ. بن بوزيد
                </button>
                <div className="text-[10px] sm:text-[11px] text-emerald-800 font-semibold -mt-0.5 truncate max-w-[190px] sm:max-w-[280px]">
                  مادة اللغة العربية · الطور الابتدائي الحصري
                </div>
              </div>
            </div>

            {/* Zone 2: Desktop Navigation Links (Large Screens) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`min-h-[44px] flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border-b-2 border-emerald-700'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                <span>لوحة المقاطعة</span>
              </button>

              <button
                onClick={() => setActiveTab('institutions')}
                className={`min-h-[44px] flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'institutions'
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border-b-2 border-emerald-700'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>المدارس الابتدائية</span>
              </button>

              <button
                onClick={() => setActiveTab('teachers')}
                className={`min-h-[44px] flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'teachers'
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border-b-2 border-emerald-700'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-700" />
                <span>أساتذة الابتدائي</span>
              </button>

              <button
                onClick={() => setActiveTab('evaluation')}
                className={`min-h-[44px] flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'evaluation'
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border-b-2 border-emerald-700'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <ClipboardCheck className="w-4 h-4 text-emerald-700" />
                <span>التقييم الإلكتروني</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`min-h-[44px] flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'reports'
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border-b-2 border-emerald-700'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>التقارير الدورية</span>
              </button>

              <button
                onClick={() => setActiveTab('schedule')}
                className={`min-h-[44px] flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'schedule'
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border-b-2 border-emerald-700'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <CalendarDays className="w-4 h-4 text-emerald-700" />
                <span>رزنامة الزيارات</span>
              </button>
            </nav>

            {/* Zone 3: Quick Controls & Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* Quick Zone Filter on Tablet and Desktop */}
              <div className="hidden sm:flex items-center text-xs text-stone-700 bg-stone-100 rounded-lg p-1 border border-stone-200">
                <Compass className="w-3.5 h-3.5 text-emerald-800 ml-1 mr-1" />
                <select
                  value={selectedZoneFilter}
                  onChange={(e) => setSelectedZoneFilter(e.target.value)}
                  className="bg-transparent text-stone-900 font-semibold focus:outline-none cursor-pointer py-1 text-xs"
                  aria-label="تصفية الجهة"
                >
                  <option value="all">كافة الجهات ({zones.length})</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Print Button (Tablet / Desktop) */}
              <button
                onClick={() => window.print()}
                className="hidden md:flex min-h-[40px] items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors whitespace-nowrap"
                title="طباعة الصفحة أو التقرير"
              >
                <Printer className="w-3.5 h-3.5 text-stone-600" />
                <span>طباعة</span>
              </button>

              {/* Settings button */}
              <button
                onClick={onOpenSettings}
                className="min-h-[44px] min-w-[44px] p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center justify-center"
                title="إعدادات المفتشية والنسخ الاحتياطي"
                aria-label="إعدادات المفتشية"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Mobile Menu Trigger (Phone only) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden min-h-[44px] min-w-[44px] p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors flex items-center justify-center"
                aria-label="فتح القائمة السريعة"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-emerald-800" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>

          {/* Tablet Tab Bar (Visible on medium screens like iPads/Tablets 768px-1024px) */}
          <div className="hidden md:flex lg:hidden items-center justify-between border-t border-stone-200 py-2 gap-1 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`min-h-[44px] px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'bg-emerald-800 text-white font-bold' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>الرئيسية</span>
            </button>
            <button
              onClick={() => setActiveTab('institutions')}
              className={`min-h-[44px] px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'institutions' ? 'bg-emerald-800 text-white font-bold' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>المدارس</span>
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`min-h-[44px] px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'teachers' ? 'bg-emerald-800 text-white font-bold' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>الأساتذة</span>
            </button>
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`min-h-[44px] px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'evaluation' ? 'bg-emerald-800 text-white font-bold' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>التقييم</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`min-h-[44px] px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'reports' ? 'bg-emerald-800 text-white font-bold' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>التقارير</span>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`min-h-[44px] px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'schedule' ? 'bg-emerald-800 text-white font-bold' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>الزيارات</span>
            </button>
          </div>

        </div>

        {/* Mobile Quick Dropdown/Slide-over Menu (When hamburger tapped on smartphone) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white p-4 space-y-4 shadow-xl">
            {/* Inspector Identity Card on Mobile */}
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-serif text-lg font-bold shrink-0">
                ض
              </div>
              <div className="text-xs">
                <div className="font-bold text-emerald-950">{inspector.name}</div>
                <div className="text-emerald-800 text-[11px]">{inspector.title}</div>
                <div className="text-stone-500 text-[10px]">{inspector.districtName}</div>
              </div>
            </div>

            {/* Zone Selector for Mobile */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-800" />
                <span>تصفية حسب الجهة التفتيشية:</span>
              </label>
              <select
                value={selectedZoneFilter}
                onChange={(e) => {
                  setSelectedZoneFilter(e.target.value);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="all">كافة جهات المقاطعة ({zones.length} جهات)</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions List for Mobile */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setActiveTab('schedule');
                  setIsMobileMenuOpen(false);
                }}
                className="min-h-[44px] flex items-center justify-center gap-2 p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg transition-colors"
              >
                <CalendarDays className="w-4 h-4 text-emerald-800" />
                <span>رزنامة الزيارات</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('reports');
                  setIsMobileMenuOpen(false);
                }}
                className="min-h-[44px] flex items-center justify-center gap-2 p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald-800" />
                <span>التقارير الدورية</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                  setIsMobileMenuOpen(false);
                }}
                className="min-h-[44px] flex items-center justify-center gap-2 p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4 text-stone-600" />
                <span>طباعة الصفحة</span>
              </button>

              <button
                onClick={() => {
                  onOpenSettings();
                  setIsMobileMenuOpen(false);
                }}
                className="min-h-[44px] flex items-center justify-center gap-2 p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-stone-600" />
                <span>الإعدادات والنسخ</span>
              </button>
            </div>
          </div>
        )}

      </header>

      {/* ERGONOMIC MOBILE BOTTOM NAVIGATION BAR (Phones: < 768px) */}
      <nav 
        className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-xl px-2 py-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        aria-label="شريط التنقل السفلي للهاتف"
      >
        <div className="grid grid-cols-5 items-center justify-around">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              activeTab === 'dashboard'
                ? 'text-emerald-800 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'dashboard' ? 'bg-emerald-100' : ''}`}>
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">الرئيسية</span>
          </button>

          <button
            onClick={() => setActiveTab('institutions')}
            className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              activeTab === 'institutions'
                ? 'text-emerald-800 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'institutions' ? 'bg-emerald-100' : ''}`}>
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">المدارس</span>
          </button>

          {/* Central Highlight Button: Evaluation on Touch */}
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              activeTab === 'evaluation'
                ? 'text-emerald-800 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <div className={`p-1.5 -mt-3 rounded-full shadow-sm border ${
              activeTab === 'evaluation'
                ? 'bg-emerald-800 text-amber-300 border-emerald-900 ring-2 ring-emerald-700/30'
                : 'bg-emerald-700 text-white border-emerald-800'
            }`}>
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">التقييم</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              activeTab === 'teachers'
                ? 'text-emerald-800 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'teachers' ? 'bg-emerald-100' : ''}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">الأساتذة</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              activeTab === 'schedule'
                ? 'text-emerald-800 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'schedule' ? 'bg-emerald-100' : ''}`}>
              <CalendarDays className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">الزيارات</span>
          </button>

        </div>
      </nav>
    </>
  );
};
