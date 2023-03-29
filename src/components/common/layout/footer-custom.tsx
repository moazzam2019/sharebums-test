import { connect } from 'react-redux';
import { IUIConfig } from 'src/interfaces';
import Link from 'next/link';
import { withRouter, NextRouter } from 'next/router';
import './footer-custom.less';
import {
  TwiiterIcon, InstegramIcon
} from 'src/icons';

interface IProps {
  ui: IUIConfig;
  router: NextRouter;
}

const FooterCustom = ({ ui, router }:IProps) => {
  const menus = ui.menus && ui.menus.length > 0
    ? ui.menus.filter((m) => m.section === 'footer')
    : [];
  return (
    <div className="main-footer-custom">
      <div className="copyright-text-cs">
        <span>
          ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          <Link href="/home">
            {ui?.siteName}
          </Link>
        </span>
        <div style={{ whiteSpace: 'nowrap' }}>
          <a href="#">
            <InstegramIcon />
          </a>
          <a href="#">
            <TwiiterIcon />
          </a>
        </div>
      </div>
      <ul className="fotter-content-cs">
        {menus
              && menus.length > 0
              && menus.map((item) => (
                <li key={item._id} className={router.pathname === item.path ? 'active' : ''}>
                  <a rel="noreferrer" href={item.path} target={item.isNewTab ? '_blank' : ''}>
                    {item.title}
                  </a>
                </li>
              ))}

        <li>
          <Link href="/auth/model-landing-page">
            Become a Model
          </Link>
        </li>
      </ul>
    </div>
  );
};
const mapState = (state: any) => ({
  ui: { ...state.ui }
});

export default withRouter(connect(mapState)(FooterCustom)) as any;
