import React, { useState } from 'react';
import { Institution, Zone, InstitutionType, InstitutionStatus } from '../types';
import { X, Building2, Save } from 'lucide-react';

interface InstitutionModalProps {
  institution?: Institution | null;
  zones: Zone[];
  onSave: (institution: Institution) => void;
  onClose: () => void;
}

export const InstitutionModal: React.FC<InstitutionModalProps> = ({
  institution,
  zones,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(institution?.name || '');
  const [type, setType] = useState<InstitutionType>(institution?.type || 'مدرسة ابتدائية');
  const [zoneId, setZoneId] = useState(institution?.zoneId || zones[0]?.id || '');
  const [city, setCity] = useState(institution?.city || '');
  const [address, setAddress] = useState(institution?.address || '');
  const [phone, setPhone] = useState(institution?.phone || '');
  const [principalName, setPrincipalName] = useState(institution?.principalName || '');
  const [totalClasses, setTotalClasses] = useState(institution?.totalClasses || 20);
  const [status, setStatus] = useState<InstitutionStatus>(institution?.status || 'منتظمة');
  const [academicYear, setAcademicYear] = useState(institution?.academicYear || '2025/2026');
  const [notes, setNotes] = useState(institution?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const instData: Institution = {
      id: institution?.id || `inst-${Date.now()}`,
      name,
      type,
      zoneId,
      city,
      address,
      phone,
      principalName,
      totalClasses: Number(totalClasses),
      status,
      academicYear,
      notes,
    };
    onSave(instData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden border border-stone-200">
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-bold">
              {institution ? 'تعديل بيانات المؤسسة التعليمية' : 'إضافة مؤسسة تعليمية جديدة للمقاطعة'}
            </h2>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">اسم المدرسة الابتدائية:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: مدرسة الشهيد العربي بن مهيدي الابتدائية"
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">نوع المرفق التعليمي (ابتدائي):</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InstitutionType)}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="مدرسة ابتدائية">مدرسة ابتدائية مستقلة</option>
                <option value="مجمع مدرسي ابتدائي">مجمع مدرسي ابتدائي</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">الجهة الجغرافية التابعة لها:</label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">مدير(ة) المؤسسة:</label>
              <input
                type="text"
                required
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                placeholder="الاسم واللقب"
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">الحالة البيداغوجية:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InstitutionStatus)}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="منتظمة">منتظمة ومستقرة</option>
                <option value="تحت المتابعة">تحت المتابعة الخاصة</option>
                <option value="أولوية تفتيشية">أولوية تفتيشية عاجلة</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">البلدية / الدائرة:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="المدينة أو البلدية"
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">رقم الهاتف:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="021-00-00-00"
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 tabular-nums focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">العنوان التفصيلي:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="العنوان الكامل للمؤسسة"
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">ملاحظات المفتش حول المؤسسة:</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ملاحظات حول الطاقم التربوي للغة العربية، الاحتياجات البيداغوجية..."
                className="w-full bg-white border border-stone-300 rounded-md p-2.5 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none text-xs"
              />
            </div>
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
              <span>{institution ? 'حفظ التعديلات' : 'تسجيل المؤسسة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
