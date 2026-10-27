import React, { useState } from 'react';
import { Teacher, Institution, Zone, TeacherRank, InspectionStatus } from '../types';
import { X, UserPlus, Save } from 'lucide-react';

interface TeacherModalProps {
  teacher?: Teacher | null;
  institutions: Institution[];
  zones: Zone[];
  onSave: (teacher: Teacher) => void;
  onClose: () => void;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  teacher,
  institutions,
  zones,
  onSave,
  onClose,
}) => {
  const [fullName, setFullName] = useState(teacher?.fullName || '');
  const [nationalId, setNationalId] = useState(teacher?.nationalId || `TCH-AR-${Math.floor(10000 + Math.random() * 90000)}`);
  const [institutionId, setInstitutionId] = useState(teacher?.institutionId || institutions[0]?.id || '');
  const [rank, setRank] = useState<TeacherRank>(teacher?.rank || 'أستاذ التعليم الابتدائي');
  const [graduationDegree, setGraduationDegree] = useState(teacher?.graduationDegree || 'شهادة المدرسة العليا لأساتذة التعليم الابتدائي');
  const [recruitmentDate, setRecruitmentDate] = useState(teacher?.recruitmentDate || '2020-09-15');
  const [echelon, setEchelon] = useState<number>(teacher?.echelon || 3);
  const [phone, setPhone] = useState(teacher?.phone || '');
  const [email, setEmail] = useState(teacher?.email || '');
  const [assignedClasses, setAssignedClasses] = useState(teacher?.assignedClasses || 'السنة الثانية ابتدائي');
  const [weeklyHours, setWeeklyHours] = useState<number>(teacher?.weeklyHours || 27);
  const [isTenured, setIsTenured] = useState<boolean>(teacher?.isTenured ?? true);
  const [inspectionStatus, setInspectionStatus] = useState<InspectionStatus>(
    teacher?.inspectionStatus || 'مبرمج للزيارة'
  );
  const [lastScore, setLastScore] = useState<number>(teacher?.lastScore || 15);
  const [lastInspectionDate, setLastInspectionDate] = useState<string>(teacher?.lastInspectionDate || '');

  const selectedInst = institutions.find((i) => i.id === institutionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tData: Teacher = {
      id: teacher?.id || `tch-${Date.now()}`,
      fullName,
      nationalId,
      institutionId,
      zoneId: selectedInst?.zoneId || zones[0]?.id || '',
      rank,
      graduationDegree,
      recruitmentDate,
      echelon: Number(echelon),
      phone,
      email,
      assignedClasses,
      weeklyHours: Number(weeklyHours),
      isTenured,
      lastInspectionDate: lastInspectionDate || '---',
      lastScore: Number(lastScore),
      inspectionStatus,
    };
    onSave(tData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[96vh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
        <div className="bg-emerald-950 text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-300 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold">
              {teacher ? 'تعديل ملف أستاذ اللغة العربية' : 'تسجيل أستاذ لغة عربية جديد بالمقاطعة'}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="min-h-[40px] min-w-[40px] p-2 text-emerald-200 hover:text-white transition-colors flex items-center justify-center"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">الاسم واللقب كاملاً:</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أ. فلان الفلاني"
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">المدرسة الابتدائية المسند إليها:</label>
              <select
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">الرتبة التربوية (الطور الابتدائي):</label>
              <select
                value={rank}
                onChange={(e) => {
                  const newRank = e.target.value as TeacherRank;
                  setRank(newRank);
                  if (newRank.includes('متربص') || newRank.includes('متعاقد')) setIsTenured(false);
                  else setIsTenured(true);
                }}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="أستاذ مكون في التعليم الابتدائي">أستاذ مكون في التعليم الابتدائي</option>
                <option value="أستاذ رئيسي في التعليم الابتدائي">أستاذ رئيسي في التعليم الابتدائي</option>
                <option value="أستاذ التعليم الابتدائي">أستاذ التعليم الابتدائي</option>
                <option value="أستاذ متربص (تعليم ابتدائي)">أستاذ متربص (تعليم ابتدائي)</option>
                <option value="أستاذ متعاقد (تعليم ابتدائي)">أستاذ متعاقد (تعليم ابتدائي)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">المؤهل العلمي / شهادة التخرج:</label>
              <input
                type="text"
                value={graduationDegree}
                onChange={(e) => setGraduationDegree(e.target.value)}
                placeholder="مثال: شهادة المدرسة العليا لأساتذة التعليم الابتدائي، ليسانس لغة عربية..."
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">المستوى والفوج المسند بالابتدائي:</label>
              <input
                type="text"
                value={assignedClasses}
                onChange={(e) => setAssignedClasses(e.target.value)}
                placeholder="مثال: السنة الأولى ابتدائي (فوج 1)، السنة الخامسة..."
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">الحجم الساعي الأسبوعي (ساعة):</label>
              <input
                type="number"
                min={1}
                max={30}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 tabular-nums focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">تاريخ التوظيف:</label>
              <input
                type="date"
                value={recruitmentDate}
                onChange={(e) => setRecruitmentDate(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 tabular-nums focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">الدرجة الحالية (Echelon):</label>
              <input
                type="number"
                min={0}
                max={12}
                value={echelon}
                onChange={(e) => setEchelon(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 tabular-nums focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">حالة الترسيم والتثبيت:</label>
              <select
                value={isTenured ? 'true' : 'false'}
                onChange={(e) => setIsTenured(e.target.value === 'true')}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="true">أستاذ مرسم ومثبت</option>
                <option value="false">أستاذ غير مثبت (متربص أو متعاقد)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">الحالة التفتيشية في المقاطعة:</label>
              <select
                value={inspectionStatus}
                onChange={(e) => setInspectionStatus(e.target.value as InspectionStatus)}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="مفتش هذا الفصل">مفتش هذا الفصل</option>
                <option value="مبرمج للزيارة">مبرمج للزيارة</option>
                <option value="بحاجة لزيارة توجيهية">بحاجة لزيارة توجيهية</option>
                <option value="في انتظار التثبيت">في انتظار التثبيت والترسيم</option>
                <option value="مستقر بيداغوجياً">مستقر بيداغوجياً</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">الهاتف:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0660-00-00-00"
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 tabular-nums focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">البريد الإلكتروني:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@education.dz"
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[42px] sm:min-h-[38px] px-5 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg font-medium transition-colors flex items-center justify-center text-xs"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="min-h-[42px] sm:min-h-[38px] flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white rounded-lg font-bold shadow-xs transition-colors text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{teacher ? 'تحديث الملف' : 'إضافة الأستاذ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
