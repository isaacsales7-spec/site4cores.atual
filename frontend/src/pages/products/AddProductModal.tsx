import { useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/shared/lib/supabase";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [category, setCategory] = useState("Impressoras");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Comprime e redimensiona a imagem antes de converter para Base64
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800; // Redimensiona para no máximo 800px de largura
        const scaleFactor = MAX_WIDTH / img.width;

        if (scaleFactor < 1) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleFactor;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Exporta como JPEG com qualidade comprimida (0.7 = 70%)
        const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setImage(resizedBase64);
      };
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const numericPrice = parseFloat(price.replace(",", ".")) || 0;
      const numericStock = parseInt(stock, 10) || 0;

      const { error } = await supabase
        .from("products")
        .insert([
          {
            name,
            price: numericPrice,
            stock: numericStock,
            category,
            image,
            description,
          },
        ]);

      if (error) {
        console.error("Erro ao cadastrar produto no Supabase:", error);
        alert("Erro ao cadastrar produto no banco de dados.");
      } else {
        setName("");
        setPrice("");
        setStock("0");
        setCategory("Impressoras");
        setImage("");
        setDescription("");

        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert("Falha na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: "0.875rem",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 500,
    marginBottom: "4px",
    color: "#334155",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          color: "#0f172a",
          borderRadius: "12px",
          padding: "24px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
            Cadastrar Novo Produto
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "1.25rem", color: "#64748b", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={labelStyle}>
              Nome do Produto
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>
                Preço (R$)
              </label>
              <input
                type="text"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0,00"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                Estoque
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
            >
              <option value="Impressoras" style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>Impressoras</option>
              <option value="Suprimentos" style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>Suprimentos</option>
              <option value="Papéis" style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>Papéis</option>
              <option value="Outros" style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>Outros</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>
              Foto do Arquivo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ ...inputStyle, padding: "6px 12px" }}
            />
          </div>

          <div>
            <label style={{ ...labelStyle, fontSize: "0.75rem", color: "#64748b" }}>
              Ou Cole a URL da Foto (Opcional)
            </label>
            <input
              type="url"
              value={image.startsWith("data:") ? "" : image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              style={inputStyle}
            />
          </div>

          {image && (
            <div style={{ textAlign: "center", marginTop: "4px" }}>
              <img
                src={image}
                alt="Pré-visualização"
                style={{ maxHeight: "90px", borderRadius: "6px", objectFit: "contain" }}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>
              Descrição (Opcional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                color: "#334155",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {loading ? "Salvando..." : "Salvar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}