import React, { useState } from 'react';
import { InspectorProfile, storage } from '../data/storage';
import { X, Settings, Download, Upload, RotateCcw, Save, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  inspector: InspectorProfile;
  onSaveInspector: (profile: InspectorProfile) => void;
  onDataReload: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  inspector,
  onSaveInspector,
  onDataReload,
  onClose,
}) => {
  const [profile, setProfile] = useState<InspectorProfile>({ ...inspector });
  const [importJson, setImportJson] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveInspector(profile);
    setMsg({ type: 'success', text: 'تم حفظ بيانات المفتش والمقاطعة بنجاح.' });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleExport = () => {
    const dataStr = storage.exportBackup();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `arabic_inspectorate_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMsg({ type: 'success', text: 'تم تحميل النسخة الاحتياطية بنجاح.' });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleImport = () => {
    if (!importJson.trim()) {
      setMsg({ type: 'error', text: 'الرجاء لصق محتوى ملف النسخة الاحتياطية بصيغة JSON.' });
      return;
    }
    const success = storage.importBackup(importJson);
    if (success) {
      onDataReload();
      setMsg({ type: 'success', text: 'تم استيراد كافة البيانات بنجاح.' });
      setImportJson('');
      setTimeout(() => {
        setMsg(null);
        onClose();
      }, 1200);
    } else {
      setMsg({ type: 'error', text: 'فشل الاستيراد: تأكد من صحة تنسيق ملف JSON.' });
    }
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في استعادة البيانات الافتراضية؟ سيتم استبدال أية تعديلات غير محفوظة خارجياً.')) {
      storage.resetAllData();
      onDataReload();
      setMsg({ type: 'success', text: 'تمت استعادة البيانات النموذجية الافتراضية بنجاح.' });
      setTimeout(() => {
        setMsg(null);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[96vh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-300 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold">
              إعدادات المفتشية والنسخ الاحتياطي
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

        {/* Feedback message */}
        {msg && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold ${
              msg.type === 'success' ? 'bg-emerald-100 text-emerald-900 border-b border-emerald-200' : 'bg-red-100 text-red-900 border-b border-red-200'
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="p-6 space-y-6 overflow-y-auto text-xs">
          {/* Profile Section */}
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-200 text-stone-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>هوية المفتش وبيانات المقاطعة المعتمدة على الوثائق</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">اسم ولقب المفتش:</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">الصفة والرتبة الرسمية:</label>
                <input
                  type="text"
                  required
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">اسم المقاطعة التفتيشية:</label>
                <input
                  type="text"
                  required
                  value={profile.districtName}
                  onChange={(e) => setProfile({ ...profile, districtName: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">مديرية التربية التابع لها:</label>
                <input
                  type="text"
                  required
                  value={profile.directorate}
                  onChange={(e) => setProfile({ ...profile, directorate: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">الموسم الدراسي:</label>
                <input
                  type="text"
                  required
                  value={profile.academicYear}
                  onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 tabular-nums focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">الهاتف المهني:</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 tabular-nums focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">البريد الإلكتروني المهني:</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>حفظ بيانات المفتشية</span>
              </button>
            </div>
          </form>

          {/* Backup and Restore Section */}
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900">النسخ الاحتياطي وحفظ البيانات محلياً</h3>
                <p className="text-[11px] text-stone-500">
                  تخزن كافة المؤسسات والأساتذة والتقييمات والتقارير بأمان في متصفحك.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-semibold border border-stone-300 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-800" />
                <span>تصدير نسخة JSON</span>
              </button>
            </div>

            {/* Import Box */}
            <div className="space-y-2 bg-stone-50 p-3 rounded-lg border border-stone-200">
              <label className="block font-semibold text-stone-700">
                استيراد نسخة احتياطية من ملف JSON:
              </label>
              <textarea
                rows={2}
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="الصق نص ملف JSON للنسخة الاحتياطية هنا..."
                className="w-full bg-white border border-stone-300 rounded-md p-2 text-stone-800 font-mono text-[11px] focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleImport}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-xs font-semibold transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>تأكيد استيراد البيانات</span>
              </button>
            </div>

            {/* Reset Defaults */}
            <div className="pt-2 flex items-center justify-between text-xs text-stone-600">
              <span>هل ترغب في إعادة تعيين كافة البيانات إلى النموذج الأولي؟</span>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 text-red-700 hover:bg-red-50 border border-red-200 rounded-md font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة البيانات النموذجية</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
