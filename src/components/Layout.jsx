import Header from "./Header/Header";

const Layout = (props) => {
    return (
        <div style={{ backgroundColor: '#FBFBF3' }}>
            <Header />
            <div style={{ minHeight: '100vh', padding: "0 100px" }}>
                {props.children}
            </div>
        </div>
    );
};

export default Layout;
