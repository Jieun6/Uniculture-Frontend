import Layout from "../../components/Layout";
import PercentBar from "../../components/PercentBar/editPercentBar";
import Sidebar from "../../components/ProfileSidebar/Sidebar";
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import AddLanuageModal from "./Modal/AddLanuageModal";

const ProfileEdit = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const selectFile = useRef(null);

    const [isModalOpened1, setIsModalOpened1] = useState(false); //사용 언어 추가 모달창
    const [isModalOpened2, setIsModalOpened2] = useState(false); //학습 언어 추가 모달창

    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };
    
    // 서버에 정보를 요청하는 함수
    const fetchUserInfo = async () => {
        console.log('myPage');
        try {
            const token = getToken(); // 토큰 가져오기
            const response = await axios.get('/api/auth/member/editProfile', {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            if(response.status === 200) {
                setUserInfo(response.data); // 서버에서 받은 사용자 정보 반환
            }
            else if(response.status === 400) {
                console.log('클라이언트 에러(입력 형식 불량)');
            }
            else if(response.status === 500) {
                console.log('서버에러');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    };
    
    useEffect(() => {
        fetchUserInfo();
    }, [])

    //회원정보 수정
    const changeInfo = async () => {
        console.log('changeInfo');
        try {
            const token = getToken(); // 토큰 가져오기
            const response = await axios.patch(
                '/api/auth/member/editProfile',
                {
                    introduce: userInfo.introduce,
                    myHobbyList : userInfo.myHobbyList,
                    myLanguages : userInfo.myLanguages,
                    wantLanguage : userInfo.wantLanguage
                },
                {
                    headers: {
                        'Content-Type': 'application/json', // JSON 형식임을 명시
                        'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
                    }
                }
            );
            alert(JSON.stringify(userInfo));
            console.log('서버 응답: ', response);
            console.log('response.status: ', response.status);
            if (response.status === 200) {
                alert("수정 완료");
                window.location.reload();
            }
            else if (response.status === 400) {
                console.error("클라이언트에러");
            }
            else {
                console.error("서버에러");
            }
        } catch (error) { // 네트워크 오류 등 예외 처리
            console.error(error);
        }
    };

    //소개 변경
    const changeIntroduce = (e) => {
        setUserInfo({...userInfo, introduce : e.target.value});
    };

    // 프로필 사진 변경
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setProfileImg(reader.result);
          event.target.value = ''; //같은 파일 올릴 수 있도록 초기화 해줌
        };
    };

    // 취미 변경
    const handleHobbyChange = (hobby) => {
        // updatedHobbies를 userInfo?.myHobbyList로 초기화
        let updatedHobbies = userInfo?.myHobbyList || [];
            
        if (updatedHobbies.includes(hobby)) {
            // 선택된 취미가 이미 존재하는 경우 : 해당 취미를 제거
            updatedHobbies = updatedHobbies.filter(item => item !== hobby);
        } else {
            // 선택된 취미가 포함되어 있지 않은 경우 :  해당 취미를 추가
            updatedHobbies = [...updatedHobbies, hobby];
        }

        // userInfo를 업데이트
        setUserInfo({ ...userInfo, myHobbyList: updatedHobbies });
    };

    // userInfo.myLanguages 업데이트
    const handleMyLanguages = (language, percent) => {
        // 언어와 퍼센트 값을 사용하여 userInfo 업데이트
        setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            myLanguages: {
                ...prevUserInfo.myLanguages,
                [language]: percent
            }
        }));
    };

    // 사용 언어 삭제 함수
    const deleteMyLanguage = (language) => {
        // 삭제할 언어를 userInfo에서 제거합니다.
        const updatedMyLanguages = { ...userInfo.myLanguages };
        delete updatedMyLanguages[language];
        setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            myLanguages: updatedMyLanguages
        }));
    };

    // userInfo.wantLanguage 업데이트
    const handleWantLanguage = (language, percent) => {
        // 언어와 퍼센트 값을 사용하여 userInfo 업데이트
        setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            wantLanguage: {
                ...prevUserInfo.wantLanguage,
                [language]: percent
            }
        }));
    };

    // 학습 언어 삭제 함수
    const deleteWantLanguage = (language) => {
        // 삭제할 언어를 userInfo에서 제거합니다.
        const updatedWantLanguage = { ...userInfo.wantLanguage };
        delete updatedWantLanguage[language];
        setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            wantLanguage: updatedWantLanguage
        }));
    };

    return (
        <Layout>
            <div className="container-fluid">
                <div className="row">
                    <Sidebar/>

                    <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4" style={{ overflowY: "auto" }}>
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h4 className="h4">프로필 편집</h4>
                        </div>
                        <div className="mb-3 row justify-content-center">
                            <div 
                                className="imageWrapper"
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    overflow: "hidden",
                                    borderRadius: "50%",
                                    padding: "0"
                                }}
                            >
                                <img
                                    src={profileImg ? profileImg : (userInfo?.profileurl ? userInfo.profileurl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")}
                                    alt="profile"
                                    style={{
                                        width:"100%",
                                        height: "100%",
                                        objectFit:"cover"
                                    }}                      
                                />
                            
                            </div>
                        </div>

                        <div className="mb-4 row justify-content-center">
                            <button type="button" style={{width:"80px", marginRight:"15px"}} onClick={()=>{setProfileImg(null); setUserInfo({...userInfo, profileurl: null})}}>삭제</button>
                            <button type="file" style={{width:"80px"}} accept='image/*' onClick={() => selectFile.current.click()} >변경</button>
                            <input 
                                type="file" 
                                accept='image/*'
                                style={{ display: "none" }}
                                ref={selectFile} //input에 접근 하기위해 useRef사용
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="mb-5 row">
                            <label className="col-sm-2 col-form-label">소개</label>
                            <div className="col-sm-10">
                                <input 
                                    className="form-control" 
                                    placeholder="소개 입력" 
                                    value={userInfo?.introduce || ''}
                                    onChange={changeIntroduce}
                                />
                            </div>
                        </div>

                        <div className="mb-5 row">
                            <label className="col-sm-2 col-form-label">취미</label>
                            <div className="col-sm-10">
                                <input type="checkbox" checked={userInfo?.myHobbyList.includes('요리')} onChange={() => handleHobbyChange('요리')} className="btn-check" id="btn-check-1" autoComplete="off"/>
                                <label className="btn btn-outline-primary" htmlFor="btn-check-1">요리</label>

                                <input type="checkbox" checked={userInfo?.myHobbyList.includes('산책')} onChange={() => handleHobbyChange('산책')} className="btn-check" id="btn-check-2" autoComplete="off"/>
                                <label className="btn btn-outline-primary" htmlFor="btn-check-2">산책</label>

                                <input type="checkbox" checked={userInfo?.myHobbyList.includes('쇼핑')} onChange={() => handleHobbyChange('쇼핑')} className="btn-check" id="btn-check-3" autoComplete="off"/>
                                <label className="btn btn-outline-primary" htmlFor="btn-check-3">쇼핑</label>

                                <input type="checkbox" checked={userInfo?.myHobbyList.includes('여행')} onChange={() => handleHobbyChange('여행')} className="btn-check" id="btn-check-4" autoComplete="off"/>
                                <label className="btn btn-outline-primary" htmlFor="btn-check-4">여행</label>

                                <input type="checkbox" checked={userInfo?.myHobbyList.includes('드라이브')} onChange={() => handleHobbyChange('드라이브')} className="btn-check" id="btn-check-5" autoComplete="off"/>
                                <label className="btn btn-outline-primary" htmlFor="btn-check-5">드라이브</label>

                            </div>
                        </div>

                        <div className="mb-2 row">
                            <label className="col-sm-2 col-form-label">사용 언어</label>
                            <div className="col-sm-7 col-form-label">
                                <button style={{borderRadius:"25px",backgroundColor:"#C6CAC3", border:"0px"}} onClick={()=>{setIsModalOpened1(true)}}>Add Language</button>
                                {isModalOpened1&&<AddLanuageModal handleModal={()=>{setIsModalOpened1(false)}} addLanguage={handleMyLanguages}/>}
                            </div>
                            
                        </div>

                        <div className="mb-5 row">
                            {Object.entries(userInfo?.myLanguages || {}).map(([language, percentage]) => (
                                <div key={language} className="mb-2 row">
                                    <label className="col-sm-2"/>
                                    <div className="col-sm-8">
                                        <PercentBar language={language} percentage={percentage} onChange={handleMyLanguages} onDelete={deleteMyLanguage}/>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mb-2 row">
                            <label className="col-sm-2 col-form-label">학습 언어</label>
                            <div className="col-sm-7 col-form-label">
                                <button style={{borderRadius:"25px",backgroundColor:"#C6CAC3", border:"0px"}} onClick={()=>{setIsModalOpened2(true)}}>Add Language</button>
                                {isModalOpened2&&<AddLanuageModal handleModal={()=>{setIsModalOpened2(false)}} addLanguage={handleWantLanguage}/>}
                            </div>
                            
                        </div>

                        <div className="mb-5 row">
                            {Object.entries(userInfo?.wantLanguage || {}).map(([language, percentage]) => (
                                <div key={language} className="mb-2 row">
                                    <label className="col-sm-2"/>
                                    <div className="col-sm-8">
                                        <PercentBar language={language} percentage={percentage} onChange={handleWantLanguage} onDelete={deleteWantLanguage}/>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="row justify-content-center">
                            <button type="button" 
                            style={{
                                width: "109px",
                                height: "34px",
                                marginRight: "25px",
                                marginBottom: "20px",
                                borderRadius:"25px",
                                backgroundColor:"#C6CAC3", 
                                border:"0px"
                            }}
                            onClick={()=>{alert(JSON.stringify(userInfo));}}
                            >
                                취소
                            </button>
                            <button 
                                type="button" 
                                style={{
                                    width: "109px",
                                    height: "34px",
                                    marginBottom: "20px",
                                    borderRadius:"25px",
                                    backgroundColor:"#B7DAA1", 
                                    border:"0px"
                                }}
                                onClick={changeInfo}
                            >
                                수정
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfileEdit;
