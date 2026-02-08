import { TemplateForm } from "@/components/TemplateForm";

export default function NewTemplatePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Create New Template</h1>
            <TemplateForm />
        </div>
    );
}
