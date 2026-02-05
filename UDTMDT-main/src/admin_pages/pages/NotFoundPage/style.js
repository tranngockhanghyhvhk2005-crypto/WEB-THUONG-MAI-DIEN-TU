import { styled } from 'styled-components';
import AdminPageWrapper, { PageContent } from '../../components/PageLayout.style';

export const NotFoundWrapper = styled(AdminPageWrapper)`
	padding: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const NotFoundContent = PageContent;

export default NotFoundWrapper;
