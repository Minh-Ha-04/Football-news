import Header from '~/layouts/components/Header';
function HeaderOnly({ children }) {
    return (
        <div>
            <Header />
            <div className="containe">
                <div className="content">{children}</div>
            </div>
        </div>
    );
}

export default HeaderOnly;
