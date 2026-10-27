import React, { useState } from 'react';
import { ScheduledVisit, Teacher, Institution } from '../types';
import { X, Calendar, Save } from 'lucide-react';

interface ScheduleModalProps {
  visit?: ScheduledVisit | null;
  teachers: Teacher[];
  institutions: Institution[];
  onSave: (visit: ScheduledVisit) => void;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  visit,
  teachers,
  institutions,
  onSave,
  onClose,
}) => {
  const [teacherId, setTeacherId] = useState(visit?.teacherId || teachers[0]?.id || '');
  const activeTeacher = teachers.find((t) => t.id === teacherId);
  const activeInstitution = institutions.find((i) => i.id === activeTeacher?.institutionId);

  const [plannedDate, setPlannedDate] = useState(
    visit?.plannedDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState(visit?.timeSlot || '08:00 - 10:00');
  const [visitType, setVisitType] = useState<ScheduledVisit['visitType']>(
    visit?.visitType || (activeTeacher?.isTenured ? 'تفتيش ترقية' : 'تفتيش تثبيت')
  );
  const [purpose, setPurpose] = useState(
    visit?.purpose || 'معاينة بيداغوجية لميدان القراءة المشروحة وتدبير أنشطة الإنشاء.'
  );
  const [status, setStatus] = useState<ScheduledVisit['status']>(visit?.status || 'مبرمجة');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeacher || !activeInstitution) return;

    const v: ScheduledVisit = {
      id: visit?.id || `vis-${Date.now()}`,
      teacherId,
      institutionId: activeInstitution.id,
      zoneId: activeInstitution.zoneId,
      plannedDate,
      timeSlot,
      visitType,
      purpose,
      status,
    };
    onSave(v);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden border border-stone-200">
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-bold">
              {visit ? 'تعديل موعد الزيارة التفتيشية' : 'برمجة زيارة تفتيشية جديدة'}
            </h2>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">الأستاذ المستهدف بالزيارة:</label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName} ({t.rank}) - {institutions.find((i) => i.id === t.institutionId)?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">التاريخ المبرمج:</label>
              <input
                type="date"
                required
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 tabular-nums focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">الفترة الزمنية:</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="08:00 - 10:00">08:00 - 10:00 (صباحاً)</option>
                <option value="10:00 - 12:00">10:00 - 12:00 (صباحاً)</option>
                <option value="13:30 - 15:30">13:30 - 15:30 (مساءً)</option>
                <option value="15:30 - 17:00">15:30 - 17:00 (مساءً)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">طبيعة الزيارة:</label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as any)}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="تفتيش تثبيت">تفتيش تثبيت وترسيم</option>
                <option value="تفتيش ترقية">تفتيش ترقية دورية</option>
                <option value="زيارة توجيهية">زيارة توجيهية استطلاعية</option>
                <option value="معاينة صفية">معاينة صفية ومتابعة خاصة</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">حالة البرمجة:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="مبرمجة">مبرمجة وقائمة</option>
                <option value="تمت بنجاح">تمت بنجاح</option>
                <option value="مؤجلة">مؤجلة</option>
                <option value="ملغاة">ملغاة</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">الهدف والموضوع البيداغوجي للزيارة:</label>
            <textarea
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-md p-2.5 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none text-xs"
              placeholder="اكتب الهدف البيداغوجي للزيارة..."
            />
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg font-medium transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{visit ? 'تحديث الموعد' : 'تأكيد البرمجة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
