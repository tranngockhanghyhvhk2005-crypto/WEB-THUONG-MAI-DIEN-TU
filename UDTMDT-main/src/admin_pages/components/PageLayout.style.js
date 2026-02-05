import { styled } from 'styled-components';

const HEADER_HEIGHT = 64;
const BG = '#eef1f5';

export const AdminPageWrapper = styled.div`
  min-height: 100vh;
  background: ${BG};
  padding-top: ${HEADER_HEIGHT}px; 

  /* Responsive: ở màn nhỏ, sidebar có thể overlay, đặt padding-top nhỏ hơn */
  @media (max-width: 900px) {
    padding-top: 56px;
  }
`;

export const PageContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;

  h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #222;
  }

  .actions { display: flex; gap: 8px; align-items: center; }
`;

export const Card = styled.section`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  padding: 16px;
`;

export default AdminPageWrapper;
