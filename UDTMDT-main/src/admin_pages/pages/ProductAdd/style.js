import { styled } from 'styled-components';
import AdminPageWrapper, { PageContent, PageHeader, Card } from '../../components/PageLayout.style';

export const ProductAddWrapper = styled(AdminPageWrapper)`
	padding: 30px;
`;

export const ProductAddContent = PageContent;
export const ProductAddHeader = PageHeader;
export const ProductAddCard = Card;

export default ProductAddWrapper;
