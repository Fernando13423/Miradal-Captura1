import './style.css';  // Importa los estilos

export default function Layout({ children }) {
  return (
    <html lang="es">
      <head />
      <body>{children}</body>
    </html>
  );
}
