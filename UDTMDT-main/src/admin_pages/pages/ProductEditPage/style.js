import { styled } from 'styled-components';
import AdminPageWrapper, { PageContent, PageHeader, Card } from '../../components/PageLayout.style';

export const ProductEditWrapper = styled(AdminPageWrapper)`
	padding: 20px;
`;

export const ProductEditContent = PageContent;
export const ProductEditHeader = PageHeader;
export const ProductEditCard = Card;

export default ProductEditWrapper;
