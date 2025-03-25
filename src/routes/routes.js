import Home from '~/pages/Home';
import News from '~/pages/News';
import Tables from '~/pages/Tables';
import Login from '~/pages/Login';
import Matches from '~/pages/Matches';
import Detail from '~/pages/Detail';
import { FormLayout } from '~/layouts';
import Dashboard from '~/pages/Admin/Dashboard';
import Post from '~/pages/Admin/Posts';
import MatchScoreForm from '~/pages/Admin/MatchScoreForm';
import { AdminLayout } from '~/layouts';
// import { HeaderOnly } from '~/layouts';
import config from '~/config';
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.news, component: News },
    { path: config.routes.tables, component: Tables },
    { path: config.routes.matches, component: Matches },
    { path: config.routes.detail, component: Detail },
    { path: config.routes.login, component: Login, layout: FormLayout },
    { path: config.routes.dashboard, component: Dashboard, layout: AdminLayout },
    { path: config.routes.post, component: Post, layout: AdminLayout },
    { path: config.routes.matchscore, component: MatchScoreForm, layout: AdminLayout },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
