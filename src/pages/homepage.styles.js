import styled from 'styled-components'
import { CiMenuBurger } from 'react-icons/ci'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Theme } from '@src/constants'

export const HomePageContainer = styled.div`
  height: 100%;
  // width: 100%;
`
export const Main = styled.main`
  display: grid;
  transition: grid-template-columns 0.3s ease;
  grid-template-columns: ${(props) =>
    props?.navOpen ? '0px auto' : '18rem 1fr'};
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
  padding-left: 1rem;
  padding-right: 2rem;
  width: 100%;
  height: 5rem;
  background: ${Theme.primaryColor};
  color: ${Theme.fontColor};
  border-bottom: 1px solid #211f1f;
`

export const Logo = styled.div`
  display: flex;
  align-self: start;
`
export const LogoText = styled.div`
  padding-top: 1rem;
  margin-left: 0.45rem;
  font-family: ${Theme.fontFamily};
  font-size: 18px;
  color: ${Theme.fontColor};
  align-self: start;
`
