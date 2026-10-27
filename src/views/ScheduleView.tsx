import React, { useState } from 'react';
import { ScheduledVisit, Teacher, Institution, Zone } from '../types';
import { 
  CalendarDays, 
  Plus, 
  Search, 
  Clock, 
  Building2, 
  ClipboardCheck, 
  CheckCircle2, 
  Edit, 
  Trash2, 
  Check, 
  AlertCircle
} from 'lucide-react';

interface ScheduleViewProps {
  schedule: ScheduledVisit[];
  teachers: Teacher[];
  institutions: Institution[];
  zones: Zone[];
  selectedZoneFilter: string;
  setSelectedZoneFilter: (zone: string) => void;
  onAddVisit: () => void;
  onEditVisit: (visit: ScheduledVisit) => void;
  onDeleteVisit: (visitId: string) => void;
  onStartEvaluationFromVisit: (teacherId: string) => void;
  onUpdateVisitStatus: (visitId: string, status: ScheduledVisit['status']) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedule,
  teachers,
  institutions,
  zones,
  selectedZoneFilter,
  setSelectedZoneFilter,
  onAddVisit,
  onEditVisit,
  onDeleteVisit,
  onStartEvaluationFromVisit,
  onUpdateVisitStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVisits = schedule.filter((v) => {
    const tch = teachers.find((t) => t.id === v.teacherId);
    const inst = institutions.find((i) => i.id === v.institutionId);

    const matchesZone = selectedZoneFilter === 'all' || v.zoneId === selectedZoneFilter;
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesSearch = 
      (tch?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inst?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesZone && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-emerald-800" />
            رزنامة الزيارات التفتيشية والمعاينات الصفية
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            جدول المواعيد البيداغوجية، تنظيم زيارات التثبيت والترقية، وتتبع إنجاز الزيارات الميدانية.
          </p>
        </div>

        <button
          onClick={onAddVisit}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>برمجة زيارة تفتيشية جديدة</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالأستاذ، المؤسسة، موضوع الزيارة..."
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 pr-9 pl-3 text-stone-800 focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 px-3 text-stone-800 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="all">كافة الجهات التفتيشية</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 px-3 text-stone-800 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="all">كافة حالات البرمجة</option>
              <option value="مبرمجة">مبرمجة وقائمة</option>
              <option value="تمت بنجاح">تمت بنجاح</option>
              <option value="مؤجلة">مؤجلة</option>
              <option value="ملغاة">ملغاة</option>
            </select>
          </div>

        </div>
      </div>

      {/* Visits List (Responsive with horizontal touch scroll on mobile/tablet) */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-stone-50 text-stone-700 border-b border-stone-200">
                <th className="py-3 px-4 font-semibold">التاريخ والتوقيت</th>
                <th className="py-3 px-4 font-semibold">الأستاذ المستهدف</th>
                <th className="py-3 px-4 font-semibold">المؤسسة والجهة</th>
                <th className="py-3 px-4 font-semibold">نوع الزيارة والهدف البيداغوجي</th>
                <th className="py-3 px-4 font-semibold text-center">الحالة</th>
                <th className="py-3 px-4 font-semibold text-center">إجراءات المفتش</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
            {filteredVisits.map((visit) => {
              const tch = teachers.find((t) => t.id === visit.teacherId);
              const inst = institutions.find((i) => i.id === visit.institutionId);
              const zone = zones.find((z) => z.id === visit.zoneId);

              return (
                <tr key={visit.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-stone-900 font-mono tabular-nums">{visit.plannedDate}</div>
                    <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{visit.timeSlot}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900">{tch?.fullName || 'أستاذ'}</div>
                    <div className="text-[10px] text-stone-500">{tch?.rank} ({tch?.assignedClasses})</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-800">{inst?.name}</div>
                    <div className="text-[10px] text-emerald-800">{zone?.name}</div>
                  </td>

                  <td className="py-3 px-4 max-w-sm">
                    <span className="font-semibold text-stone-800 block text-[11px] mb-0.5">
                      {visit.visitType}
                    </span>
                    <p className="text-stone-600 text-[11px] line-clamp-1">{visit.purpose}</p>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <select
                      value={visit.status}
                      onChange={(e) => onUpdateVisitStatus(visit.id, e.target.value as any)}
                      className={`text-[10px] font-semibold py-1 px-2 rounded border focus:outline-none cursor-pointer ${
                        visit.status === 'تمت بنجاح' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        visit.status === 'مبرمجة' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      <option value="مبرمجة">مبرمجة</option>
                      <option value="تمت بنجاح">تمت بنجاح</option>
                      <option value="مؤجلة">مؤجلة</option>
                      <option value="ملغاة">ملغاة</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onStartEvaluationFromVisit(visit.teacherId)}
                        className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                        title="إجراء التفتيش الآن"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        <span>تقييم</span>
                      </button>

                      <button
                        onClick={() => onEditVisit(visit)}
                        className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-md transition-colors"
                        title="تعديل الموعد"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('هل تريد حذف هذه الزيارة من الرزنامة؟')) {
                            onDeleteVisit(visit.id);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="حذف الزيارة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredVisits.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-stone-500">
                  لا توجد زيارات تفتيشية مسجلة وفق التصفية الحالية.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

    </div>
  );
};
