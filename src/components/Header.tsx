import React from 'react';
import { 
  Building2, 
  Users, 
  ClipboardCheck, 
  FileText, 
  CalendarDays, 
  LayoutDashboard,
  Settings,
  Printer
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
  return (
    <header className="no-print bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner / Republic Lockup */}
      <div className="bg-stone-900 text-stone-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400">الجمهورية الجزائرية الديمقراطية الشعبية</span>
          <span className="text-stone-500">|</span>
          <span className="text-stone-300">وزارة التربية الوطنية</span>
          <span className="text-stone-500">|</span>
          <span className="text-stone-300 truncate max-w-xs">{inspector.directorate}</span>
        </div>
        <div className="flex items-center gap-4 text-stone-400">
          <span>السنة الدراسية: <strong className="text-stone-200 tabular-nums">{inspector.academicYear}</strong></span>
          <span className="text-stone-600">·</span>
          <span className="text-stone-300">{inspector.name}</span>
        </div>
      </div>

      {/* Main Top Navigation conforming to Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-serif text-xl font-bold shadow-xs">
              ض
            </div>
            <div>
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className="text-right text-stone-900 font-bold text-base sm:text-lg tracking-tight hover:text-emerald-800 transition-colors whitespace-nowrap block"
              >
                مفتشية التعليم الابتدائي | أ. بن بوزيد
              </button>
              <div className="text-[11px] text-emerald-800 font-semibold -mt-0.5 truncate max-w-[260px]">
                مادة اللغة العربية · الطور الابتدائي الحصري
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
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
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
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
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
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
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
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
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
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
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'schedule'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold border-b-2 border-emerald-700'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <CalendarDays className="w-4 h-4 text-emerald-700" />
              <span>رزنامة الزيارات</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Quick Filter */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Zone Filter */}
            <div className="hidden sm:flex items-center text-xs text-stone-600 bg-stone-100 rounded-lg p-1 border border-stone-200">
              <span className="px-2 py-1 font-medium text-stone-500">الجهة:</span>
              <select
                value={selectedZoneFilter}
                onChange={(e) => setSelectedZoneFilter(e.target.value)}
                className="bg-transparent text-stone-800 font-semibold focus:outline-none cursor-pointer py-1 pl-1"
              >
                <option value="all">كافة جهات المقاطعة</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onOpenSettings}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              title="إعدادات المفتشية والنسخ الاحتياطي"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={() => window.print()}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المستند</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2.5 border-t border-stone-100 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'dashboard' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('institutions')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'institutions' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
            }`}
          >
            المؤسسات
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'teachers' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
            }`}
          >
            الأساتذة
          </button>
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'evaluation' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
            }`}
          >
            التقييم
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'reports' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
            }`}
          >
            التقارير
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'schedule' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
            }`}
          >
            الزيارات
          </button>
        </div>
      </div>
    </header>
  );
};
