import styled from 'styled-components'
import { CiMenuBurger } from 'react-icons/ci'
import { GiHamburgerMenu } from 'react-icons/gi'

export const HomePageContainer = styled.div`
  height: 100%;
  // width: 100%;
`
export const Main = styled.main`
  display: grid;
  transition: grid-template-columns 1s ease;
  grid-template-columns: ${(props) =>
    props?.navOpen ? '0px auto' : '220px 1fr'};
  height: 100%;
  width: 100%;
`

export const HamburgerMenuOn = styled(CiMenuBurger)`
  padding-top: 1rem;
  align-self: start;
  cursor: pointer;
`

export const HamburgerMenuOff = styled(GiHamburgerMenu)`
  padding-top: 1rem;
  align-self: start;
  cursor: pointer;
`

export const Header = styled.header`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  grid-template-rows: auto;
  gap: 1rem;
  // justify-self: end:
  box-sizing: border-box;
  padding-left: 32px;
  padding-right: 32px;
  width: 100%;
  height: 6rem;
  background: #242a40;
  color: #fcba03;
  border-bottom: 1px solid #211f1f;
`

export const Logo = styled.div`
  display: flex;
  flex-direction: column;
  justify-self: center;
`
export const LogoText = styled.div`
  margin-left: 1rem;
  color: #fcba03;
`
