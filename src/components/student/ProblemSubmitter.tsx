
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { apiService } from "../../services/api";
import type { Problema } from "../../types";

export default function ProblemSubmitter({ problema }: { problema: Problema }) {
  const [ra, setRa] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(""); setErr("");
    if (!ra.trim() || !code.trim()) { setErr("Informe RA e o código."); return; }
    setLoading(true);
    try {
      await apiService.criarSubmissao({ challengeId: (problema as any)._id, code, ra });
      setOk("Submissão enviada com sucesso!");
      setCode("");
    } catch (error: any) {
      setErr(error?.response?.data?.error ?? "Falha ao enviar a solução.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Enviar solução</CardTitle>
      </CardHeader>
      <CardContent>
        {ok && (
          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{ok}</AlertDescription>
          </Alert>
        )}
        {err && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{err}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="ra">RA do aluno</Label>
            <Input id="ra" value={ra} onChange={(e) => setRa(e.target.value)} placeholder="Ex.: 123456" />
          </div>
          <div>
            <Label htmlFor="code">Código (texto)</Label>
            <Textarea id="code" value={code} onChange={(e) => setCode(e.target.value)} rows={10} placeholder="// Cole aqui seu código" />
          </div>
          <Button type="submit" disabled={loading}>
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Enviando..." : "Enviar solução"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
