import "./card.scss";
import {useNavigate} from "react-router-dom";
import { IoMdHeart } from "react-icons/io";
import {useTranslation} from "react-i18next";

export const Card = ({board_id, title, content, username, date, img, likeCount,commentCount, style,profileImg}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    //해당 게시물의 프로필로 이동
    const handleProfile = () => {
        navigate(`/profile/${username}`);
    }
 
    return (
        <div className="card-wrapper" style={style}>
            <div className="card-body-img">
                <img src={img? img:"/default_image.jpg"} alt="Card Image" onClick={() => {navigate(`/board/${board_id}`)}}/>
            </div>
            <div className="card-body-text" onClick={() => {navigate(`/board/${board_id}`)}}>
                <div className="card-body-text-title">{title}</div>
                <div className="card-body-text-content">{content.replace(/(<([^>]+)>)/gi, '')}</div>
                <div className="card-body-text-bottom">
                    <span>{date}</span>
                    <span> · {t('comments.count', { count: commentCount })}</span>
                </div>
            </div>

            <div className="card-footer">
                <div className="username" onClick={handleProfile}>
                    <img src={profileImg ? profileImg :"/default_profile_image.jpg"} alt="User Image" />by {username}
                </div>
                <div className="likeCount">
                    <IoMdHeart style={{marginRight: '5px', marginBottom: '3px'}}/>
                    {likeCount}
                </div>
            </div>
        </div>
    );
};