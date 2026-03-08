export function SettingsPlaceholder() {
  return (
    <div dir="rtl" className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">הגדרות</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ניהול הגדרות המערכת, שנות לימוד, כיתות ומקצועות
        </p>
      </div>
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <p className="text-sm text-muted-foreground">
          דף ההגדרות יוצג כאן
        </p>
      </div>
    </div>
  );
}
