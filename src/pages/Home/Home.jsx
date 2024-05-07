import Header from "../../components/Header/Header";
import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import './Home.css';
import TotalBoardList from "../BoardList/TotalBoardList";
import DailyBoardList from "../BoardList/DailyBoardList";
import HelpBoardList from "../BoardList/HelpBoardList";
import FriendBoardList from "../BoardList/FriendBoardList";
import { Select, Space } from 'antd';

const Home = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [activeTab, setActiveTab] = useState('total'); //컴포넌트 선택

    const getToken = () => {
        return localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
    };

    useEffect(() => {
        const token = getToken();
        setIsLogin(!!token); // 토큰이 존재하면 true, 없으면 false로 설정
    }, []);

    // 전체/일상/도움 선택
    const renderTabContent = () => {
        switch (activeTab) {
            case 'total':
                return (
                    <div>
                        <TotalBoardList />
                    </div>
                );
            case 'daily':
                return (
                    <div>
                        <DailyBoardList />
                    </div>
                );
            case 'help':
                return (
                    <div>
                        <HelpBoardList />
                    </div>
                );
            case 'friend':
                return (
                    <div>
                        <FriendBoardList/>
                    </div>
                )
            default:
                return null;
        }
    };

    return (
        <div className="home-layout">
            <Header />
            <div className="home-nav-layout">
                <div className="navbar">
                    <span>
                        <ul className="nav nav-underline nav-tab">
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'total' ? 'active' : ''}`} style={{color: "black"}}
                                        onClick={() => setActiveTab('total')}>전체</button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'daily' ? 'active' : ''}`} style={{color: "black"}}
                                        onClick={() => setActiveTab('daily')}>일상</button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'help' ? 'active' : ''}`} style={{color: "black"}}
                                        onClick={() => setActiveTab('help')}>도움</button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'friend' ? 'active' : ''}`} style={{color: "black"}}
                                        onClick={() => setActiveTab('friend')}>친구</button>
                            </li>
                        </ul>
                    </span>

                    <span>
                        <span className="select-style">
                            <Select
                                defaultValue="default"
                                style={{
                                    width: 100,
                                }}
                                options={[
                                    {
                                        value: 'default',
                                        label: '최신순',
                                    },
                                    {
                                        value: 'viewCount',
                                        label: '조회순',
                                    },
                                    {
                                        value: 'likeCount',
                                        label: '좋아요순'
                                    },
                                    {
                                        value: 'commentCount',
                                        label: '댓글순'
                                    },
                                ]}
                            />
                        </span>

                        {isLogin ? (
                            <button className="write-button" onClick={() => {
                                // navigate("/add-board", {state : {from : location.pathname}});
                                navigate("/post/new?type=post")
                            }}>
                                글쓰기
                            </button>
                        ) : (
                            <></>
                        )}
                    </span>
                </div>
            </div>
            <div className="home-content-layout">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Home;