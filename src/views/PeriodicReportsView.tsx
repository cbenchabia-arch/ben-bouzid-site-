import React, { useState } from 'react';
import { PeriodicReport, Institution, Teacher, Zone } from '../types';
import { 
  FileText, 
  Building2, 
  Printer, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Trash2, 
  Edit,
  Save,
  Compass,
  X
} from 'lucide-react';
import { InspectorProfile } from '../data/storage';

interface PeriodicReportsViewProps {
  reports: PeriodicReport[];
  institutions: Institution[];
  teachers: Teacher[];
  zones: Zone[];
  inspector: InspectorProfile;
  onSaveReport: (report: PeriodicReport) => void;
  onDeleteReport: (reportId: string) => void;
  onViewPrintableReport: (report: PeriodicReport) => void;
}

export const PeriodicReportsView: React.FC<PeriodicReportsViewProps> = ({
  reports,
  institutions,
  teachers,
  zones,
  inspector,
  onSaveReport,
  onDeleteReport,
  onViewPrintableReport,
}) => {
  const [selectedInstId, setSelectedInstId] = useState<string>(institutions[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New report form state
  const selectedInst = institutions.find((i) => i.id === selectedInstId);
  const instTeachers = teachers.filter((t) => t.institutionId === selectedInstId);
  const evaluatedInstTeachers = instTeachers.filter((t) => t.lastScore > 0);
  const validScores = evaluatedInstTeachers.map((t) => t.lastScore);
  const calculatedAvg = validScores.length > 0 
    ? Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1))
    : 16.0;

  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<PeriodicReport['reportType']>('دوري للمدرسة الابتدائية');
  const [formPeriod, setFormPeriod] = useState('الفصل الأول - الموسم الدراسي 2025/2026');
  const [formCurriculumPercent, setFormCurriculumPercent] = useState<number>(94);
  const [formObservations, setFormObservations] = useState('');
  const [formStrengths, setFormStrengths] = useState(
    'التزام الفريق التربوي بالتوزيع السنوي والتدرج المعتمد لمرحلة التعليم الابتدائي.\nتفعيل أنشطة فهم المنطوق وتنمية رصيد التلميذ المعجمي واللغوي.\nعناية فائقة بكراريس القسم ودفاتر الإملاء واستعمال الألواح الفردية.'
  );
  const [formWeaknesses, setFormWeaknesses] = useState(
    'صعوبات في القراءة المسترسلة والطلاقة لدى بعض تلاميذ السنة الثالثة.\nالحاجة لمزيد من تفعيل حصص المعالجة البيداغوجية الأسبوعية بشكل مبرمج.'
  );
  const [formDirectives, setFormDirectives] = useState(
    'تكثيف القراءات الفردية الجهرية مع التشكيل التام وتصحيح العثرات آنياً.\nاستثمار المشاهد المصورة والقصص البسيطة لإثارة رغبة الأطفال في التعبير.'
  );
  const [formAdminRecs, setFormAdminRecs] = useState(
    'تزويد أقسام الابتدائي بمكتبات صفية ومصادر قصصية هادفة.\nتوفير الوسائل التوضيحية ومجسمات الحروف والأرقام.'
  );

  const startCreateForInstitution = (instId: string) => {
    const inst = institutions.find((i) => i.id === instId);
    setSelectedInstId(instId);
    setFormTitle(`التقرير التفتيشي الدوري لوضعية اللغة العربية بـ ${inst?.name || 'المدرسة الابتدائية'}`);
    setFormType('دوري للمدرسة الابتدائية');
    setFormObservations(
      `بناءً على الزيارات والمعاينات الصفية الميدانية المنجزة بـ ${inst?.name || 'المدرسة الابتدائية'}، يسجل المفتش بن بوزيد استقراراً بيداغوجياً واهتماماً ملموساً بتعليم اللغة العربية وفق مناهج الطور الابتدائي.`
    );
    setIsCreatingNew(true);
  };

  const handleSaveNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    const inst = institutions.find((i) => i.id === selectedInstId);
    const newRep: PeriodicReport = {
      id: `rep-${Date.now()}`,
      title: formTitle || `تقرير دوري عن ${inst?.name}`,
      reportType: formType,
      targetType: formType === 'دوري للمدرسة الابتدائية' ? 'مؤسسة' : 'المقاطعة كاملة',
      targetId: formType === 'دوري للمدرسة الابتدائية' ? selectedInstId : 'all',
      academicPeriod: formPeriod,
      date: new Date().toISOString().split('T')[0],
      curriculumProgressPercent: Number(formCurriculumPercent),
      averageDistrictScore: calculatedAvg,
      teachersEvaluated: evaluatedInstTeachers.length || 1,
      totalTeachersInTarget: instTeachers.length || 1,
      generalObservations: formObservations,
      strengthsAnalysis: formStrengths.split('\n').filter((s) => s.trim().length > 0),
      weaknessesAnalysis: formWeaknesses.split('\n').filter((s) => s.trim().length > 0),
      pedagogicalDirectives: formDirectives.split('\n').filter((s) => s.trim().length > 0),
      administrativeRecommendations: formAdminRecs.split('\n').filter((s) => s.trim().length > 0),
    };

    onSaveReport(newRep);
    setIsCreatingNew(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-800" />
            التقارير الدورية الدقيقة للمؤسسات والمقاطعة
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            صياغة التقارير التفتيشية التفصيلية لكل مؤسسة تعليمية، متابعة تنفيذ المناهج، وتصدير التقارير الرسمية القابلة للطباعة.
          </p>
        </div>

        <button
          onClick={() => startCreateForInstitution(selectedInstId || institutions[0]?.id || '')}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>توليد تقرير دوري جديد لمؤسسة</span>
        </button>
      </div>

      {/* Quick Institution Report Generator Strip */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-800" />
            <h2 className="text-sm font-bold text-stone-900">
              اختر مؤسسة لاستعراض وتوليد تقريرها الدوري الدقيق:
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg py-1.5 px-3 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({zones.find(z => z.id === i.zoneId)?.name})
                </option>
              ))}
            </select>

            <button
              onClick={() => startCreateForInstitution(selectedInstId)}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              إنشاء التقرير
            </button>
          </div>
        </div>

        {/* Selected Institution Live Diagnostics Snapshot */}
        {selectedInst && (
          <div className="bg-stone-50 border border-stone-200/80 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-stone-500 text-[11px] block">المؤسسة والطور:</span>
              <strong className="text-stone-900 text-sm mt-0.5 block">{selectedInst.name}</strong>
              <span className="text-stone-500 text-[10px]">{selectedInst.type} · {zones.find(z => z.id === selectedInst.zoneId)?.name}</span>
            </div>

            <div>
              <span className="text-stone-500 text-[11px] block">طاقم أساتذة العربية:</span>
              <strong className="text-stone-900 text-base font-mono tabular-nums mt-0.5 block">
                {instTeachers.length} أساتذة
              </strong>
              <span className="text-stone-500 text-[10px]">
                تم تفتيشهم: {evaluatedInstTeachers.length} من {instTeachers.length}
              </span>
            </div>

            <div>
              <span className="text-stone-500 text-[11px] block">متوسط النقطة التفتيشية:</span>
              <strong className="text-emerald-900 text-base font-mono tabular-nums mt-0.5 block">
                {calculatedAvg} / 20
              </strong>
              <span className="text-emerald-800 text-[10px] font-semibold">مستوى بيداغوجي رفيع</span>
            </div>

            <div>
              <span className="text-stone-500 text-[11px] block">المدير المسؤول:</span>
              <strong className="text-stone-900 mt-0.5 block">{selectedInst.principalName}</strong>
              <span className="text-stone-500 text-[10px] font-mono">{selectedInst.phone}</span>
            </div>
          </div>
        )}
      </div>

      {/* Reports Archive List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-800" />
            <span>سجل التقارير التفتيشية المعتمدة ({reports.length} تقرير)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => {
            const inst = institutions.find((i) => i.id === report.targetId);
            const zone = inst ? zones.find((z) => z.id === inst.zoneId) : undefined;
            const repTeachers = inst ? teachers.filter((t) => t.institutionId === inst.id) : teachers;

            return (
              <div
                key={report.id}
                className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs hover:shadow-xs hover:border-emerald-700/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Category and Period */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                      {report.reportType}
                    </span>
                    <span className="text-stone-500 font-medium tabular-nums">
                      {report.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-stone-900 text-sm leading-snug">
                    {report.title}
                  </h3>

                  {/* Target and Period */}
                  <div className="text-xs text-stone-600 flex items-center gap-2">
                    <span className="font-medium text-emerald-950">
                      {inst?.name || 'كافة المقاطعة التفتيشية'}
                    </span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-500">{report.academicPeriod}</span>
                  </div>

                  {/* Diagnostic Numbers */}
                  <div className="grid grid-cols-3 gap-2 bg-stone-50 border border-stone-200/60 p-2.5 rounded-lg text-center text-xs">
                    <div>
                      <div className="text-[10px] text-stone-500">الأساتذة</div>
                      <div className="font-bold font-mono text-stone-800 tabular-nums">
                        {report.teachersEvaluated} / {report.totalTeachersInTarget}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500">إنجاز المنهاج</div>
                      <div className="font-bold font-mono text-stone-800 tabular-nums">
                        {report.curriculumProgressPercent}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500">معدل التقييم</div>
                      <div className="font-bold font-mono text-emerald-900 tabular-nums">
                        {report.averageDistrictScore.toFixed(1)}/20
                      </div>
                    </div>
                  </div>

                  {/* Short excerpt */}
                  <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                    {report.generalObservations}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3.5 mt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onViewPrintableReport(report)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>معاينة وطباعة التقرير (A4)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('هل تريد حذف هذا التقرير؟')) {
                        onDeleteReport(report.id);
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف التقرير"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal / Form to create or customize report */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">
                  إعداد التقرير التفتيشي الدوري للمؤسسة التعليمية
                </h3>
              </div>
              <button
                onClick={() => setIsCreatingNew(false)}
                className="text-emerald-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewReport} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">عنوان التقرير الرسمي:</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">المؤسسة المستهدفة:</label>
                  <select
                    value={selectedInstId}
                    onChange={(e) => setSelectedInstId(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    {institutions.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">الفترة / الثلاثي:</label>
                  <input
                    type="text"
                    value={formPeriod}
                    onChange={(e) => setFormPeriod(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">نسبة إنجاز المنهاج والتدرج (%):</label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={formCurriculumPercent}
                    onChange={(e) => setFormCurriculumPercent(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 tabular-nums focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">نوع التقرير:</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="دوري للمدرسة الابتدائية">تقرير دوري للمدرسة الابتدائية</option>
                    <option value="فصلي">تقرير فصلي</option>
                    <option value="تقرير متابعة جهوي">تقرير متابعة جهوي</option>
                    <option value="سنوي">تقرير تقييمي سنوي</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">الملاحظات والتشخيص العام للمفتشية:</label>
                  <textarea
                    rows={3}
                    value={formObservations}
                    onChange={(e) => setFormObservations(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md p-2.5 text-stone-800 leading-relaxed focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">نقاط القوة البيداغوجية (كل نقطة في سطر):</label>
                  <textarea
                    rows={3}
                    value={formStrengths}
                    onChange={(e) => setFormStrengths(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md p-2.5 text-stone-800 leading-relaxed focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">محاور التحسين والتعثرات (كل نقطة في سطر):</label>
                  <textarea
                    rows={3}
                    value={formWeaknesses}
                    onChange={(e) => setFormWeaknesses(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md p-2.5 text-stone-800 leading-relaxed focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">توجيهات بيداغوجية موجهة للأساتذة:</label>
                  <textarea
                    rows={3}
                    value={formDirectives}
                    onChange={(e) => setFormDirectives(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md p-2.5 text-stone-800 leading-relaxed focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">توصيات إدارية موجهة لمدير المؤسسة:</label>
                  <textarea
                    rows={3}
                    value={formAdminRecs}
                    onChange={(e) => setFormAdminRecs(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-md p-2.5 text-stone-800 leading-relaxed focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg font-medium transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>اعتماد وحفظ التقرير الدوري</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
