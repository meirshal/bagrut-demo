import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ClassHeader } from '@/components/grades/ClassHeader';
import { GridLegend } from '@/components/grades/GridLegend';
import { GradeGrid } from '@/components/grades/GradeGrid';

export function ClassGradeGrid() {
  const { classId } = useParams<{ classId: string }>();

  if (!classId) {
    return (
      <div dir="rtl" className="p-4 text-red-500">
        מזהה כיתה לא נמצא
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-3">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
          חזרה ללוח הבקרה
        </Link>
      </div>
      <ClassHeader classId={classId} />
      <GridLegend />
      <GradeGrid classId={classId} />
    </div>
  );
}
