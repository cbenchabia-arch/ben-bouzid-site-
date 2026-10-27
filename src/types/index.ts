export interface Zone {
  id: string;
  name: string;
  code: string;
  description: string;
  supervisorRegion: string;
}

export type InstitutionType = 'مدرسة ابتدائية' | 'مجمع مدرسي ابتدائي';

export type InstitutionStatus = 'منتظمة' | 'تحت المتابعة' | 'أولوية تفتيشية';

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  zoneId: string;
  city: string;
  address: string;
  phone: string;
  principalName: string; // مدير(ة) المدرسة الابتدائية
  totalClasses: number;  // عدد الأفواج التربوية الابتدائية
  status: InstitutionStatus;
  academicYear: string;
  notes: string;
}

export type TeacherRank = 
  | 'أستاذ مكون في التعليم الابتدائي'
  | 'أستاذ رئيسي في التعليم الابتدائي'
  | 'أستاذ التعليم الابتدائي'
  | 'أستاذ متربص (تعليم ابتدائي)'
  | 'أستاذ متعاقد (تعليم ابتدائي)';

export type InspectionStatus = 
  | 'مفتش هذا الفصل'
  | 'مبرمج للزيارة'
  | 'بحاجة لزيارة توجيهية'
  | 'في انتظار التثبيت'
  | 'مستقر بيداغوجياً';

export interface Teacher {
  id: string;
  fullName: string;
  nationalId: string;
  institutionId: string;
  zoneId: string;
  rank: TeacherRank;
  graduationDegree: string; // شهادة المدرسة العليا للأساتذة، ليسانس لغة عربية، شهادة معهد تكوين المعلمين
  recruitmentDate: string;  // تاريخ التوظيف
  echelon: number;          // الدرجة
  phone: string;
  email: string;
  assignedClasses: string;  // الفوج المسند: السنة 1 ابتدائي، السنة 2، السنة 3، السنة 4، السنة 5
  weeklyHours: number;      // الحجم الساعي الأسبوعي (عادة 27 أو 30 ساعة أسبوعياً في الابتدائي)
  isTenured: boolean;       // مرسم أم متربص
  lastInspectionDate: string;
  lastScore: number;        // النقطة التفتيشية من 20
  inspectionStatus: InspectionStatus;
}

export interface EvaluationCriterion {
  id: string;
  title: string;
  description: string;
  maxScore: number;
  currentScore: number;
}

export interface EvaluationAxis {
  id: string;
  title: string;
  maxScore: number;
  criteria: EvaluationCriterion[];
}

export type PrimarySubjectBranch = 
  | 'فهم المنطوق والتعبير الشفوي'
  | 'القراءة والمطالعة الموجهة'
  | 'الظواهر النحوية والصرفية'
  | 'الإملاء والظواهر الإملائية'
  | 'التعبير والإنتاج الكتابي'
  | 'المحفوظات والأناشيد'
  | 'الخط والتطبيقات اللغوية';

export interface InspectionEvaluation {
  id: string;
  teacherId: string;
  institutionId: string;
  zoneId: string;
  inspectorName: string; // المفتش بن بوزيد
  date: string;
  academicYear: string;
  inspectionType: 'تفتيش تثبيت' | 'تفتيش ترقية دورية' | 'زيارة توجيهية استطلاعية' | 'زيارة متابعة خاصة';
  subjectBranch: PrimarySubjectBranch;
  lessonTopic: string;
  classroomLevel: 'السنة الأولى ابتدائي' | 'السنة الثانية ابتدائي' | 'السنة الثالثة ابتدائي' | 'السنة الرابعة ابتدائي' | 'السنة الخامسة ابتدائي' | string;
  presentStudents: number;
  totalStudents: number;
  axes: EvaluationAxis[];
  totalScore: number; // /20
  appreciation: string;
  strengths: string;
  improvements: string;
  recommendations: string;
  decision: string;
}

export interface PeriodicReport {
  id: string;
  title: string;
  reportType: 'فصلي' | 'سنوي' | 'دوري للمدرسة الابتدائية' | 'تقرير متابعة جهوي';
  targetType: 'مؤسسة' | 'المقاطعة كاملة' | 'جهة محددة';
  targetId: string; // institutionId or zoneId or 'all'
  academicPeriod: string;
  date: string;
  curriculumProgressPercent: number; // نسبة إنجاز المنهاج والتدرج الابتدائي
  averageDistrictScore: number;
  teachersEvaluated: number;
  totalTeachersInTarget: number;
  generalObservations: string;
  strengthsAnalysis: string[];
  weaknessesAnalysis: string[];
  pedagogicalDirectives: string[];
  administrativeRecommendations: string[];
}

export interface ScheduledVisit {
  id: string;
  teacherId: string;
  institutionId: string;
  zoneId: string;
  plannedDate: string;
  timeSlot: string;
  visitType: 'تفتيش تثبيت' | 'تفتيش ترقية' | 'زيارة توجيهية' | 'معاينة صفية';
  purpose: string;
  status: 'مبرمجة' | 'تمت بنجاح' | 'مؤجلة' | 'ملغاة';
  notes?: string;
}
