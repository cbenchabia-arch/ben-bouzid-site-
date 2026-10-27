import React from 'react';
import { 
  Building2, 
  Users, 
  ClipboardCheck, 
  CalendarDays, 
  TrendingUp, 
  Compass, 
  Eye, 
  Printer, 
  ChevronLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Zone, Institution, Teacher, InspectionEvaluation, ScheduledVisit } from '../types';
import { InspectorProfile } from '../data/storage';

interface DashboardViewProps {
  zones: Zone[];
  institutions: Institution[];
  teachers: Teacher[];
  evaluations: InspectionEvaluation[];
  schedule: ScheduledVisit[];
  inspector: InspectorProfile;
  selectedZoneFilter: string;
  setSelectedZoneFilter: (zone: string) => void;
  onNavigateToTab: (tab: 'dashboard' | 'institutions' | 'teachers' | 'evaluation' | 'reports' | 'schedule') => void;
  onViewEvaluationCard: (evalId: string) => void;
  onStartNewEvaluation: (teacherId?: string) => void;
  onViewInstitutionDetails: (instId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  zones,
  institutions,
  teachers,
  evaluations,
  schedule,
  inspector,
  selectedZoneFilter,
  setSelectedZoneFilter,
  onNavigateToTab,
  onViewEvaluationCard,
  onStartNewEvaluation,
  onViewInstitutionDetails,
}) => {
  // Filter by zone if active
  const filteredInstitutions = selectedZoneFilter === 'all'
    ? institutions
    : institutions.filter((i) => i.zoneId === selectedZoneFilter);

  const filteredTeachers = selectedZoneFilter === 'all'
    ? teachers
    : teachers.filter((t) => t.zoneId === selectedZoneFilter);

  const evaluatedTeachersCount = filteredTeachers.filter((t) => t.lastScore > 0).length;
  const coverageRate = filteredTeachers.length > 0 
    ? Math.round((evaluatedTeachersCount / filteredTeachers.length) * 100) 
    : 0;

  const validScores = filteredTeachers.filter((t) => t.lastScore > 0).map((t) => t.lastScore);
  const averageScore = validScores.length > 0
    ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
    : '---';

  const upcomingVisits = schedule
    .filter((v) => selectedZoneFilter === 'all' || v.zoneId === selectedZoneFilter)
    .filter((v) => v.status === 'مبرمجة')
    .slice(0, 4);

  const recentEvaluations = evaluations
    .filter((e) => selectedZoneFilter === 'all' || e.zoneId === selectedZoneFilter)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome / Inspector Context */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              المقاطعة التفتيشية المعتمدة
            </span>
            <span className="text-xs text-stone-500">·</span>
            <span className="text-xs text-stone-600 font-medium">{inspector.academicYear}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            {inspector.districtName}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            مرحباً بك، <strong>{inspector.name}</strong> ({inspector.title}). إليك المتابعة الشاملة لجميع جهات المقاطعة والمدارس الابتدائية، وحصيلة التقييم البيداغوجي لأساتذة مادة اللغة العربية بالطور الابتدائي.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onStartNewEvaluation()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors whitespace-nowrap"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>إجراء تفتيش إلكتروني جديد</span>
          </button>
          <button
            onClick={() => onNavigateToTab('reports')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <TrendingUp className="w-4 h-4 text-emerald-800" />
            <span>التقارير الدورية للمقاطعة</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Institutions */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs hover:border-emerald-700/40 transition-colors">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>المدارس الابتدائية</span>
            <Building2 className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
              {filteredInstitutions.length}
            </span>
            <span className="text-xs text-stone-500">مدرسة ابتدائية</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-2 flex items-center justify-between border-t border-stone-100 pt-1.5">
            <span>مدارس مستقلة: {filteredInstitutions.filter(i => i.type === 'مدرسة ابتدائية').length}</span>
            <span>مجمعات: {filteredInstitutions.filter(i => i.type === 'مجمع مدرسي ابتدائي').length}</span>
          </div>
        </div>

        {/* Teachers */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs hover:border-emerald-700/40 transition-colors">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>أساتذة اللغة العربية</span>
            <Users className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
              {filteredTeachers.length}
            </span>
            <span className="text-xs text-stone-500">أستاذاً مسجلاً</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-2 flex items-center justify-between border-t border-stone-100 pt-1.5">
            <span>مرسمون: {filteredTeachers.filter(t => t.isTenured).length}</span>
            <span className="text-amber-800 font-medium">متربصون: {filteredTeachers.filter(t => !t.isTenured).length}</span>
          </div>
        </div>

        {/* Inspection Coverage */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs hover:border-emerald-700/40 transition-colors">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>نسبة التغطية التفتيشية</span>
            <ClipboardCheck className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-mono tabular-nums">
              {coverageRate}%
            </span>
            <span className="text-xs text-stone-500">({evaluatedTeachersCount}/{filteredTeachers.length})</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div 
              className="bg-emerald-700 h-1.5 rounded-full transition-all"
              style={{ width: `${coverageRate}%` }}
            />
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs hover:border-emerald-700/40 transition-colors">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>متوسط النقطة التفتيشية</span>
            <TrendingUp className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
              {averageScore}
            </span>
            <span className="text-xs text-emerald-800 font-bold">/ 20</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-2 border-t border-stone-100 pt-1.5">
            <span>التقدير العام: </span>
            <strong className="text-emerald-900">
              {typeof averageScore === 'string' && parseFloat(averageScore) >= 16 ? 'جيد جداً' : 'جيد ومستقر'}
            </strong>
          </div>
        </div>

      </div>

      {/* Geographic District Sectors Breakdown (مقسم على حسب الجهة) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">
              هيكلة المقاطعة التفتيشية حسب الجهات الجغرافية
            </h2>
          </div>
          <button
            onClick={() => setSelectedZoneFilter('all')}
            className={`text-xs px-2.5 py-1 rounded transition-colors ${
              selectedZoneFilter === 'all'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            عرض الكل ({zones.length} جهات)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((zone) => {
            const isSelected = selectedZoneFilter === zone.id;
            const zoneInstitutions = institutions.filter((i) => i.zoneId === zone.id);
            const zoneTeachers = teachers.filter((t) => t.zoneId === zone.id);
            const evaluatedCount = zoneTeachers.filter((t) => t.lastScore > 0).length;
            const zoneScores = zoneTeachers.filter((t) => t.lastScore > 0).map((t) => t.lastScore);
            const zoneAvg = zoneScores.length > 0
              ? (zoneScores.reduce((a, b) => a + b, 0) / zoneScores.length).toFixed(1)
              : '---';

            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZoneFilter(isSelected ? 'all' : zone.id)}
                className={`cursor-pointer rounded-xl p-4 border transition-all text-right relative overflow-hidden ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-700 ring-2 ring-emerald-700/20 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-emerald-600/50 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-100">
                    {zone.code}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                      محددة حالياً
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-stone-900 mb-1">
                  {zone.name}
                </h3>
                <p className="text-[11px] text-stone-500 mb-3 line-clamp-2 leading-relaxed">
                  {zone.description}
                </p>

                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-stone-200/60 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-stone-500">المؤسسات</div>
                    <div className="font-bold text-stone-800 font-mono tabular-nums">{zoneInstitutions.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-500">الأساتذة</div>
                    <div className="font-bold text-stone-800 font-mono tabular-nums">{zoneTeachers.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-500">المعدل</div>
                    <div className="font-bold text-emerald-900 font-mono tabular-nums">{zoneAvg}</div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>تم تفتيشهم:</span>
                  <span className="font-semibold text-stone-800 tabular-nums">
                    {evaluatedCount} من {zoneTeachers.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Upcoming Visits & Recent Inspections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column 1: Upcoming Scheduled Visits */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-emerald-800" />
              <h3 className="font-bold text-sm text-stone-900">
                برنامج الزيارات التفتيشية القادمة
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab('schedule')}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1"
            >
              <span>فتح الرزنامة كاملة</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {upcomingVisits.length > 0 ? (
              upcomingVisits.map((visit) => {
                const tch = teachers.find((t) => t.id === visit.teacherId);
                const inst = institutions.find((i) => i.id === visit.institutionId);
                return (
                  <div key={visit.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-stone-900 flex items-center gap-2">
                        <span>{tch?.fullName || 'أستاذ'}</span>
                        <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded font-medium">
                          {visit.visitType}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {inst?.name} · الفوج: {tch?.assignedClasses}
                      </div>
                      <div className="text-[11px] text-stone-600 italic">
                        "{visit.purpose}"
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <div className="font-bold text-emerald-900 font-mono tabular-nums">
                        {visit.plannedDate}
                      </div>
                      <div className="text-[10px] text-stone-400 tabular-nums">
                        {visit.timeSlot}
                      </div>
                      <button
                        onClick={() => onStartNewEvaluation(visit.teacherId)}
                        className="mt-1.5 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px] transition-colors"
                      >
                        بدء التفتيش
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-stone-500">
                لا توجد زيارات مبرمجة حالياً في هذه الجهة.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Recent Official Inspections */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-emerald-800" />
              <h3 className="font-bold text-sm text-stone-900">
                أحدث بطاقات التفتيش والتقييم المعتمدة
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab('evaluation')}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1"
            >
              <span>سجل التقييمات</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {recentEvaluations.length > 0 ? (
              recentEvaluations.map((evalItem) => {
                const tch = teachers.find((t) => t.id === evalItem.teacherId);
                const inst = institutions.find((i) => i.id === evalItem.institutionId);
                return (
                  <div key={evalItem.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-stone-900 flex items-center gap-2">
                        <span>{tch?.fullName || 'الأستاذ'}</span>
                        <span className="text-[10px] text-emerald-900 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                          {evalItem.inspectionType}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {inst?.name} · {evalItem.subjectBranch}
                      </div>
                      <div className="text-[10px] text-stone-400 tabular-nums">
                        تاريخ المعاينة: {evalItem.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-left">
                        <div className="font-extrabold text-emerald-900 font-mono text-base tabular-nums">
                          {evalItem.totalScore}
                          <span className="text-[10px] text-stone-400 mr-0.5">/20</span>
                        </div>
                        <div className="text-[9px] text-stone-500">
                          {evalItem.appreciation.split('-')[0]}
                        </div>
                      </div>

                      <button
                        onClick={() => onViewEvaluationCard(evalItem.id)}
                        className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition-colors"
                        title="معاينة وطباعة بطاقة التفتيش الرسمية"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-stone-500">
                لم يتم تسجيل أي بطاقات تقييم بعد في هذا النطاق.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Quick Institutions List on Dashboard */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-800" />
            <h3 className="font-bold text-sm text-stone-900">
              المدارس الابتدائية بالمقاطعة (حالة المتابعة والجاهزية)
            </h3>
          </div>
          <button
            onClick={() => onNavigateToTab('institutions')}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1"
          >
            <span>إدارة جميع المدارس الابتدائية</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <th className="py-2.5 px-3 font-semibold">المدرسة الابتدائية</th>
                <th className="py-2.5 px-3 font-semibold">الجهة</th>
                <th className="py-2.5 px-3 font-semibold">النوع</th>
                <th className="py-2.5 px-3 font-semibold text-center">أساتذة الابتدائي</th>
                <th className="py-2.5 px-3 font-semibold text-center">المعدل العام</th>
                <th className="py-2.5 px-3 font-semibold">الحالة البيداغوجية</th>
                <th className="py-2.5 px-3 font-semibold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredInstitutions.slice(0, 5).map((inst) => {
                const zone = zones.find((z) => z.id === inst.zoneId);
                const instTeachers = teachers.filter((t) => t.institutionId === inst.id);
                const scores = instTeachers.filter((t) => t.lastScore > 0).map((t) => t.lastScore);
                const avg = scores.length > 0 
                  ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) 
                  : '---';

                return (
                  <tr key={inst.id} className="hover:bg-stone-50/70">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-stone-900">{inst.name}</div>
                      <div className="text-[10px] text-stone-500">المدير: {inst.principalName}</div>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">{zone?.name}</td>
                    <td className="py-2.5 px-3 text-stone-700">{inst.type}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-stone-800 font-mono tabular-nums">
                      {instTeachers.length}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-900 font-mono tabular-nums">
                      {avg !== '---' ? `${avg}/20` : '---'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        inst.status === 'منتظمة' ? 'bg-emerald-50 text-emerald-800' :
                        inst.status === 'تحت المتابعة' ? 'bg-amber-50 text-amber-800' :
                        'bg-red-50 text-red-800'
                      }`}>
                        {inst.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onViewInstitutionDetails(inst.id)}
                        className="px-2.5 py-1 text-emerald-800 hover:bg-emerald-50 border border-emerald-200 rounded text-[11px] font-medium transition-colors"
                      >
                        عرض الملف
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
