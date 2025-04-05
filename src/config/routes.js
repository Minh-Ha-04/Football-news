import Detail from '~/pages/Detail';

const routes = {
    home: '/',
    news: '/news',
    tables: '/tables',
    matches: '/matches',
    login: '/login',
    detail: '/detail/:slug',

    info: '/user',
    viewed :'/user/viewed',
    saved: '/user/saved',

    dashboard: '/admin',
    post: '/admin/posts',
    matchscore: '/admin/matchscore'
};

export default routes;
