import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";

export function AdminSimplePage({ eyebrow, title, description, fields }: { eyebrow: string; title: string; description: string; fields: string[] }) {
  return (
    <div className="grid gap-5">
      <div><p className="eyebrow">{eyebrow}</p><h1 className="text-2xl font-semibold text-ink">{title}</h1><p className="mt-2 text-gray-500">{description}</p></div>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card className="overflow-x-auto p-4">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-gray-500"><tr>{fields.slice(0, 5).map((field) => <th key={field} className="p-3">{field}</th>)}</tr></thead>
            <tbody>{[1, 2, 3, 4].map((row) => <tr key={row} className="border-t border-silver-200">{fields.slice(0, 5).map((field, index) => <td key={field} className="p-3">{index === 0 ? `${title} ${row}` : "Đang cấu hình"}</td>)}</tr>)}</tbody>
          </table>
        </Card>
        <Card className="grid h-fit gap-4 p-5">
          <h2 className="font-semibold text-ink">Biểu mẫu nhanh</h2>
          {fields.slice(0, 4).map((field) => <Field key={field} label={field}><Input /></Field>)}
          <Field label="Trạng thái"><Select><option>active</option><option>hidden</option><option>archived</option></Select></Field>
          <Field label="Ghi chú"><Textarea /></Field>
          <Button>Lưu thay đổi</Button>
        </Card>
      </div>
    </div>
  );
}
