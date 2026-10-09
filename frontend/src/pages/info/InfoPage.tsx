import { Link } from "react-router-dom";

const content: Record<string, { eyebrow: string; title: string; text: string }> = {
  assistencia: {
    eyebrow: "Conte com a 4cores",
    title: "Assistência especializada",
    text: "Nossa equipe ajuda você a escolher suprimentos e manter sua impressão funcionando no melhor ritmo.",
  },
  contato: {
    eyebrow: "Fale com a gente",
    title: "Contato",
    text: "Tem alguma dúvida? Envie uma mensagem para nossa equipe. Responderemos com atenção e agilidade.",
  },
};
export function InfoPage({ type }: { type: "assistencia" | "contato" }) {
  const page = content[type];
  return (
    <div className="container page-content">
      <div className="page-title">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p className="page-lead">{page.text}</p>
      </div>
      <div className="info-panel">
        <h2>Como podemos ajudar?</h2>
        <p>Atendimento de segunda a sexta, das 8h às 18h.</p>
        <a className="button" href="mailto:atendimento@4cores.com.br">
          Enviar mensagem
        </a>
        <Link className="text-link" to="/">
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}
