import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/reset.css'; // ✅ (antd v5 trở lên)
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import GlobalStyle from './GlobalStyle';
import 'antd/dist/reset.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalStyle />
      <App />
      <Toaster position="top-right" reverseOrder={false} />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
