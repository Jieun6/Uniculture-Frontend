import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GiMale, GiFemale } from "react-icons/gi";
import { IoMdPersonAdd } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { BiSolidMessageRounded } from "react-icons/bi";
import styles from './RecommendFriendCard.module.css';
import cardImg from '../../../assets/cardImg.png';
import cardOpenSound from '../../../assets/cardOpen.mp3';
import { Card } from 'antd';
const { Meta } = Card;

export default function RecommendFriendCard({userInfo, sendFriendRequest, sendMessage}) {
    const navigate = useNavigate();
    const [similarity, setSimilarity] = useState(userInfo.similarity);
    const [isFlipped, setIsFlipped] = useState(userInfo.isOpen); //Card 뒤집기

    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

    //카드 뒤집기(추천 친구 보이게)
    const handleCardClick = () => {
        if(!isFlipped) { //카드가 열려있지 않을 때만 
            handleCardOpen();
        }
    }

    //카드 뒤집기 
    const handleCardOpen = async () => {
        try {
            const token = getToken(); // 토큰 가져오기

            const response = await axios.post('/api/auth/friend/recommend/open', {
                targetId: userInfo.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });

            if(response.status === 200){
                console.log(userInfo.nickname + "님 카드 오픈");
                setIsFlipped(true);

                // 소리 재생
                const flipSound = new Audio(cardOpenSound);
                flipSound.play();
            }
            else if(response.status === 400){
                console.log("카드 뒤집기 클라이언트 에러");
            }
            else if(response.status === 500){
                console.log("카드 뒤집기 서버 에러");
            }
        } catch (error) {
            console.error('카드 뒤집기 오류 발생:', error);
        }
    }

    //친구 프로필로 이동
    const handleProfile = () => {
        navigate(`/profile/${userInfo.nickname}`);
    }

    //친구 신청
    const handleSendFriendRequest = () => {
        sendFriendRequest(userInfo);
    }

    //채팅 보내기
    const handleSendMessage = () => {
        sendMessage(userInfo);
    }

    const handleSimilarity = () => {
        if(similarity < 70) setSimilarity(70);
    }

    useEffect(()=> {
        handleSimilarity();
    },[])

    return (
        <div className={`${styles.card} ${isFlipped ? styles.flipped : ""}`} >
            <div className={styles.front} onClick={handleCardClick}>
                <img
                    style={{width: "100%", height: "100%"}}
                    alt="cardimg"
                    src={cardImg}
                />
            </div>
            <div className={styles.back}>
                <Card
                    style={{width: "100%", height: "100%"}}
                    cover={
                        <img
                            alt="profileimg"
                            src={userInfo?.profileImage ? userInfo.profileImage : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                        />
                    }
                    actions={[
                        <span onClick={handleSendFriendRequest}><IoMdPersonAdd size={22}/></span>,
                        <span onClick={handleProfile}><FaHome size={22}/></span>,
                        <span onClick={handleSendMessage}><BiSolidMessageRounded size={22}/></span>
                    ]}
                >
                    <Meta
                        title={
                            <>
                                <div className={styles.similarityText}>나랑 <span className={styles.similaritySpan}>{similarity}%</span> 잘 맞아요!</div>
                                <div style={{display: "flex"}}>
                                {/* 닉네임 */}
                                <div onClick={handleProfile} style={{fontWeight : "bold", fontSize: "15px"}}>{userInfo.nickname}</div>

                                {/* 성별, 나이 */}
                                <div style={{fontWeight:"normal", display:"flex", marginLeft:"10px"}}>
                                    {userInfo?.gender === "MAN" ? (
                                            <GiMale color='blue' size={20} />
                                    ):(
                                        <GiFemale color='red' size={20}/>
                                    )}
                                    <div style={{fontSize:"13px", marginLeft:"3px"}}>{userInfo.age}</div>
                                </div>
                                </div>
                            </>
                        }
                        description={
                            <div style={{display: "flex", flexDirection: "column", color: "black"}}>
                                {/* 소개 */}
                                {userInfo?.introduce ? (
                                    <div className={styles. introduce}>
                                        {userInfo?.introduce}
                                    </div>
                                ) : (
                                    <div style={{height: "20px", textAlign: "left", marginBottom: "5px", color: "#00000073"}}>설정한 소개가 없습니다.</div>
                                )}
                            </div>
                        }
                    />
                </Card>
                {/* <div className={styles.similarity}> */}
                    {/* <div className={styles.heart}>
                    <div className={styles.heart2} >
                    <div className={styles.heart3} > */}
                        {/* <div className={styles.text}> */}
                            {/* {similarity}% */}
                        {/* </div> */}
                    {/* </div>
                    </div>
                    </div> */}
                    
                    {/* <div className={styles.text}> */}

                    {/* </div> */}
                {/* </div> */}
            </div>
        </div>
    )
}
