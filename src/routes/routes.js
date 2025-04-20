import Home from '~/pages/Home';
import News from '~/pages/News';
import Tables from '~/pages/Tables';
import Login from '~/pages/Login';
import Matches from '~/pages/Matches';
import Detail from '~/pages/Detail';
import Info from '~/pages/User/Info';
import Viewed from '~/pages/User/Viewed';
import Saved from '~/pages/User/Saved';
import Team from '~/pages/Team';
import Result from '~/pages/Result';
import { UserLayout } from '~/layouts';
import { FormLayout } from '~/layouts';
import { AdminLayout } from '~/layouts';
import { DefaultLayout } from '~/layouts';

import Dashboard from '~/pages/Admin/Dashboard';
import Post from '~/pages/Admin/Posts';
import MatchScoreForm from '~/pages/Admin/MatchScoreForm';
import AdminAds from '~/pages/Admin/AdminAds';
import Manager from '~/pages/Admin/Manager';

import config from '~/config';

// Public routes - có thể truy cập khi chưa đăng nhập
export const publicRoutes = [
    { path: config.routes.home, component: Home, layout: DefaultLayout },
    { path: config.routes.news, component: News, layout: DefaultLayout },
    { path: config.routes.tables, component: Tables, layout: DefaultLayout },
    { path: config.routes.matches, component: Matches, layout: DefaultLayout },
    { path: config.routes.detail, component: Detail, layout: DefaultLayout },
    { path: config.routes.login, component: Login, layout: FormLayout },
    { path: config.routes.team, component: Team, layout: DefaultLayout },
    { path: config.routes.result, component: Result, layout: DefaultLayout },
    
];

// Private routes - chỉ có thể truy cập khi đã đăng nhập
export const privateRoutes = [
    // User routes
    { path: config.routes.info, component: Info, layout: UserLayout, requiredRole: 'user' },
    { path: config.routes.viewed, component: Viewed, layout: UserLayout, requiredRole: 'user' },
    { path: config.routes.saved, component: Saved, layout: UserLayout , requiredRole: 'user'},

    // Admin routes
    { path: config.routes.dashboard, component: Dashboard, layout: AdminLayout, requiredRole: 'admin' },
    { path: config.routes.post, component: Post, layout: AdminLayout, requiredRole: 'admin' },
    { path: config.routes.matchscore, component: MatchScoreForm, layout: AdminLayout , requiredRole: 'admin'},
    { path: config.routes.ads, component: AdminAds, layout: AdminLayout , requiredRole: 'admin'},
    { path: config.routes.manager, component: Manager, layout: AdminLayout , requiredRole: 'admin'},
];
