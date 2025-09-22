import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { apiService } from "../../services/api";
import type { Submission } from "../../types";

export default function SubmissionsPanel({ challengeId }: { challengeId: string }) {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const load = async () => {
    setErr(""); setOk("");
    try {
      const data = await apiService.listarSubmissoes(challengeId);
      setSubs(data);
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? "Falha ao carregar submissões.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (challengeId) { setLoading(true); load(); } }, [challengeId]);

  const setStatus = async (id: string, status: "approved" | "rejected", feedback?: string) => {
    setErr(""); setOk("");
    try {
      await apiService.avaliarSubmissao(id, { status, feedback });
      setOk("Atualizado.");
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? "Falha ao atualizar.");
    }
  };

  if (!challengeId) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Submissões recebidas</CardTitle>
      </CardHeader>
      <CardContent>
        {ok && <Alert className="mb-4"><CheckCircle className="h-4 w-4" /><AlertDescription>{ok}</AlertDescription></Alert>}
        {err && <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{err}</AlertDescription></Alert>}
        {loading ? (
          <div className="flex justify-center items-center min-h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : subs.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma submissão ainda.</p>
        ) : (
          <div className="space-y-4">
            {subs.map((s) => {
              const student = typeof s.studentId === "string" ? undefined : s.studentId;
              return (
                <div key={s._id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {student?.nomeCompleto ?? "Aluno"}{" "}
                        <span className="text-gray-500">({student?.ra ?? "RA"})</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(s.createdAt).toLocaleString("pt-BR")}
                      </div>
                    </div>
                    <Badge variant={
                      s.status === "approved" ? "default" :
                        s.status === "rejected" ? "destructive" : "secondary"
                    }>
                      {s.status}
                    </Badge>
                  </div>

                  <pre className="bg-gray-50 border rounded p-3 mt-3 overflow-auto text-sm max-h-56 whitespace-pre-wrap">
                    {typeof s.code === "string" ? s.code : ""}
                  </pre>

                  <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
                    <Input
                      placeholder="Feedback (opcional)"
                      defaultValue={s.feedback ?? ""}
                      onChange={(e) => (s.feedback = e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setStatus(s._id, "rejected", s.feedback)}>Reprovar</Button>
                      <Button onClick={() => setStatus(s._id, "approved", s.feedback)}>Aprovar</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
