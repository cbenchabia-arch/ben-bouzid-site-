import React from 'react';
import { PeriodicReport, Institution, Teacher, Zone } from '../types';
import { InspectorProfile } from '../data/storage';
import { Printer, X, FileText, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react';

interface PrintableInstitutionReportProps {
  report: PeriodicReport;
  institution?: Institution;
  teachers: Teacher[];
  zone?: Zone;
  inspector: InspectorProfile;
  onClose: () => void;
}

export const PrintableInstitutionReport: React.FC<PrintableInstitutionReportProps> = ({
  report,
  institution,
  teachers,
  zone,
  inspector,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-300">
        
        {/* Toolbar */}
        <div className="no-print bg-stone-100 border-b border-stone-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-800" />
            <h2 className="font-bold text-stone-800 text-sm md:text-base">
              معاينة التقرير التفتيشي الدوري للمؤسسة (نسق رسمي A4)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة التقرير</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper */}
        <div className="p-8 overflow-y-auto bg-white font-sans text-stone-900 print:p-0 print:m-0">
          
          {/* Header */}
          <div className="border-b-2 border-stone-900 pb-4 mb-6">
            <div className="text-center space-y-1 mb-3">
              <h1 className="text-base font-bold font-serif text-stone-900">الجمهورية الجزائرية الديمقراطية الشعبية</h1>
              <h2 className="text-sm font-semibold text-stone-800">وزارة التربية الوطنية</h2>
              <div className="flex justify-between items-center text-xs text-stone-700 px-4 pt-1 font-medium">
                <div>{inspector.directorate}</div>
                <div>الفترة: <strong className="text-stone-900">{report.academicPeriod}</strong></div>
                <div>{inspector.districtName}</div>
              </div>
            </div>

            <div className="bg-emerald-900 text-amber-200 py-3 px-4 rounded text-center">
              <h3 className="text-lg font-bold font-serif">
                {report.title}
              </h3>
              <div className="text-xs text-emerald-100 mt-1 flex justify-center items-center gap-4">
                <span>المؤسسة: <strong className="text-white">{institution?.name || 'المقاطعة كاملة'}</strong></span>
                <span>·</span>
                <span>الجهة التفتيشية: <strong className="text-white">{zone?.name || 'كافة الجهات'}</strong></span>
                <span>·</span>
                <span>تاريخ التقرير: <strong className="tabular-nums text-white">{report.date}</strong></span>
              </div>
            </div>
          </div>

          {/* Institutional Overview & KPIs */}
          <div className="grid grid-cols-4 gap-3 text-center mb-6">
            <div className="border border-stone-300 p-2.5 rounded bg-stone-50/70">
              <div className="text-[11px] text-stone-500 font-medium">عدد أساتذة اللغة العربية</div>
              <div className="text-xl font-bold font-mono text-stone-900 mt-0.5 tabular-nums">
                {teachers.length}
              </div>
            </div>

            <div className="border border-stone-300 p-2.5 rounded bg-stone-50/70">
              <div className="text-[11px] text-stone-500 font-medium">الأساتذة المفتشون</div>
              <div className="text-xl font-bold font-mono text-emerald-800 mt-0.5 tabular-nums">
                {report.teachersEvaluated} / {report.totalTeachersInTarget}
              </div>
            </div>

            <div className="border border-stone-300 p-2.5 rounded bg-stone-50/70">
              <div className="text-[11px] text-stone-500 font-medium">نسبة إنجاز المنهاج</div>
              <div className="text-xl font-bold font-mono text-stone-900 mt-0.5 tabular-nums">
                {report.curriculumProgressPercent}%
              </div>
            </div>

            <div className="border border-stone-300 p-2.5 rounded bg-stone-50/70">
              <div className="text-[11px] text-stone-500 font-medium">معدل التقييم التربوي</div>
              <div className="text-xl font-bold font-mono text-emerald-900 mt-0.5 tabular-nums">
                {report.averageDistrictScore.toFixed(1)} / 20
              </div>
            </div>
          </div>

          {/* Institutional Card Information */}
          {institution && (
            <div className="mb-6 border border-stone-200 p-3.5 rounded bg-stone-50 text-xs flex justify-between items-center">
              <div className="space-y-1">
                <div><span className="text-stone-500">مدير المؤسسة:</span> <strong className="text-stone-800">{institution.principalName}</strong></div>
                <div><span className="text-stone-500">العنوان والبلدية:</span> <span>{institution.address} - {institution.city}</span></div>
              </div>
              <div className="space-y-1 text-left">
                <div><span className="text-stone-500">الهاتف:</span> <span className="tabular-nums font-mono">{institution.phone}</span></div>
                <div><span className="text-stone-500">الحالة التربوية:</span> <strong className="text-emerald-900">{institution.status}</strong></div>
              </div>
            </div>
          )}

          {/* Teachers Roster and Inspection Records in this Institution */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-stone-800 mb-2 border-b border-stone-300 pb-1">
              وضعية الفريق التربوي لمادة اللغة العربية بالمؤسسة
            </h4>
            <div className="border border-stone-300 rounded overflow-hidden">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 border-b border-stone-300">
                    <th className="py-2 px-3 font-semibold">الأستاذ</th>
                    <th className="py-2 px-3 font-semibold">الرتبة والوضعية</th>
                    <th className="py-2 px-3 font-semibold">الأقسام المسندة</th>
                    <th className="py-2 px-3 font-semibold text-center">آخر نقطة تفتيشية</th>
                    <th className="py-2 px-3 font-semibold text-center">تاريخ آخر زيارة</th>
                    <th className="py-2 px-3 font-semibold">الحالة التفتيشية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {teachers.map((t) => (
                    <tr key={t.id} className="hover:bg-stone-50">
                      <td className="py-2 px-3 font-medium text-stone-900">{t.fullName}</td>
                      <td className="py-2 px-3 text-stone-700">{t.rank} ({t.isTenured ? 'مرسم' : 'متربص'})</td>
                      <td className="py-2 px-3 text-stone-600">{t.assignedClasses} ({t.weeklyHours} سا)</td>
                      <td className="py-2 px-3 text-center font-bold tabular-nums text-emerald-900">
                        {t.lastScore > 0 ? `${t.lastScore} / 20` : 'قيد البرمجة'}
                      </td>
                      <td className="py-2 px-3 text-center tabular-nums text-stone-600">{t.lastInspectionDate || '---'}</td>
                      <td className="py-2 px-3">
                        <span className="text-[11px] font-medium text-stone-700">
                          {t.inspectionStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {teachers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-stone-500">
                        لا يوجد أساتذة مسجلون في هذه المؤسسة حالياً.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* General Observations */}
          <div className="mb-6 border border-stone-300 p-4 rounded bg-stone-50/50">
            <h4 className="text-xs font-bold text-stone-800 mb-1.5">
              التشخيص البيداغوجي العام والملاحظات الميدانية:
            </h4>
            <p className="text-stone-700 text-xs leading-relaxed whitespace-pre-line">
              {report.generalObservations}
            </p>
          </div>

          {/* Strengths and Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
            <div className="border border-stone-300 p-3.5 rounded bg-emerald-50/30">
              <h5 className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                نقاط القوة والإنجازات البيداغوجية المتميزة:
              </h5>
              <ul className="space-y-1.5 list-disc list-inside text-stone-700 text-[11px]">
                {report.strengthsAnalysis.map((str, idx) => (
                  <li key={idx} className="leading-relaxed">{str}</li>
                ))}
              </ul>
            </div>

            <div className="border border-stone-300 p-3.5 rounded bg-amber-50/30">
              <h5 className="font-bold text-amber-950 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                محاور التحسين والتعثرات التي تتطلب المعالجة:
              </h5>
              <ul className="space-y-1.5 list-disc list-inside text-stone-700 text-[11px]">
                {report.weaknessesAnalysis.map((w, idx) => (
                  <li key={idx} className="leading-relaxed">{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Directives for Teachers and Administrative Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-8">
            <div className="border border-stone-300 p-3.5 rounded">
              <h5 className="font-bold text-stone-900 mb-2">
                توجيهات بيداغوجية موجهة للأساتذة:
              </h5>
              <ul className="space-y-1.5 list-disc list-inside text-stone-700 text-[11px]">
                {report.pedagogicalDirectives.map((dir, idx) => (
                  <li key={idx} className="leading-relaxed">{dir}</li>
                ))}
              </ul>
            </div>

            <div className="border border-stone-300 p-3.5 rounded">
              <h5 className="font-bold text-stone-900 mb-2">
                توصيات إدارية وتنظيمية موجهة لإدارة المؤسسة:
              </h5>
              <ul className="space-y-1.5 list-disc list-inside text-stone-700 text-[11px]">
                {report.administrativeRecommendations.map((rec, idx) => (
                  <li key={idx} className="leading-relaxed">{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Signature Footer */}
          <div className="grid grid-cols-2 gap-8 pt-4 text-center text-xs border-t-2 border-stone-400">
            <div className="space-y-14">
              <div className="font-semibold text-stone-800">تبليغ السيد(ة) مدير(ة) المدرسة الابتدائية</div>
              <div className="text-[10px] text-stone-400">التاريخ والخاتم: .....................</div>
            </div>
            <div className="space-y-14">
              <div className="font-bold text-emerald-950">مفتش التعليم الابتدائي لمادة اللغة العربية</div>
              <div className="text-[11px] text-stone-700 font-serif font-bold">{inspector.name}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
