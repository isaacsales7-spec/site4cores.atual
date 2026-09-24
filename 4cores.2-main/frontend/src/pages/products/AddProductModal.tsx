import { useState, ChangeEvent, FormEvent } from "react";

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
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price,
          stock,
          category,
          image,
          description,
        }),
      });

      if (response.ok) {
        setName("");
        setPrice("");
        setStock("0");
        setCategory("Impressoras");
        setImage("");
        setDescription("");

        onSuccess();
        onClose();
      } else {
        alert("Erro ao cadastrar produto.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert("Falha na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
          borderRadius: "12px",
          padding: "24px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Cadastrar Novo Produto</h2>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "4px" }}>
              Nome do Produto
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "4px" }}>
                Preço (R$)
              </label>
              <input
                type="text"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0,00"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "4px" }}>
                Estoque
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "4px" }}>
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                backgroundColor: "#ffffff",
              }}
            >
              <option value="Impressoras">Impressoras</option>
              <option value="Suprimentos">Suprimentos</option>
              <option value="Papéis">Papéis</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "4px" }}>
              Foto do Arquivo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                width: "100%",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                backgroundColor: "#ffffff",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "4px" }}>
              Ou Cole a URL da Foto (Opcional)
            </label>
            <input
              type="url"
              value={image.startsWith("data:") ? "" : image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
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
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "4px" }}>
              Descrição (Opcional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                backgroundColor: "#ffffff",
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