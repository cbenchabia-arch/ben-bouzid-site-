import React, { useState } from 'react';
import { 
  Teacher, 
  Institution, 
  InspectionEvaluation, 
  EvaluationAxis, 
} from '../types';
import { DEFAULT_EVALUATION_AXES } from '../data/mockData';
import { InspectorProfile } from '../data/storage';
import { X, Check, Save, Award, BookOpen, Layers } from 'lucide-react';

interface EvaluationModalProps {
  teacher?: Teacher;
  teachers: Teacher[];
  institutions: Institution[];
  inspector: InspectorProfile;
  initialEvaluation?: InspectionEvaluation;
  onSave: (evaluation: InspectionEvaluation) => void;
  onClose: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  teacher,
  teachers,
  institutions,
  inspector,
  initialEvaluation,
  onSave,
  onClose,
}) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    teacher?.id || initialEvaluation?.teacherId || (teachers[0]?.id || '')
  );

  const activeTeacher = teachers.find((t) => t.id === selectedTeacherId) || teacher;
  const activeInstitution = institutions.find((i) => i.id === activeTeacher?.institutionId);

  const [inspectionType, setInspectionType] = useState<InspectionEvaluation['inspectionType']>(
    initialEvaluation?.inspectionType || (activeTeacher?.isTenured ? 'تفتيش ترقية دورية' : 'تفتيش تثبيت')
  );

  const [subjectBranch, setSubjectBranch] = useState<InspectionEvaluation['subjectBranch']>(
    initialEvaluation?.subjectBranch || 'القراءة والمطالعة الموجهة'
  );

  const [lessonTopic, setLessonTopic] = useState(
    initialEvaluation?.lessonTopic || 'نص قرائي وفهم المنطوق: سر الحياة'
  );

  const [classroomLevel, setClassroomLevel] = useState(
    initialEvaluation?.classroomLevel || (activeTeacher?.assignedClasses || 'السنة الثالثة ابتدائي')
  );

  const [presentStudents, setPresentStudents] = useState<number>(initialEvaluation?.presentStudents || 28);
  const [totalStudents, setTotalStudents] = useState<number>(initialEvaluation?.totalStudents || 30);
  const [date, setDate] = useState<string>(initialEvaluation?.date || new Date().toISOString().split('T')[0]);

  // Clone axes
  const [axes, setAxes] = useState<EvaluationAxis[]>(() => {
    if (initialEvaluation?.axes && initialEvaluation.axes.length > 0) {
      return JSON.parse(JSON.stringify(initialEvaluation.axes));
    }
    return JSON.parse(JSON.stringify(DEFAULT_EVALUATION_AXES));
  });

  const [strengths, setStrengths] = useState(
    initialEvaluation?.strengths || 'سلامة النطق والفصاحة اللغوية، الإعداد الجيد للمذكرات، التفاعل الإيجابي مع التلاميذ.'
  );

  const [improvements, setImprovements] = useState(
    initialEvaluation?.improvements || 'العناية بتدبير الزمن في مرحلة استخلاص القاعدة، وتكثيف التطبيقات الفردية على الألواح.'
  );

  const [recommendations, setRecommendations] = useState(
    initialEvaluation?.recommendations || 'تنويع استراتيجيات التعلم النشط، والحرص على تصحيح كراريس المحاولات دورياً.'
  );

  const [decision, setDecision] = useState(
    initialEvaluation?.decision || (activeTeacher?.isTenured ? 'اقتراح الترقية بالدرجة الممتازة' : 'تثبيت في الرتبة')
  );

  // Compute total score
  const totalScore = axes.reduce((sum, axis) => {
    const axisScore = axis.criteria.reduce((cSum, c) => cSum + (Number(c.currentScore) || 0), 0);
    return sum + axisScore;
  }, 0);

  // Calculate qualitative appreciation
  const getAppreciation = (score: number) => {
    if (score >= 18) return 'ممتاز - أداء تربوي ولغوي رائد ومتميز';
    if (score >= 16) return 'جيد جداً - تمكن بيداغوجي رفيع واستيعاب للمنهاج';
    if (score >= 14) return 'جيد - أداء متوازن وممارسات صفية مقبولة';
    if (score >= 12) return 'مقبول - بحاجة لمزيد من العناية ببعض الجوانب الديداكتيكية';
    return 'دون المتوسط - بحاجة ماسة إلى مرافقة ومتابعة بيداغوجية عاجلة';
  };

  const handleScoreChange = (axisId: string, criterionId: string, newScore: number) => {
    setAxes((prevAxes) =>
      prevAxes.map((axis) => {
        if (axis.id !== axisId) return axis;
        return {
          ...axis,
          criteria: axis.criteria.map((c) => {
            if (c.id !== criterionId) return c;
            // clamp between 0 and maxScore
            const clamped = Math.max(0, Math.min(c.maxScore, Math.round(newScore * 100) / 100));
            return { ...c, currentScore: clamped };
          }),
        };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeacher || !activeInstitution) return;

    const evalRecord: InspectionEvaluation = {
      id: initialEvaluation?.id || `eval-${Date.now()}`,
      teacherId: activeTeacher.id,
      institutionId: activeInstitution.id,
      zoneId: activeInstitution.zoneId,
      inspectorName: inspector.name,
      date,
      academicYear: inspector.academicYear,
      inspectionType,
      subjectBranch,
      lessonTopic,
      classroomLevel,
      presentStudents,
      totalStudents,
      axes,
      totalScore: Number(totalScore.toFixed(2)),
      appreciation: getAppreciation(totalScore),
      strengths,
      improvements,
      recommendations,
      decision,
    };

    onSave(evalRecord);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-stone-200">
        
        {/* Modal Header */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-300" />
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                نظام التقييم الإلكتروني والزيارة التفتيشية البيداغوجية
              </h2>
              <p className="text-xs text-emerald-200">
                استمارة شبكة التنقيط المعتمدة لمادة اللغة العربية وآدابها (المعدل من 20 ن)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Teacher & Session Identification */}
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg space-y-4">
            <h3 className="text-xs font-bold text-stone-700 flex items-center gap-1.5 pb-1 border-b border-stone-200">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              بيانات الأستاذ ومجريات الحصة المشاهدة
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">الأستاذ(ة) المعني(ة):</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-md py-1.5 px-2.5 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.rank})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">المؤسسة التعليمية:</label>
                <input
                  type="text"
                  readOnly
                  value={activeInstitution?.name || 'غير محدد'}
                  className="w-full bg-stone-100 border border-stone-200 rounded-md py-1.5 px-2.5 text-stone-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">طبيعة الزيارة التفتيشية:</label>
                <select
                  value={inspectionType}
                  onChange={(e) => setInspectionType(e.target.value as any)}
                  className="w-full bg-white border border-stone-300 rounded-md py-1.5 px-2.5 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="تفتيش تثبيت">تفتيش تثبيت وترسيم</option>
                  <option value="تفتيش ترقية دورية">تفتيش ترقية دورية</option>
                  <option value="زيارة توجيهية استطلاعية">زيارة توجيهية استطلاعية</option>
                  <option value="زيارة متابعة خاصة">زيارة متابعة خاصة</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">ميدان / فرع مادة اللغة العربية:</label>
                <select
                  value={subjectBranch}
                  onChange={(e) => setSubjectBranch(e.target.value as any)}
                  className="w-full bg-white border border-stone-300 rounded-md py-1.5 px-2.5 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="فهم المنطوق والتعبير الشفوي">فهم المنطوق والتعبير الشفوي</option>
                  <option value="القراءة والمطالعة الموجهة">القراءة والمطالعة الموجهة (الطلاقة وفهم المعنى)</option>
                  <option value="الظواهر النحوية والصرفية">الظواهر النحوية والصرفية</option>
                  <option value="الإملاء والظواهر الإملائية">الإملاء والظواهر الإملائية</option>
                  <option value="التعبير والإنتاج الكتابي">التعبير والإنتاج الكتابي</option>
                  <option value="المحفوظات والأناشيد">المحفوظات والأناشيد</option>
                  <option value="الخط والتطبيقات اللغوية">الخط والتطبيقات اللغوية</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">عنوان الدرس المشاهد بالابتدائي:</label>
                <input
                  type="text"
                  required
                  value={lessonTopic}
                  onChange={(e) => setLessonTopic(e.target.value)}
                  placeholder="مثال: نص قرائي: سر الحياة، الجملة الفعلية: الفاعل، التاء المفتوحة والمربوطة..."
                  className="w-full bg-white border border-stone-300 rounded-md py-1.5 px-2.5 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">المستوى الدراسي (الابتدائي):</label>
                <select
                  value={classroomLevel}
                  onChange={(e) => setClassroomLevel(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-md py-1.5 px-2.5 text-stone-800 font-medium focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="السنة الأولى ابتدائي">السنة الأولى ابتدائي</option>
                  <option value="السنة الثانية ابتدائي">السنة الثانية ابتدائي</option>
                  <option value="السنة الثالثة ابتدائي">السنة الثالثة ابتدائي</option>
                  <option value="السنة الرابعة ابتدائي">السنة الرابعة ابتدائي</option>
                  <option value="السنة الخامسة ابتدائي">السنة الخامسة ابتدائي</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">الحضور / عدد الفوج:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={totalStudents}
                    value={presentStudents}
                    onChange={(e) => setPresentStudents(Number(e.target.value))}
                    className="w-1/2 bg-white border border-stone-300 rounded-md py-1.5 px-2 text-center text-stone-800 tabular-nums focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                  <span className="text-stone-400">/</span>
                  <input
                    type="number"
                    min={1}
                    value={totalStudents}
                    onChange={(e) => setTotalStudents(Number(e.target.value))}
                    className="w-1/2 bg-white border border-stone-300 rounded-md py-1.5 px-2 text-center text-stone-800 tabular-nums focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">تاريخ الزيارة:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-md py-1.5 px-2.5 text-stone-800 tabular-nums focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Detailed Interactive Evaluation Axes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-800" />
                محاور ومعايير التقييم البيداغوجي (التنقيط المباشر)
              </h3>
              <div className="text-xs text-stone-500">
                يمكنك تعديل درجات كل مؤشر يدوياً أو بواسطة الأزرار السريعة
              </div>
            </div>

            {axes.map((axis) => {
              const axisSum = axis.criteria.reduce((s, c) => s + (c.currentScore || 0), 0);
              return (
                <div key={axis.id} className="border border-stone-200 rounded-lg overflow-hidden bg-white">
                  <div className="bg-stone-100 px-4 py-2 flex items-center justify-between border-b border-stone-200">
                    <span className="font-bold text-xs text-stone-800">{axis.title}</span>
                    <span className="text-xs font-semibold tabular-nums text-emerald-800">
                      مجموع المحور: <strong>{axisSum.toFixed(2)}</strong> / {axis.maxScore} ن
                    </span>
                  </div>

                  <div className="divide-y divide-stone-100 p-2">
                    {axis.criteria.map((criterion) => (
                      <div key={criterion.id} className="py-2 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-stone-50/50 rounded">
                        <div className="space-y-0.5">
                          <div className="text-xs font-medium text-stone-900">{criterion.title}</div>
                          <div className="text-[11px] text-stone-500">{criterion.description}</div>
                        </div>

                        {/* Interactive score input + quick presets */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded text-[10px]">
                            <button
                              type="button"
                              onClick={() => handleScoreChange(axis.id, criterion.id, criterion.maxScore * 0.6)}
                              className="px-1.5 py-0.5 rounded hover:bg-white text-stone-600 transition-colors"
                            >
                              مقبول
                            </button>
                            <button
                              type="button"
                              onClick={() => handleScoreChange(axis.id, criterion.id, criterion.maxScore * 0.85)}
                              className="px-1.5 py-0.5 rounded hover:bg-white text-stone-700 transition-colors"
                            >
                              جيد
                            </button>
                            <button
                              type="button"
                              onClick={() => handleScoreChange(axis.id, criterion.id, criterion.maxScore)}
                              className="px-1.5 py-0.5 rounded hover:bg-emerald-700 hover:text-white text-emerald-900 font-semibold transition-colors"
                            >
                              كامل
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.05"
                              min="0"
                              max={criterion.maxScore}
                              value={criterion.currentScore}
                              onChange={(e) => handleScoreChange(axis.id, criterion.id, parseFloat(e.target.value) || 0)}
                              className="w-16 py-1 px-1.5 border border-stone-300 rounded text-center text-xs font-bold text-emerald-900 tabular-nums focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                            />
                            <span className="text-[11px] text-stone-400">/ {criterion.maxScore}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Realtime Live Score Display */}
          <div className="p-4 rounded-xl bg-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="text-xs text-emerald-200 font-medium">النتيجة الإجمالية المحتسبة:</div>
              <div className="text-sm font-bold text-amber-300 mt-1">
                {getAppreciation(totalScore)}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-mono text-amber-300 tabular-nums">
                {totalScore.toFixed(2)}
              </span>
              <span className="text-emerald-200 text-base font-bold">/ 20</span>
            </div>
          </div>

          {/* Section 3: Qualitative Observations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                نقاط القوة والإيجابيات الملحوظة:
              </label>
              <textarea
                rows={3}
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-md p-2.5 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none text-xs leading-relaxed"
                placeholder="سجل أهم الإيجابيات في الإلقاء، اللغة، هندسة السبورة والتفاعل..."
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                مجالات التحسين والنقائص المسجلة:
              </label>
              <textarea
                rows={3}
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-md p-2.5 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none text-xs leading-relaxed"
                placeholder="سجل النقائص الديداكتيكية أو مواطن التعثر المرصودة..."
              />
            </div>
          </div>

          {/* Section 4: Recommendations and Inspector Decision */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                التوجيهات والتوصيات البيداغوجية الصريحة للأستاذ:
              </label>
              <textarea
                rows={2}
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-md p-2.5 text-stone-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none text-xs leading-relaxed"
                placeholder="التوجيهات الميدانية الواجب تنفيذها خلال الفصل القادم..."
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">قرار المفتش الرسمي:</label>
              <input
                type="text"
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-md py-2 px-3 text-stone-800 font-semibold focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                placeholder="مثال: تثبيت في الرتبة، ترقية بالدرجة الممتازة، إعادة الزيارة بعد شهرين..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-xs font-semibold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>اعتماد وحفظ بطاقة التفتيش</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
