import React from 'react'
import styled from 'styled-components'
import { CurrentBorrows } from '../member/components/CurrentBorrows'
import { SearchAndBorrow } from '../member/components/SearchAndBorrow'

const Wrap = styled.div`
  display: grid;
  place-items: center;
  padding: 40px 0;
  color: ${p => p.theme.colors.textMuted};
`

export const MemberDashboard: React.FC = () => {
  return (
    <Wrap>
      <div style={{ width: '100%', maxWidth: 980 }}>
        <h2 style={{ margin: '0 0 8px' }}>Member Dashboard</h2>
        <CurrentBorrows />
        <SearchAndBorrow />
      </div>
    </Wrap>
  )
}

