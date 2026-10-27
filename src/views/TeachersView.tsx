import React, { useState } from 'react';
import { Teacher, Institution, Zone, InspectionEvaluation } from '../types';
import { 
  Users, 
  Plus, 
  Search, 
  GraduationCap, 
  Calendar, 
  ClipboardCheck, 
  Eye, 
  Edit, 
  Trash2, 
  CalendarPlus, 
  Award,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface TeachersViewProps {
  teachers: Teacher[];
  institutions: Institution[];
  zones: Zone[];
  evaluations: InspectionEvaluation[];
  selectedZoneFilter: string;
  setSelectedZoneFilter: (zone: string) => void;
  onAddTeacher: () => void;
  onEditTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onStartEvaluation: (teacherId: string) => void;
  onViewEvaluation: (evalId: string) => void;
  onScheduleVisit: (teacherId: string) => void;
}

export const TeachersView: React.FC<TeachersViewProps> = ({
  teachers,
  institutions,
  zones,
  evaluations,
  selectedZoneFilter,
  setSelectedZoneFilter,
  onAddTeacher,
  onEditTeacher,
  onDeleteTeacher,
  onStartEvaluation,
  onViewEvaluation,
  onScheduleVisit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitutionFilter, setSelectedInstitutionFilter] = useState('all');
  const [rankFilter, setRankFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTeachers = teachers.filter((t) => {
    const matchesZone = selectedZoneFilter === 'all' || t.zoneId === selectedZoneFilter;
    const matchesInst = selectedInstitutionFilter === 'all' || t.institutionId === selectedInstitutionFilter;
    const matchesRank = rankFilter === 'all' || t.rank === rankFilter;
    const matchesStatus = statusFilter === 'all' || t.inspectionStatus === statusFilter;
    const matchesSearch = 
      t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.graduationDegree.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nationalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedClasses.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesZone && matchesInst && matchesRank && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-800" />
            سجل أساتذة اللغة العربية بمرحلة التعليم الابتدائي
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            متابعة السيرة المهنية والبيداغوجية لكافة أساتذة الطور الابتدائي بمقاطعة المفتش بن بوزيد، الرتب، الأفواج، ونقاط التفتيش.
          </p>
        </div>

        <button
          onClick={onAddTeacher}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة أستاذ جديد</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          
          {/* Search */}
          <div className="relative lg:col-span-1">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، الشهادة، الفوج..."
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
              <option value="all">كافة الجهات</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          {/* Institution Filter */}
          <div>
            <select
              value={selectedInstitutionFilter}
              onChange={(e) => setSelectedInstitutionFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 px-3 text-stone-800 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="all">كافة المؤسسات</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rank Filter */}
          <div>
            <select
              value={rankFilter}
              onChange={(e) => setRankFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 px-3 text-stone-800 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="all">كافة رتب التعليم الابتدائي</option>
              <option value="أستاذ مكون في التعليم الابتدائي">أستاذ مكون في التعليم الابتدائي</option>
              <option value="أستاذ رئيسي في التعليم الابتدائي">أستاذ رئيسي في التعليم الابتدائي</option>
              <option value="أستاذ التعليم الابتدائي">أستاذ التعليم الابتدائي</option>
              <option value="أستاذ متربص (تعليم ابتدائي)">أستاذ متربص (تعليم ابتدائي)</option>
              <option value="أستاذ متعاقد (تعليم ابتدائي)">أستاذ متعاقد (تعليم ابتدائي)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 px-3 text-stone-800 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="all">كافة الوضعيات التفتيشية</option>
              <option value="مفتش هذا الفصل">مفتش هذا الفصل</option>
              <option value="مبرمج للزيارة">مبرمج للزيارة</option>
              <option value="بحاجة لزيارة توجيهية">بحاجة لزيارة توجيهية</option>
              <option value="في انتظار التثبيت">في انتظار التثبيت</option>
              <option value="مستقر بيداغوجياً">مستقر بيداغوجياً</option>
            </select>
          </div>

        </div>
      </div>

      {/* Teachers Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => {
          const inst = institutions.find((i) => i.id === teacher.institutionId);
          const zone = zones.find((z) => z.id === teacher.zoneId);
          const latestEval = evaluations.find((e) => e.teacherId === teacher.id);

          return (
            <div
              key={teacher.id}
              className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs hover:shadow-xs hover:border-emerald-700/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Header Strip */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                      {zone?.name || 'الجهة'}
                    </span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-500 font-mono">{teacher.nationalId}</span>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    teacher.isTenured ? 'bg-stone-100 text-stone-700' : 'bg-amber-50 text-amber-900 font-bold'
                  }`}>
                    {teacher.isTenured ? 'مثبت ومرسم' : 'متربص قيد التثبيت'}
                  </span>
                </div>

                {/* Teacher Name & Rank */}
                <div>
                  <h3 className="font-bold text-stone-900 text-base leading-snug">
                    {teacher.fullName}
                  </h3>
                  <div className="text-xs text-stone-600 font-medium mt-0.5">
                    {teacher.rank} · الدرجة: <strong className="tabular-nums font-mono text-stone-800">{teacher.echelon}</strong>
                  </div>
                </div>

                {/* Institution and Classes */}
                <div className="space-y-1 text-xs text-stone-600">
                  <div className="font-medium text-emerald-950">
                    {inst?.name || 'مؤسسة غير محددة'}
                  </div>
                  <div className="text-stone-500 text-[11px] flex items-center gap-2">
                    <span>الأقسام: <strong className="text-stone-700">{teacher.assignedClasses}</strong></span>
                    <span>·</span>
                    <span>{teacher.weeklyHours} سا/أسبوع</span>
                  </div>
                  <div className="text-stone-500 text-[11px] truncate flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{teacher.graduationDegree}</span>
                  </div>
                </div>

                {/* Inspection Score & Status Box */}
                <div className="bg-stone-50 border border-stone-200/70 rounded-lg p-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-stone-500">آخر نقطة تفتيشية:</div>
                    <div className="text-sm font-bold font-mono text-emerald-900 tabular-nums">
                      {teacher.lastScore > 0 ? `${teacher.lastScore} / 20` : 'لم يفتش بعد'}
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="text-[10px] text-stone-500">الوضعية الحالية:</div>
                    <div className="text-[11px] font-semibold text-stone-800">
                      {teacher.inspectionStatus}
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3.5 mt-3 border-t border-stone-100 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => onStartEvaluation(teacher.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>تفتيش إلكتروني</span>
                </button>

                {latestEval && (
                  <button
                    onClick={() => onViewEvaluation(latestEval.id)}
                    className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 border border-stone-200 rounded-lg transition-colors"
                    title="معاينة بطاقة التفتيش الرسمية"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => onScheduleVisit(teacher.id)}
                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
                  title="برمجة زيارة في الرزنامة"
                >
                  <CalendarPlus className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onEditTeacher(teacher)}
                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
                  title="تعديل الملف"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`هل أنت متأكد من حذف ملف ${teacher.fullName}؟`)) {
                      onDeleteTeacher(teacher.id);
                    }
                  }}
                  className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 border border-stone-200 rounded-lg transition-colors"
                  title="حذف الأستاذ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="bg-white border border-stone-200 rounded-xl p-8 text-center text-xs text-stone-500">
          لم يتم العثور على أية أساتذة يطابقون شروط البحث والتصفية.
        </div>
      )}

    </div>
  );
};
