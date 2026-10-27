import React, { useState } from 'react';
import { Institution, Zone, Teacher, InstitutionType } from '../types';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  UserCheck, 
  FileText, 
  Users, 
  Edit, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  X
} from 'lucide-react';

interface InstitutionsViewProps {
  institutions: Institution[];
  zones: Zone[];
  teachers: Teacher[];
  selectedZoneFilter: string;
  setSelectedZoneFilter: (zone: string) => void;
  onAddInstitution: () => void;
  onEditInstitution: (inst: Institution) => void;
  onDeleteInstitution: (instId: string) => void;
  onOpenNewTeacher: (institutionId?: string) => void;
  onStartTeacherEvaluation: (teacherId: string) => void;
  onGenerateInstitutionReport: (instId: string) => void;
  selectedInstitutionId?: string | null;
  setSelectedInstitutionId: (id: string | null) => void;
}

export const InstitutionsView: React.FC<InstitutionsViewProps> = ({
  institutions,
  zones,
  teachers,
  selectedZoneFilter,
  setSelectedZoneFilter,
  onAddInstitution,
  onEditInstitution,
  onDeleteInstitution,
  onOpenNewTeacher,
  onStartTeacherEvaluation,
  onGenerateInstitutionReport,
  selectedInstitutionId,
  setSelectedInstitutionId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInstitutions = institutions.filter((inst) => {
    const matchesZone = selectedZoneFilter === 'all' || inst.zoneId === selectedZoneFilter;
    const matchesType = typeFilter === 'all' || inst.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || inst.status === statusFilter;
    const matchesSearch = 
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.principalName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesType && matchesStatus && matchesSearch;
  });

  const activeInstitution = institutions.find((i) => i.id === selectedInstitutionId);
  const activeInstTeachers = activeInstitution
    ? teachers.filter((t) => t.institutionId === activeInstitution.id)
    : [];

  return (
    <div className="space-y-6">
      
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-800" />
            المدارس الابتدائية حسب الجهات
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            إدارة كافة المدارس الابتدائية والمجمعات المدرسية التابعة لمقاطعة المفتش بن بوزيد وتوزيع أساتذة اللغة العربية عليها.
          </p>
        </div>

        <button
          onClick={onAddInstitution}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مدرسة ابتدائية</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المدرسة، البلدية، المدير..."
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 pr-9 pl-3 text-stone-800 focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          {/* Zone Filter */}
          <div>
            <select
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 px-3 text-stone-800 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="all">كافة جهات المقاطعة ({zones.length} جهات)</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 px-3 text-stone-800 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="all">كافة المدارس الابتدائية</option>
              <option value="مدرسة ابتدائية">مدارس ابتدائية مستقلة</option>
              <option value="مجمع مدرسي ابتدائي">مجمعات مدرسية ابتدائية</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 px-3 text-stone-800 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="all">كافة الحالات البيداغوجية</option>
              <option value="منتظمة">مؤسسات منتظمة ومستقرة</option>
              <option value="تحت المتابعة">تحت المتابعة الخاصة</option>
              <option value="أولوية تفتيشية">أولوية تفتيشية عاجلة</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Content Layout: Grid of Institutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInstitutions.map((inst) => {
          const zone = zones.find((z) => z.id === inst.zoneId);
          const instTeachers = teachers.filter((t) => t.institutionId === inst.id);
          const validScores = instTeachers.filter((t) => t.lastScore > 0).map((t) => t.lastScore);
          const avgScore = validScores.length > 0 
            ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
            : '---';

          return (
            <div
              key={inst.id}
              className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs hover:shadow-xs hover:border-emerald-700/50 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Badges / Header info */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                      {zone?.name || 'غير محدد'}
                    </span>
                    <span className="text-stone-500">·</span>
                    <span className="text-stone-600 font-medium">{inst.type}</span>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    inst.status === 'منتظمة' ? 'bg-emerald-50 text-emerald-800' :
                    inst.status === 'تحت المتابعة' ? 'bg-amber-50 text-amber-800' :
                    'bg-red-50 text-red-800'
                  }`}>
                    {inst.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-stone-900 text-base mb-1.5 line-clamp-1">
                  {inst.name}
                </h3>

                {/* Address & Director */}
                <div className="text-xs text-stone-600 space-y-1 mb-4">
                  <div className="flex items-center gap-1 text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{inst.address} - {inst.city}</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-600">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-800" />
                    <span>المدير(ة): <strong className="text-stone-800">{inst.principalName}</strong></span>
                  </div>
                </div>

                {/* Metrics Box */}
                <div className="bg-stone-50 border border-stone-200/70 rounded-lg p-2.5 grid grid-cols-3 gap-2 text-center text-xs mb-4">
                  <div>
                    <div className="text-[10px] text-stone-500">أساتذة العربية</div>
                    <div className="font-bold font-mono text-stone-900 tabular-nums mt-0.5">
                      {instTeachers.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-500">الأفواج الكلية</div>
                    <div className="font-bold font-mono text-stone-800 tabular-nums mt-0.5">
                      {inst.totalClasses}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-500">المعدل التربوي</div>
                    <div className="font-bold font-mono text-emerald-900 tabular-nums mt-0.5">
                      {avgScore !== '---' ? `${avgScore}/20` : '---'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedInstitutionId(inst.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 font-semibold rounded-lg text-xs transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>فريق الأساتذة ({instTeachers.length})</span>
                </button>

                <button
                  onClick={() => onGenerateInstitutionReport(inst.id)}
                  className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 border border-stone-200 rounded-lg transition-colors"
                  title="توليد ومعاينة التقرير الدوري للمؤسسة"
                >
                  <FileText className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onEditInstitution(inst)}
                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
                  title="تعديل بيانات المؤسسة"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`هل أنت متأكد من حذف ${inst.name}؟`)) {
                      onDeleteInstitution(inst.id);
                    }
                  }}
                  className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 border border-stone-200 rounded-lg transition-colors"
                  title="حذف المؤسسة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredInstitutions.length === 0 && (
        <div className="bg-white border border-stone-200 rounded-xl p-8 text-center text-xs text-stone-500">
          لم يتم العثور على أية مؤسسة تطابق معايير البحث أو التصفية المختارة.
        </div>
      )}

      {/* Institution Details Drawer / Pop-up when selected */}
      {activeInstitution && (
        <div className="fixed inset-0 z-40 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-300">
            
            {/* Header */}
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900">
              <div className="space-y-0.5">
                <div className="text-xs text-emerald-200 flex items-center gap-2">
                  <span>{zones.find((z) => z.id === activeInstitution.zoneId)?.name}</span>
                  <span>·</span>
                  <span>{activeInstitution.type}</span>
                </div>
                <h2 className="text-lg font-bold">{activeInstitution.name}</h2>
              </div>
              <button
                onClick={() => setSelectedInstitutionId(null)}
                className="text-emerald-200 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              
              {/* Institution Metadata Strip */}
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-stone-500 text-[11px]">المدير المسؤول</div>
                  <div className="font-bold text-stone-900 mt-0.5">{activeInstitution.principalName}</div>
                </div>
                <div>
                  <div className="text-stone-500 text-[11px]">الهاتف</div>
                  <div className="font-mono tabular-nums text-stone-800 mt-0.5">{activeInstitution.phone || 'غير مسجل'}</div>
                </div>
                <div>
                  <div className="text-stone-500 text-[11px]">الأفواج التربوية</div>
                  <div className="font-bold font-mono tabular-nums text-stone-800 mt-0.5">{activeInstitution.totalClasses} فوج</div>
                </div>
                <div>
                  <div className="text-stone-500 text-[11px]">الحالة البيداغوجية</div>
                  <div className="font-bold text-emerald-800 mt-0.5">{activeInstitution.status}</div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-stone-800 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-800" />
                  <span>طاقم أساتذة اللغة العربية بالمؤسسة ({activeInstTeachers.length})</span>
                </h4>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onOpenNewTeacher(activeInstitution.id);
                      setSelectedInstitutionId(null);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة أستاذ جديد</span>
                  </button>

                  <button
                    onClick={() => {
                      onGenerateInstitutionReport(activeInstitution.id);
                      setSelectedInstitutionId(null);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-md text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-800" />
                    <span>توليد التقرير الدوري</span>
                  </button>
                </div>
              </div>

              {/* Teachers Table in Institution */}
              <div className="border border-stone-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-stone-700 border-b border-stone-200">
                      <th className="py-2.5 px-3 font-semibold">الأستاذ</th>
                      <th className="py-2.5 px-3 font-semibold">الرتبة</th>
                      <th className="py-2.5 px-3 font-semibold">الأقسام</th>
                      <th className="py-2.5 px-3 font-semibold text-center">آخر نقطة</th>
                      <th className="py-2.5 px-3 font-semibold">الحالة</th>
                      <th className="py-2.5 px-3 font-semibold text-center">التقييم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {activeInstTeachers.map((t) => (
                      <tr key={t.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 font-semibold text-stone-900">{t.fullName}</td>
                        <td className="py-2.5 px-3 text-stone-600">{t.rank}</td>
                        <td className="py-2.5 px-3 text-stone-600">{t.assignedClasses}</td>
                        <td className="py-2.5 px-3 text-center font-bold font-mono text-emerald-900 tabular-nums">
                          {t.lastScore > 0 ? `${t.lastScore}/20` : '---'}
                        </td>
                        <td className="py-2.5 px-3 text-stone-600">{t.inspectionStatus}</td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              onStartTeacherEvaluation(t.id);
                              setSelectedInstitutionId(null);
                            }}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded font-semibold text-[11px] transition-colors"
                          >
                            تفتيش إلكتروني
                          </button>
                        </td>
                      </tr>
                    ))}
                    {activeInstTeachers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-stone-500">
                          لا يوجد أساتذة مسجلين في هذه المؤسسة حالياً. انقر على "إضافة أستاذ جديد".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Institution Notes */}
              {activeInstitution.notes && (
                <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                  <div className="font-bold text-stone-800 mb-1">ملاحظات المفتشية:</div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">{activeInstitution.notes}</p>
                </div>
              )}

            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                onClick={() => setSelectedInstitutionId(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
