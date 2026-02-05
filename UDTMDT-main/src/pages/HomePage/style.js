import styled from 'styled-components'

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-start;
  height: 44px;
  padding: 10px 0;
`

export const WrapperProducts = styled.div`
  padding: 20px 0 40px 0;

  .ant-pagination-item-active {
    background-color: #326e51;
    border-color: #326e51;
  }

  .ant-pagination-item-active a {
    color: #fff;
  }

  .ant-pagination-item:hover {
    border-color: #326e51;
  }

  .ant-pagination-item:hover a {
    color: #326e51;
  }

  .ant-pagination-prev:hover .ant-pagination-item-link,
  .ant-pagination-next:hover .ant-pagination-item-link {
    color: #326e51;
    border-color: #326e51;
  }
`