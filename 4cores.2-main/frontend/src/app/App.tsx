import { useState } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { CartProvider, useCart } from "@/features/cart/CartContext";
import { AdminEmployeesPage } from "@/pages/admin/AdminPage";
import { CartPage } from "@/pages/cart/CartPage";
import { CatalogPage } from "@/pages/catalog/CatalogPage";
import { CheckoutPage } from "@/pages/checkout/CheckoutPage";
import { HomePage } from "@/pages/home/HomePage";
import { InfoPage } from "@/pages/info/InfoPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { EmployeeProductsPage } from "@/pages/products/EmployeeProductsPage";
import { SearchPage } from "@/pages/search/SearchPage";
import { getTheme, toggleTheme } from "@/shared/lib/theme";
import {
  CartIcon,
  FacebookIcon,
  InstagramIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
} from "@/shared/ui/Icons";

type NavigationItem = "home" | "impressoras" | "suprimentos" | "papeis" | "assistencia" | "contato";

const navigationItems: Array<{
  id: NavigationItem;
  label: string;
  path: string;
}> = [
  { id: "home", label: "Home", path: "/" },
  { id: "impressoras", label: "Impressoras", path: "/impressoras" },
  { id: "suprimentos", label: "Suprimentos", path: "/suprimentos" },
  { id: "papeis", label: "Papéis", path: "/papeis" },
  { id: "assistencia", label: "Assistência", path: "/assistencia" },
  { id: "contato", label: "Contato", path: "/contato" },
];

function HeaderNavigation({
  activeItem,
  isOpen,
  onNavigate,
}: {
  activeItem: NavigationItem;
  isOpen: boolean;
  onNavigate: () => void;
}) {
  return (
    <nav className={isOpen ? "nav-open" : ""}>
      {navigationItems.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          className={item.id === activeItem ? "nav-link-active" : ""}
          onClick={onNavigate}
        >
          {item.label}
          {item.id === activeItem && <span className="nav-active-detail" aria-hidden="true" />}
        </Link>
      ))}
    </nav>
  );
}

function Header() {
  const location = useLocation();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(getTheme() === "dark");
  const changeTheme = () => {
    toggleTheme();
    setDark((current) => !current);
  };
  const activeItem: NavigationItem =
    location.pathname === "/"
      ? "home"
      : (location.pathname.slice(1).split("/")[0] as NavigationItem);
  return (
    <>
      <div className="utility">
        <div className="container utility-inner">
          <span>Frete grátis nas compras acima de R$ 199</span>
          <span>Suporte especializado para você</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-main">
          <button
            type="button"
            className="mobile-menu"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <MenuIcon />
          </button>
          <Link className="brand" to="/">
            <span className="brand-mark">
              <b>4</b>
              <i>c</i>
              <em>o</em>
              <strong>r</strong>
              <small>e</small>
              <u>s</u>
            </span>
            <span>Suprimentos para impressora</span>
          </Link>
          <HeaderNavigation
            activeItem={activeItem}
            isOpen={menuOpen}
            onNavigate={() => setMenuOpen(false)}
          />
          <div className="header-actions">
            <Link to="/buscar" aria-label="Buscar" className="icon-button">
              <SearchIcon />
            </Link>
            <button
              type="button"
              aria-label="Alternar tema"
              className="icon-button"
              onClick={changeTheme}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link to="/carrinho" className="cart-link" aria-label={`Carrinho com ${count} itens`}>
              <CartIcon />
              <span>{count}</span>
            </Link>
            <Link to="/perfil" className="profile-trigger" aria-label="Abrir perfil">
              <UserIcon className="user-icon" />
              <span className="profile-tooltip" role="tooltip">
                Meu perfil
                <br />
                <small>Acessar sua conta</small>
              </span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer id="footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark">
              <b>4</b>
              <i>c</i>
              <em>o</em>
              <strong>r</strong>
              <small>e</small>
              <u>s</u>
            </span>
          </Link>
          <p>Suprimentos que fazem sua impressão acontecer.</p>
        </div>
        <div>
          <h3>Institucional</h3>
          <a href="#footer">Quem somos</a>
          <a href="#footer">Impressoras</a>
          <a href="#footer">Examinamento</a>
          <a href="#footer">Contato</a>
        </div>
        <div>
          <h3>Políticas</h3>
          <a href="#footer">Políticas</a>
          <a href="#footer">Blog</a>
          <a href="#footer">Políticas de troca</a>
          <a href="#footer">Loja de vendedor</a>
        </div>
        <div>
          <h3>Newsletter</h3>
          <p>Receba dicas e ofertas no seu e-mail.</p>
          <form onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="newsletter">
              Seu e-mail
            </label>
            <input id="newsletter" type="email" placeholder="Seu e-mail" required />
            <button type="submit" aria-label="Assinar newsletter">
              →
            </button>
          </form>
          <div className="socials">
            <InstagramIcon />
            <FacebookIcon />
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>4cores 2023 - 2026. Todos os direitos reservados.</span>
        <span>Pagamento seguro</span>
      </div>
    </footer>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/impressoras"
              element={<CatalogPage title="Impressoras" category="Impressoras" />}
            />
            <Route
              path="/suprimentos"
              element={<CatalogPage title="Suprimentos" category="Suprimentos" />}
            />
            <Route
              path="/papeis"
              element={<CatalogPage title="Papéis especiais" category="Papéis" />}
            />
            <Route path="/assistencia" element={<InfoPage type="assistencia" />} />
            <Route path="/contato" element={<InfoPage type="contato" />} />
            <Route path="/buscar" element={<SearchPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminEmployeesPage />} />
            <Route path="/employee/products" element={<EmployeeProductsPage />} />
          </Routes>
        </main>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}