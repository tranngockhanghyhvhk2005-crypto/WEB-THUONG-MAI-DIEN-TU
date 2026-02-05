import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Reset & base */
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    background: #f8f9fc;
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Basic utility classes used across the admin app */
  .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 16px; }
  .row { display: flex; flex-wrap: wrap; margin: 0 -8px; }
  .col { padding: 0 8px; flex: 1; }
  .col-auto { flex: 0 0 auto; }
  .col-sm-12 { width: 100%; }
  .col-md-4 { width: 33.3333%; }

  /* Text utilities */
  .text-center { text-align: center; }
  .text-end { text-align: right; }

  /* Buttons (lightweight replacements for bootstrap) */
  .btn { display: inline-flex; align-items: center; gap: .5rem; padding: .45rem .85rem; border-radius: .375rem; border: none; cursor: pointer; background: #e9ecef; color: #212529; }
  .btn-primary { background: #00d165; color: #fff; }
  .btn-secondary { background: #6c757d; color: #fff; }
  .btn-warning { background: #f6c23e; color: #fff; }
  .btn-danger { background: #e74a3b; color: #fff; }
  .btn-sm { padding: .25rem .5rem; font-size: .85rem; }
  .me-2 { margin-right: .5rem; }
  .ms-1 { margin-left: .25rem; }

  /* Cards */
  .card { background: #fff; border-radius: .5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
  .card-body { padding: 16px; }

  /* Tables */
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 12px 10px; border-bottom: 1px solid #e9eef7; }
  .table-hover tbody tr:hover { background: #f8f9fc; }

  /* Forms */
  .form-control { padding: .5rem .75rem; border-radius: .35rem; border: 1px solid #e3e6f0; width: 100%; }
  input[type="date"] { padding: .45rem .65rem; }

  /* Spinner */
  .spinner-border { display: inline-block; width: 1.2rem; height: 1.2rem; border: 2px solid rgba(0,0,0,0.1); border-top-color: #00d165; border-radius: 50%; animation: spin .75s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Dropdown / badges / small helpers */
  .badge { display: inline-block; padding: .25rem .5rem; border-radius: 999px; background: #f6c23e; color: #fff; font-size: .75rem; }
  .dropdown-menu { position: absolute; background: #fff; border-radius: .35rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); padding: 8px; }

  /* Modal helper wrapper used by some pages */
  .modal-content-custom { padding: 16px; }

  /* Ensure images in header/sidebar behave */
  img { max-width: 100%; height: auto; display: block; }
`;

export default GlobalStyle;
