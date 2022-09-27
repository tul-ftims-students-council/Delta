import { createSignal, ParentProps } from 'solid-js';
import { styled } from 'solid-styled-components';
import routes from 'utils/routes';

interface Props extends ParentProps {
  activeRoute: typeof routes[keyof typeof routes];
}

const Header = ({ activeRoute, children }: Props) => {
  const [menuOpen, setMenuOpen] = createSignal(false);

  return (
    <HeaderWrapper>
      <div>
        <div class="container">
          <a href="/">
            <img src="/assets/logo.png" alt="logo" />
          </a>
          <div class="nav-wrapper">
            <Navigation open={menuOpen()}>
              <ul>
                {Object.entries(routes).map(([key, value]) => (
                  <li class={value === activeRoute ? 'active' : ''}>
                    <a href={`#${key}`} onClick={() => setMenuOpen(false)}>
                      {value}
                    </a>
                  </li>
                ))}
                <RegisterLi>
                  <a href={'/register'} onClick={() => setMenuOpen(false)}>
                    Zarejestruj się
                  </a>
                </RegisterLi>
              </ul>
            </Navigation>
            <Hamburger class="hamburger" onClick={() => setMenuOpen(!menuOpen())}>
              <img
                src={
                  menuOpen() ? '/assets/icons/hamburger/close-active.png' : '/assets/icons/hamburger/menu-active.png'
                }
                alt="mobile menu icon"
              />
            </Hamburger>
          </div>
          <ButtonWrapper>{children}</ButtonWrapper>
        </div>
      </div>
    </HeaderWrapper>
  );
};

const ButtonWrapper = styled.div`
  @media (max-width: 1000px) {
    display: none;
  }
`;

const RegisterLi = styled.li`
  @media (min-width: 1000px) {
    display: none;
  }
`;

const HeaderWrapper = styled.header`
  background-color: var(--white);
  position: sticky;
  isolation: isolate;
  z-index: 100;
  top: 0;

  & > div {
    padding: 20px 0;
    background-color: #fff;
    box-shadow: var(--gray-color-80) 0 6px 12px;

    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  img {
    height: 50px;
  }
`;

interface NavigationProps {
  open: boolean;
}

const Navigation = styled.nav<NavigationProps>`
  ul {
    padding: 0;
    display: flex;
    list-style-type: none;
    gap: 40px;
  }

  a {
    text-transform: uppercase;
    transition: color 200ms ease;
    text-decoration: none;
    color: var(--sec-color);
  }

  li {
    &.active a {
      color: var(--main-color);
    }

    &:hover a {
      color: var(--main-color-hover);
    }

    a:active {
      color: var(--main-color-active);
    }
  }

  @media (max-width: 1000px) {
    & {
      display: ${(props) => (props.open ? 'flex' : 'none')};
      background-color: var(--white);
      position: absolute;
      height: 100vh;
      width: 100%;
      top: 0;
      left: 0;
      z-index: -1;

      ul {
        width: 100%;
        padding: 100px 12px;
        gap: 4px;
        flex-direction: column;
        align-items: flex-end;

        li {
          font-size: 20px;
          padding: 4px 16px;
        }
      }
    }
  }
`;

const Hamburger = styled.button`
  display: none;
  border: none;
  cursor: pointer;
  justify-items: center;
  align-items: center;
  background-color: transparent;
  width: 32px;
  height: 32px;
  padding: 0;

  img {
    width: 100%;
    object-fit: contain;
  }

  @media (max-width: 1000px) {
    & {
      display: flex;
    }
  }
`;

export default Header;
