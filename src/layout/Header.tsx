import Button from 'components/shared/Button/Button';
import { createSignal, ParentProps } from 'solid-js';
import { styled } from 'solid-styled-components';
import routes from 'utils/routes';

interface Props extends ParentProps {
  activeRoute: typeof routes[keyof typeof routes];
}

const Header = ({ activeRoute }: Props) => {
  const [menuOpen, setMenuOpen] = createSignal(false);

  const handleNavClick = (key: string) => {
    setMenuOpen(false);

    // Temporary solution
    let counter = 0;

    const scrollInterval = setInterval(() => {
      if (counter > 20) clearInterval(scrollInterval);

      const el = document.querySelector(`#scroll-${key}`);

      if (el) {
        const scrollY = el.getBoundingClientRect().y + window.scrollY - 125;
        window.scroll({ top: scrollY, behavior: 'smooth' });

        clearInterval(scrollInterval);
      }

      counter += 1;
    }, 100);
  };

  // TODO: Refactor this hideous thing
  const getLinkValue = (key: string) => {
    switch (key) {
      case 'termsConditions':
        return '/regulamin.pdf';
      case 'register':
        return '/register';
      default:
        return `/#${key}`;
    }
  };

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
                    <a href={getLinkValue(key)} onClick={() => handleNavClick(key)}>
                      {value}
                    </a>
                  </li>
                ))}
                <RegisterLi>
                  <a href="/payment" onClick={() => setMenuOpen(false)}>
                    Opłać uczestnictwo
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
          <ButtonWrapper>
            <Button type="link" href="/payment">
              Opłać uczestnictwo
            </Button>
          </ButtonWrapper>
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
  z-index: 1;
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

    li {
      font-size: 16px;
    }
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
