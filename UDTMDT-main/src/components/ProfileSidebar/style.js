import styled from 'styled-components';

export const SidebarWrapper = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ebebf0;
  min-height: 400px;
`;

export const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
`;

export const UserName = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: #333;
  margin-top: 12px;
  text-align: center;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserEmail = styled.div`
  font-size: 13px;
  color: #888;
  margin-top: 4px;
  text-align: center;
`;

export const MenuTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
`;

export const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const MenuItem = styled.li`
  padding: 12px 15px;
  font-size: 15px;
  font-weight: 500;
  color: #555;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-bottom: 4px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f5f5f5;
    color: #326e51;
  }

  &.active {
    background-color: #326e51;
    color: #fff;
    font-weight: 600;
    box-shadow: 0 2px 5px rgba(50, 110, 81, 0.3);
  }
`;
